# Mapa de Oportunidades — SO_Geograficos

Aplicación web que conecta emprendedores con tiendas de barrio, minimercados y supermercados de **Latacunga (Cotopaxi)** para encontrar posibles puntos de venta de sus productos.

Incluye un mapa con **162 establecimientos encuestados**, fichas con condiciones comerciales, registro de productos, búsqueda de coincidencias ("¿dónde ofrecerlo?") y un módulo de **oportunidades comerciales con seguimiento** (7 estados, notas privadas, próxima fecha de gestión y condiciones acordadas) persistido en MariaDB/MySQL.

---

## Inicio rápido — copiar y pegar

### Frontend (demo estática, puerto 8080)

Desde la **raíz del repositorio**:

```bash
cd SO_Geograficos
python3 -m http.server 8080
```

Abre **http://localhost:8080**. Ahí ves mapa, listado, fichas, filtros y productos. No necesita PHP ni base de datos. `Ctrl + C` lo detiene.

### Backend + base de datos (puerto 8000)

En **otra terminal**, desde la raíz del repositorio:

```bash
cd SO_Geograficos
mkdir -p backend/storage/framework/views backend/storage/framework/cache/data backend/storage/framework/sessions backend/storage/logs backend/bootstrap/cache
chmod -R u+rwX backend/storage backend/bootstrap/cache
bash scripts/mysql-podman.sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan serve --host=127.0.0.1 --port=8000
```

Abre **http://localhost:8000**. Ahí se usan la BD, las sesiones y el módulo de oportunidades. `Ctrl + C` lo detiene.

> El `mkdir` evita el error `Please provide a valid cache path`. Los directorios ya vienen con un `.gitignore` en el repo, pero crearlo de nuevo no hace daño. Si `backend/.env` ya existe, omite las líneas `cp` y `php artisan key:generate` para no perder tu configuración.

---

## Formas de ejecutar el proyecto

Hay **dos entradas distintas**. Elige una u otra según lo que necesites:

| Modo | Dirección | Datos | Cuándo usarlo |
|---|---|---|---|
| **A. Demo rápida (PWA estática)** | http://localhost:8080 | `localStorage` del navegador | Ver el diseño, probar filtros, modales y mapa sin instalar PHP ni base de datos |
| **B. Aplicación completa (Laravel)** | http://localhost:8000 | MySQL/MariaDB + sesiones Laravel | Probar registro/login, establecimientos desde BD, CRUD de productos y oportunidades con seguimiento |

> El modo A es el más rápido. El modo B es el que usa la API y la base de datos. Ambos pueden estar abiertos al mismo tiempo.
>
> **Cambio reciente:** guardar oportunidades, cambiar estados y registrar seguimiento ya llama a la API de Laravel. Esas acciones funcionan en el **modo B** (`:8000`) con la sesión iniciada. En el modo A (`:8080`) el mapa, filtros y fichas siguen funcionando, pero el módulo de oportunidades ya no guarda nada.

---

## ¿Qué puedo hacer con la aplicación?

- Ver los establecimientos en un mapa o listado, con búsqueda, filtros y "Mi ubicación".
- Consultar la ficha de cada comercio: dirección, horario, categorías, requisitos, refrigeración y condiciones de compra.
- Registrar productos y usar **Buscar dónde ofrecerlo** para obtener comercios compatibles.
- Guardar un comercio como oportunidad, moverlo por las **7 etapas** (Por contactar → Contactado → Muestra entregada → En negociación → Primer pedido → Punto de venta activo / No concretada) y registrar notas privadas, próxima gestión y condiciones acordadas; cada cambio de estado queda en el historial.
- Enviar propuestas y administrar establecimientos, usuarios, categorías y reportes desde el panel.
- Registrarse / iniciar sesión desde el menú ☰ (modo Laravel). El registro asigna automáticamente el rol `emprendedor`, necesario para guardar oportunidades.

---

## Tecnologías

