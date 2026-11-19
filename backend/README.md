# Backend Laravel — Mapa de Oportunidades

Base de datos relacional con migraciones para la aplicación de geolocalización del documento **Objetivo de la aplicación**.

## Requisitos

- PHP 8.2+
- Composer 2+
- **MySQL 8.0+** (necesario para la columna espacial `POINT` con SRID 4326)

## Instalación

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Crear la base de datos:

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurar `DB_*` en `.env` y ejecutar:

```bash
php artisan migrate
```

> Según lo solicitado, **no se incluye seeder**: las migraciones crean la estructura y los datos se cargarán por otro medio.

## Tablas creadas

| Tabla | Propósito |
|---|---|
| `roles`, `role_user` | Roles: emprendedor, comercio, administrador |
| `users` | Usuarios con autorización de privacidad (contacto/ubicación) |
| `categories` | Categorías de productos (jerárquicas) |
| `establishments` | 162 comercios con lat/lon, condiciones, verificación y columna espacial |
| `category_establishment` | Categorías que vende cada comercio |
| `establishment_needs` | Productos que busca el comercio |
| `establishment_requirements` | Requisitos de ingreso (documentos, muestras, presentación) |
| `establishment_purchase_conditions` | Contado / crédito / consignación, pedido inicial, devoluciones |
| `establishment_contacts` | Contacto comercial y medio autorizado (incluye oficina central) |
| `products` | Catálogo del emprendedor |
| `opportunities` | Mis oportunidades con los 6 estados + "No concretada" |
| `opportunity_histories` | Historial de cambios de estado |
| `proposals`, `proposal_products` | Propuestas y productos enviados |
| `proposal_responses` | Me interesa / Solicito información / Agendar visita / No interesado |
| `reports` | Reportar información incorrecta |
| `establishment_verifications` | Verificación administrativa y fecha de última verificación |
| `activities` | Registro de actividad para reportes |
| `cache`, `jobs`, `sessions` | Soporte estándar de Laravel |

## Notas de diseño

- `establishments.location` es una columna **generada** `POINT NOT NULL SRID 4326` derivada de `latitude`/`longitude`, con índice `SPATIAL` para consultas por distancia.
- Los emprendedores solo pueden consultar sus propias oportunidades: todas las tablas de negocio llevan `user_id` y la consulta debe filtrarse por el usuario autenticado.
- Un comercio puede estar registrado en el mapa sin haber confirmado que recibe proveedores: `has_account` y `supplier_confirmed` son independientes de `receives_suppliers`.
