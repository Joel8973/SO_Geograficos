# Backend Laravel — Mapa de Oportunidades

Base de datos relacional con migraciones para la aplicación de geolocalización del documento **Objetivo de la aplicación**.

## Requisitos

- PHP 8.2+
- Composer 2+
- **MySQL 8.0+** (recomendado; crea la columna espacial `POINT` SRID 4326) o **MariaDB 10.x** (la migración espacial se omite automáticamente)

## Instalación (después de clonar)

Los comandos completos, válidos para Linux/macOS/Windows, están en el [README principal](../README.md). Resumen:

```bash
# desde la raíz del repositorio
bash scripts/mysql-podman.sh      # usa Podman o Docker; omite si ya tienes MySQL 8
cd backend
composer install
cp .env.example .env             # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php -S 127.0.0.1:8000 -t public public/index.php
```

`backend/.env` **no está versionado**: debes copiarlo en cada computadora que clone el proyecto.

Crear la base de datos manualmente (solo si no usas el script):

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configurar `DB_*` en `.env` y ejecutar:

```bash
php artisan migrate
php artisan db:seed
```

`DatabaseSeeder` carga los roles, las categorías y los **162 establecimientos** desde `../data/establecimientos.json`. Es idempotente porque usa `updateOrCreate` por `external_code`.

## Endpoints

| Ruta | Descripción |
|---|---|
| `GET /` | Página principal (`resources/views/inicio.blade.php`) |
| `GET /api/establishments` | Establecimientos desde la base de datos |
| `POST /auth/register` | Registro de usuario |
| `POST /auth/login` | Inicio de sesión |
| `GET /auth/me` | Usuario autenticado |
| `POST /auth/logout` | Cierre de sesión |
| `GET|POST /api/products` | Listar / crear productos del usuario |
| `PUT|DELETE /api/products/{id}` | Editar / eliminar producto |

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

- En MySQL 8, `establishments.location` es una columna **generada** `POINT NOT NULL SRID 4326` derivada de `latitude`/`longitude`, con índice `SPATIAL`. En MariaDB esa migración se omite y se usan solo `latitude`/`longitude`.
- Los emprendedores solo pueden consultar sus propias oportunidades: todas las tablas de negocio llevan `user_id` y la consulta debe filtrarse por el usuario autenticado.
- Un comercio puede estar registrado en el mapa sin haber confirmado que recibe proveedores: `has_account` y `supplier_confirmed` son independientes de `receives_suppliers`.
