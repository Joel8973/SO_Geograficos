# Mapa de Oportunidades — SO_Geograficos

Aplicación web que conecta emprendedores con tiendas de barrio, minimercados y supermercados de **Latacunga (Cotopaxi)** para encontrar posibles puntos de venta de sus productos.

Incluye un mapa con **162 establecimientos encuestados**, fichas con condiciones comerciales, registro de productos, búsqueda de coincidencias ("¿dónde ofrecerlo?"), seguimiento de oportunidades y panel administrativo.

---

## Formas de ejecutar el proyecto

Hay **dos entradas distintas**. Elige una u otra según lo que necesites:

| Modo | Dirección | Datos | Cuándo usarlo |
|---|---|---|---|
| **A. Demo rápida (PWA estática)** | http://localhost:8080 | `localStorage` del navegador | Ver el diseño, probar filtros, modales y mapa sin instalar PHP ni base de datos |
| **B. Aplicación completa (Laravel)** | http://localhost:8000 | MySQL/MariaDB + sesiones Laravel | Probar registro/login, establecimientos desde BD y CRUD de productos |

> El modo A es el más rápido. El modo B es el que usa la API y la base de datos. Ambos pueden estar abiertos al mismo tiempo.

---

## ¿Qué puedo hacer con la aplicación?

- Ver los establecimientos en un mapa o listado, con búsqueda, filtros y "Mi ubicación".
- Consultar la ficha de cada comercio: dirección, horario, categorías, requisitos, refrigeración y condiciones de compra.
- Registrar productos y usar **Buscar dónde ofrecerlo** para obtener comercios compatibles.
- Guardar oportunidades, enviar propuestas y registrar el avance hasta **Primer pedido** o **Punto de venta activo**.
- Administrar establecimientos, usuarios, categorías y reportes desde el panel.
- Iniciar sesión / registrarse desde el menú ☰ (modo Laravel).

---

## Tecnologías

| Parte | Tecnología |
|---|---|
| Demo estática | HTML5, CSS3, JavaScript ES6, Google Maps JavaScript API + Geocoding API, Service Worker (PWA) |
| Persistencia de la demo | `localStorage` del navegador |
| Aplicación integrada | Laravel 12 + Blade (vistas en `backend/resources/views`) |
| Autenticación | Sesiones Laravel (no Sanctum ni JWT) |
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
│   ├── app/Http/Controllers/       # AuthController y ProductController
│   ├── database/seeders/           # DatabaseSeeder: roles, categorías y 162 comercios
│   ├── database/migrations/        # 22 migraciones (MariaDB omite la columna espacial)
│   ├── resources/views/inicio.blade.php  # Página servida por Laravel en /
│   ├── public/                     # Assets propios de la app Laravel
│   │   ├── css/styles.css
│   │   └── js/{config,data,app}.js # app.js integrado con fetch a la API
│   ├── routes/web.php              # / , /auth/* , /api/products
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

Abre **http://localhost:8080**. Con esto ya funcionan mapa, listado, fichas, filtros, productos y oportunidades; todo se guarda en el navegador. Presiona **Ctrl + C** para detenerlo.

### 3. Modo B — Aplicación completa (Laravel + BD)

En una **segunda terminal**, pega todo este bloque:

```bash
cd SO_Geograficos
bash scripts/mysql-podman.sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php -S 127.0.0.1:8000 -t public public/index.php
```

Abre **http://localhost:8000**. Ahí la página es `backend/resources/views/inicio.blade.php` y los datos vienen de MySQL/MariaDB.

- `scripts/mysql-podman.sh` levanta el contenedor `so_geo_mysql` con MySQL 8, base `so_geograficos`, usuario `root`, contraseña vacía y puerto `3306`.
- `php artisan db:seed --force` carga roles, categorías y los **162 establecimientos** desde `data/establecimientos.json`. Es seguro repetirlo: usa `updateOrCreate`.
- Si ya tienes MySQL/MariaDB instalado, omite el script y crea la base manualmente:

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- Si tu base usa otra contraseña o usuario, edita `backend/.env` antes de migrar.
- Mantén la terminal abierta mientras uses la aplicación. **Ctrl + C** la detiene.

---

## Comprobar que todo funciona

| Servicio | Dirección | Respuesta esperada |
|---|---|---|
| Demo estática | http://localhost:8080 | "Mapa de Oportunidades" con 162 resultados |
| App Laravel | http://localhost:8000 | Página principal servida por Blade |
| API de establecimientos | http://localhost:8000/api/establishments | JSON con 162 registros |
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

> Ya no existe `/api/health`; fue reemplazado por `/api/establishments`.

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
| Usuarios y roles | No | `users`, `roles` |
| Categorías | `localStorage` | `categories` |
| Productos | `localStorage` | `products` (CRUD autenticado) |
| Oportunidades, propuestas y reportes | `localStorage` | Tablas creadas, aún sin CRUD en la app Laravel |

---

## Limitaciones conocidas

- La demo estática y la app Laravel **tienen archivos propios**. El diseño renovado está en `index.html` y `css/styles.css` de la raíz; la app Laravel usa `backend/resources/views/inicio.blade.php` y `backend/public/css/styles.css`. Si cambias la raíz, copia los cambios a la carpeta `backend` para verlos en el puerto 8000.
- En la app Laravel, el botón **Perfil** aún no abre un panel propio; usa el menú ☰ para iniciar sesión o registrarte.
- En MariaDB la migración espacial omite la columna `POINT` SRID 4326; en MySQL 8 se crea normalmente.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| `Address already in use` | El puerto está ocupado. Usa `8081`/`8001` y actualiza los referenciadores de Google Maps. |
| El mapa no aparece | Revisa la clave en el `config.js` del modo que estés usando y que ambas API estén habilitadas. |
| `Connection refused` al migrar | Verifica que `bash scripts/mysql-podman.sh` terminó correctamente. |
| Composer o PHP dan error | Comprueba versiones y extensiones con el comando de Requisitos. |
| `Nothing to migrate` | No es un error: las migraciones ya se ejecutaron. |
| `class "Role" not found` o tablas vacías | Ejecuta `php artisan migrate --force && php artisan db:seed --force` dentro de `backend`. |
| La página no carga | Confirma qué terminal sigue activa: `:8080` para demo, `:8000` para Laravel. |

---

## Más información

- [DOCUMENTACION.md](DOCUMENTACION.md): arquitectura, usuarios, flujo principal, costos y alcance.
- [backend/README.md](backend/README.md): detalle de tablas y notas del backend.