| Parte | Tecnología |
|---|---|
| Demo estática | HTML5, CSS3, JavaScript ES6, Google Maps JavaScript API + Geocoding API, Service Worker (PWA) |
| Persistencia de la demo | `localStorage` del navegador |
| Aplicación integrada | Laravel 12 + Blade (vistas en `backend/resources/views`) |
| Autenticación | Sesiones Laravel (no Sanctum ni JWT) |
| Oportunidades | API REST (`OpportunityController`) + tablas `opportunities` y `opportunity_histories` |
| Backend | PHP 8.2+, controladores REST en `backend/app/Http/Controllers` |
| Base de datos | MySQL 8 (recomendado) o MariaDB 10.x |
| Herramientas | Python 3, Composer 2, Podman o Docker |

---

## Estructura del proyecto

```text
SO_Geograficos/
├── index.html                      # Demo estática / PWA (diseño actual)
├── css/styles.css                  # Estilos de la demo estática
├── js/
│   ├── config.js                   # Clave de Google Maps (demo estática)
│   ├── data.js                     # Los 162 establecimientos para la demo
│   └── app.js                      # Lógica de la demo (localStorage)
├── data/establecimientos.json      # Datos originales; los usa el seeder
├── backend/
│   ├── app/Http/Controllers/       # AuthController, ProductController y OpportunityController
│   ├── app/Enums/OpportunityStatus.php   # Los 7 estados de una oportunidad
│   ├── app/Models/Opportunity.php  # Oportunidad + changeStatus()
│   ├── app/Models/OpportunityHistory.php # Historial de cambios de estado
│   ├── database/seeders/           # DatabaseSeeder: roles, categorías y 162 comercios
│   ├── database/migrations/        # 23 migraciones (incluye opportunities e opportunity_histories; MariaDB omite la espacial)
│   ├── resources/views/inicio.blade.php  # Página servida por Laravel en /
│   ├── public/                     # Assets propios de la app Laravel
│   │   ├── css/styles.css
│   │   └── js/{config,data,app}.js # app.js integrado con peticionLaravel() a la API
│   ├── routes/web.php              # / , /auth/* , /api/products , /api/opportunities
│   └── routes/api.php              # /api/establishments
├── scripts/mysql-podman.sh         # Inicia MySQL 8 con Podman/Docker
├── manifest.webmanifest            # Configuración PWA (demo estática)
├── sw.js                           # Service Worker (demo estática)
├── DOCUMENTACION.md                # Documentación técnica detallada
└── README.md                       # Esta guía
```

---

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| Git | Cualquiera reciente | Descargar el proyecto |
| Python | 3.8 o superior | Servir la demo estática (modo A) |
| PHP | 8.2 o superior (`mbstring`, `xml`, `curl`, `zip`, `pdo_mysql`) | Solo modo B |
| Composer | 2 o superior | Solo modo B |
| Podman o Docker | Cualquiera | Solo modo B, si no tienes MySQL/MariaDB local |

Comprobarlo:

```bash
git --version && python3 --version && php --version && composer --version && (podman --version || docker --version)
```

### Instalar las herramientas (solo si faltan)

**Fedora / RHEL:**

```bash
sudo dnf install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-pdo php-mysqlnd composer podman
```

**Ubuntu / Debian:**

```bash
sudo apt update && sudo apt install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-mysql composer docker.io
```

**Windows:** instala Git for Windows, Python, PHP 8.2+, Composer y Docker Desktop; ejecuta los comandos desde **Git Bash**. Usa `py -m http.server 8080` y `copy .env.example .env`.

---

## Ejecución paso a paso (copiar y pegar)

### 1. Descargar el proyecto

```bash
git clone https://github.com/Joel8973/SO_Geograficos.git
cd SO_Geograficos
```

> Si ya tienes la carpeta, solo ejecuta `cd SO_Geograficos` y luego `git pull`.

### 2. Modo A — Demo rápida (sin backend)

```bash
python3 -m http.server 8080
```

Abre **http://localhost:8080**. Con esto funcionan mapa, listado, fichas, filtros y productos; todo se guarda en el navegador. Las oportunidades ahora requieren el modo B (ver nota más arriba). Presiona **Ctrl + C** para detenerlo.

### 3. Modo B — Aplicación completa (Laravel + BD)

En una **segunda terminal**, pega todo este bloque:

```bash
cd SO_Geograficos
mkdir -p backend/storage/framework/views backend/storage/framework/cache/data backend/storage/framework/sessions backend/storage/logs backend/bootstrap/cache
chmod -R u+rwX backend/storage backend/bootstrap/cache
bash scripts/mysql-podman.sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan serve --host=127.0.0.1 --port=8000
```

