# Mapa de Oportunidades — SO_Geograficos

Aplicación web progresiva (PWA) de geolocalización que conecta **emprendedores** con **tiendas de barrio, minimercados y supermercados** donde pueden ofrecer sus productos. Cubre desde la búsqueda del establecimiento hasta la colocación del producto en percha.

## cumulative Cumplimiento del documento “Objetivo de la aplicación”

| Requisito del documento | Implementado en |
|---|---|
| 1. Tipos de usuarios (emprendedor, comercio, administrador) | Menú ☰ → Iniciar sesión (control por roles) |
| 2. Mapa de oportunidades con marcadores, búsqueda, filtros, mapa/listado, ficha y “Cómo llegar” | `index.html` + `js/app.js` (Leaflet + OpenStreetMap) |
| 3. Ficha completa del establecimiento (datos, categorías, productos buscados, recepción, contacto, horario, requisitos, condiciones, verificación, decisión en supermercados) | `App.verFicha()` |
| 4. Perfil del emprendedor y catálogo (foto, categoría, precios, mínimo, capacidad, vida útil, zonas, documentos, compartir y PDF) | Vista **Productos** |
| 5. Vinculación producto ↔ establecimiento con explicación de coincidencia y aviso de no garantía | Botón **Buscar dónde ofrecerlo** |
| 6. Guardar, contactar (canal autorizado) y enviar propuesta; respuestas del comercio y registro manual | Ficha del establecimiento |
| 7. Seguimiento (“Mis oportunidades”) con 6 estados + “No concretada”, notas, próxima gestión y condiciones | Vista **Oportunidades** |
| 8. Registro de comercios, detección de duplicados, corrección de ubicación, reportar info, fecha de verificación, carga de Excel | Menú ☰ y Panel **Admin** |
| 9. Condiciones técnicas: web adaptable, PWA, geolocalización + manual, roles, privacidad, panel admin, código fuente, costos | Este repositorio + `DOCUMENTACION.md` |
| 10. Alcance de la primera versión | Todas las pantallas anteriores (pagos, inventarios y logística quedan para segunda etapa) |

## ▶️ Ejecutar

No requiere instalación de dependencias de pago.

```bash
cd SO_Geograficos
python3 -m http.server 8080
# Abrir http://localhost:8080
```

También funciona abriendo `index.html` directamente. Para instalarla como PWA, usar el servidor local y la opción “Agregar a pantalla de inicio” del navegador.

## 🗂️ Estructura

- `index.html` — interfaz y secciones
- `css/styles.css` — diseño adaptable a celular
- `js/data.js` — **162 establecimientos** del cantón Latacunga extraídos del Excel
- `js/app.js` — toda la lógica de negocio
- `data/establecimientos.json` — fuente de datos original convertida a JSON
- `manifest.webmanifest`, `sw.js`, `icon.svg` — PWA
- `DOCUMENTACION.md` — documentación, arquitectura, costos y propiedad

## 📊 Datos

Los datos provienen de `Lacteos_Datos_Unificados_Consolidado (1).xlsx` (162 establecimientos encuestados en Latacunga, Cotopaxi), con latitud/longitud reales. Incluyen tipo, dirección, parroquia/sector, contacto, horario, categorías de lácteos, interés en nuevos proveedores, refrigeración, volumen y observaciones comerciales.

> Nota: la compatibilidad mostrada entre producto y comercio es **orientativa y no garantiza aceptación**, tal como exige el documento.

## 🗄️ Backend Laravel (base de datos)

La carpeta [`backend/`](backend/) contiene el proyecto Laravel 11 con **22 migraciones**, modelos Eloquent y enums para la base de datos MySQL (incluye columna espacial `POINT` para búsquedas por distancia). No incluye seeder, según lo solicitado.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# crear la BD so_geograficos en MySQL 8+
php artisan migrate
```

Ver [`backend/README.md`](backend/README.md) y [`DOCUMENTACION.md`](DOCUMENTACION.md) para el detalle de tablas.

## 🔐 Privacidad

La geolocalización y la publicación de contactos se usan con fines de gestión comercial. La aplicación solicita autorización al usar el GPS y permite ingresar la ubicación manualmente si no se activa. Cada emprendedor solo ve sus propias propuestas, notas y negociaciones (filtradas por `usuarioId`).