Abre **http://localhost:8000**. Ahí la página es `backend/resources/views/inicio.blade.php` y los datos vienen de MySQL/MariaDB. El `mkdir` es obligatorio la primera vez: sin esos directorios Laravel responde `Please provide a valid cache path`.

- `scripts/mysql-podman.sh` levanta el contenedor `so_geo_mysql` con MySQL 8, base `so_geograficos`, usuario `root`, contraseña vacía y puerto `3306`.
- `php artisan db:seed --force` carga roles, categorías y los **162 establecimientos** desde `data/establecimientos.json`. Es seguro repetirlo: usa `updateOrCreate`.
- Si ya tienes MySQL/MariaDB instalado, omite el script y crea la base manualmente:

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- Si tu base usa otra contraseña o usuario, edita `backend/.env` antes de migrar.
- Mantén la terminal abierta mientras uses la aplicación. **Ctrl + C** la detiene.

#### Para usar oportunidades (módulo integrado con Laravel)

1. En http://localhost:8000 abre el menú ☰ y crea un usuario (o usa `POST /auth/register`). Queda autenticado con el rol `emprendedor`.
2. Busca un comercio en el mapa o listado y pulsa **Guardar oportunidad**. Se crea en estado `por_contactar`; si repites la acción no se duplica (hay un único registro por `usuario + establecimiento`).
3. En **Oportunidades** cambia el estado desde el selector, o pulsa **✏️ Notas y gestión** para guardar notas privadas, fecha de próxima gestión y condiciones acordadas. Todo se guarda en MariaDB/MySQL y cada cambio de estado se escribe en `opportunity_histories`.
4. Los estados `Punto de venta activo` y `No concretada` cierran la oportunidad (campo `closed_at`).

> Las tablas `opportunities` y `opportunity_histories` ya se crean con `php artisan migrate --force`; no hay que ejecutar nada adicional.

---

## Comprobar que todo funciona

| Servicio | Dirección | Respuesta esperada |
|---|---|---|
| Demo estática | http://localhost:8080 | "Mapa de Oportunidades" con 162 resultados |
| App Laravel | http://localhost:8000 | Página principal servida por Blade |
| API de establecimientos | http://localhost:8000/api/establishments | JSON con 162 registros |
| API de oportunidades | http://localhost:8000/api/opportunities | `401` sin sesión; JSON con tus oportunidades al iniciar sesión |
| Base de datos | `127.0.0.1:3306` | Conexión aceptada |

### Endpoints disponibles en el modo B

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Página principal (Blade) |
| `GET` | `/api/establishments` | Listado de comercios desde la BD |
| `POST` | `/auth/register` | Crear usuario |
| `POST` | `/auth/login` | Iniciar sesión |
| `GET` | `/auth/me` | Usuario autenticado |
| `POST` | `/auth/logout` | Cerrar sesión |
| `GET` | `/api/products` | Productos del usuario |
| `POST` | `/api/products` | Crear producto |
| `PUT` | `/api/products/{id}` | Editar producto |
| `DELETE` | `/api/products/{id}` | Eliminar producto |
| `GET` | `/api/opportunities` | Mis oportunidades (con establishment) |
| `POST` | `/api/opportunities` | Guardar establecimiento como oportunidad (rol `emprendedor`) |
| `PATCH` | `/api/opportunities/{id}` | Actualizar estado, notas, próxima gestión y condiciones |

> Ya no existe `/api/health`; fue reemplazado por `/api/establishments`. Las rutas `/auth/*`, `/api/products` y `/api/opportunities` requieren sesión; `/` y `/api/establishments` son públicas.

---

## Configurar Google Maps (recomendado)

Las dos copias de `config.js` ya traen una clave configurada. Si quieres usar la tuya, cámbiala en **ambos** archivos:

- `js/config.js` → demo estática (http://localhost:8080)
- `backend/public/js/config.js` → app Laravel (http://localhost:8000)

```javascript
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'TU_API_KEY_AQUI',
  mapaInicialZoom: 11
};
```

1. En https://console.cloud.google.com/google/maps-apis/ habilita **Maps JavaScript API** y **Geocoding API**.
2. Crea una clave en **Credenciales → Crear credencial → Clave de API**.
3. Restringe los referenciadores HTTP, por ejemplo `http://localhost:8080/*` y `http://localhost:8000/*`.
4. Guarda y recarga la página.

> La clave es visible en el navegador (normal en Maps JS), por eso debe estar restringida por dominio. Sin clave, el mapa muestra un aviso pero el listado sigue funcionando.

---

## Datos: qué se guarda en cada modo

| Dato | Modo A (localStorage) | Modo B (BD) |
|---|---|---|
| 162 establecimientos | `js/data.js` | Tabla `establishments` vía seeder |
| Usuarios y roles | No | `users`, `roles` (registro = `emprendedor`) |
| Categorías | `localStorage` | `categories` |
| Productos | `localStorage` | `products` (CRUD autenticado) |
| Oportunidades y su historial | No funciona en la demo (la lógica apunta a la API) | `opportunities` + `opportunity_histories` (GET/POST/PATCH) |
| Propuestas y reportes | `localStorage` | Tablas creadas, aún sin CRUD en la app Laravel |

---

## Limitaciones conocidas

- El módulo de oportunidades quedó migrado a Laravel: en la demo estática (`:8080`) los botones de guardar, cambio de estado y seguimiento llaman a la API y **ya no funcionan**. Usa `:8000` e inicia sesión.
- La demo estática y la app Laravel **tienen archivos propios**. El diseño renovado está en `index.html` y `css/styles.css` de la raíz; la app Laravel usa `backend/resources/views/inicio.blade.php` y `backend/public/css/styles.css`. Si cambias la raíz, copia los cambios a la carpeta `backend` para verlos en el puerto 8000.
- En la app Laravel, el botón **Perfil** aún no abre un panel propio; usa el menú ☰ para iniciar sesión o registrarte.
- En MariaDB la migración espacial omite la columna `POINT` SRID 4326; en MySQL 8 se crea normalmente.
- Propuestas y reportes siguen sin CRUD en Laravel (solo en `localStorage`).

---

## Problemas comunes

| Problema | Solución |
|---|---|
| La página se ve sin estilos (HTML plano) | Usa `php artisan serve`, no `php -S ... public/index.php`: con ese comando el CSS/JS también pasan por Laravel y devuelven HTML. Recarga con `Ctrl + F5`. |
| `Please provide a valid cache path` (HTTP 500) | Faltan `storage/framework/views`, `cache` y `sessions`. Ejecuta el `mkdir` y `chmod` del paso 3 (o del inicio rápido) dentro de `backend`. |
| `Malformed UTF-8 characters, possibly incorrectly encoded` en `/api/establishments` | La columna espacial `location` es binaria; ya está ocultada en `backend/app/Models/Establishment.php` con `protected $hidden = ['location']`. |
| `Route [login] not defined` al entrar sin sesión | Ya hay una ruta `GET /login` llamada `login` en `backend/routes/web.php` que devuelve `401` en JSON. |
| `Address already in use` | El puerto está ocupado. Usa `8081`/`8001` y actualiza los referenciadores de Google Maps. |
| El mapa no aparece | Revisa la clave en el `config.js` del modo que estés usando y que ambas API estén habilitadas. |
| `Connection refused` al migrar | Verifica que `bash scripts/mysql-podman.sh` terminó correctamente. |
| Composer o PHP dan error | Comprueba versiones y extensiones con el comando de Requisitos. |
| `Nothing to migrate` | No es un error: las migraciones ya se ejecutaron. |
| `class "Role" not found` o tablas vacías | Ejecuta `php artisan migrate --force && php artisan db:seed --force` dentro de `backend`. |
| "Inicia sesión como emprendedor" al guardar | Regístrate desde el menú ☰ en `:8000`; el registro asigna el rol automáticamente. |
| "No se pudieron cargar las oportunidades" | Confirma la sesión en `:8000` y que `php artisan migrate --force` creó `opportunities`. |
| El botón Guardar no hace nada en `:8080` | Es esperado: usa el modo B (`:8000`), donde oportunidades ya se guardan en la BD. |
| La página no carga | Confirma qué terminal sigue activa: `:8080` para demo, `:8000` para Laravel. |

---

## Más información

- [DOCUMENTACION.md](DOCUMENTACION.md): arquitectura, usuarios, flujo principal, costos y alcance.
- [backend/README.md](backend/README.md): detalle de tablas y notas del backend.
