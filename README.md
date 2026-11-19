# Mapa de Oportunidades — SO_Geograficos

Aplicación web progresiva (PWA) de geolocalización que conecta **emprendedores** con **tiendas de barrio, minimercados y supermercados** donde pueden ofrecer sus productos. Cubre desde la búsqueda del establecimiento hasta la colocación del producto en percha.

## ✅ Cumplimiento del documento “Objetivo de la aplicación”

| Requisito del documento | Implementado en |
|---|---|
| 1. Tipos de usuarios (emprendedor, comercio, administrador) | Menú ☰ → Iniciar sesión (control por roles) |
| 2. Mapa de oportunidades con marcadores, búsqueda, filtros, mapa/listado, ficha y “Cómo llegar” | `index.html` + `js/app.js` (**Google Maps JavaScript API**, clave en `js/config.js`) |
| 3. Ficha completa del establecimiento (datos, categorías, productos buscados, recepción, contacto, horario, requisitos, condiciones, verificación, decisión en supermercados) | `App.verFicha()` |
| 4. Perfil del emprendedor y catálogo (foto, categoría, precios, mínimo, capacidad, vida útil, zonas, documentos, compartir y PDF) | Vista **Productos** |
| 5. Vinculación producto ↔ establecimiento con explicación de coincidencia y aviso de no garantía | Botón **Buscar dónde ofrecerlo** |
| 6. Guardar, contactar (canal autorizado) y enviar propuesta; respuestas del comercio y registro manual | Ficha del establecimiento |
| 7. Seguimiento (“Mis oportunidades”) con 6 estados + “No concretada”, notas, próxima gestión y condiciones | Vista **Oportunidades** |
| 8. Registro de comercios, detección de duplicados, corrección de ubicación, reportar info, fecha de verificación, carga de Excel | Menú ☰ y Panel **Admin** |
| 9. Condiciones técnicas: web adaptable, PWA, geolocalización + manual, roles, privacidad, panel admin, código fuente, costos | Este repositorio + `DOCUMENTACION.md` |
| 10. Alcance de la primera versión | Todas las pantallas anteriores (pagos, inventarios y logística quedan para segunda etapa) |

---

# 🚀 Inicio rápido (válido para cualquier computadora)

Estos comandos asumen que clonaste el repositorio. Funcionan en **Linux, macOS y Windows (Git Bash / WSL)**.

## 1. Requisitos previos (instalar una vez)

| Herramienta | Para qué sirve | Versión |
|---|---|---|
| **Git** | clonar el repositorio | cualquiera |
| **Python 3** | servir la PWA en `localhost:8080` | 3.8+ |
| **PHP CLI** | ejecutar Laravel y las migraciones | **8.2+** |
| **Composer** | instalar las dependencias de Laravel | 2+ |
| **MySQL** | base de datos con columna espacial `POINT` | **8.0+** |
| **Podman o Docker** | alternativa fácil para levantar MySQL 8 | cualquiera |
| **Google Maps API Key** | dibujar el mapa y geocodificar direcciones | ver paso 3 |

Extensiones PHP necesarias: `mbstring`, `xml`, `dom`, `xmlwriter`, `curl`, `zip`, `pdo_mysql`, `fileinfo`, `tokenizer`.

**Linux (Fedora):**
```bash
sudo dnf install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-pdo php-mysqlnd composer podman
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-mysql composer docker.io
# Si docker pide sudo: sudo usermod -aG docker $USER  (y vuelve a iniciar sesión)
```

**macOS (Homebrew):**
```bash
brew install git python php composer docker
# Abre Docker Desktop y espera a que esté corriendo
```

**Windows:**
1. Instala [Git for Windows](https://gitforwindows.org/) (usa **Git Bash** para los comandos `bash`).
2. Instala Python desde [python.org](https://www.python.org/downloads/) (marca *Add Python to PATH*).
3. Instala PHP 8.2+ con [Laragon](https://laragon.org/) o [XAMPP](https://www.apachefriends.org/) y agrega PHP al PATH.
4. Instala [Composer](https://getcomposer.org/download/) y [Docker Desktop](https://www.docker.com/products/docker-desktop/).

> Si ya tienes MySQL 8 instalado de forma nativa, no necesitas Podman/Docker: crea la base de datos y ajusta `backend/.env` (paso 4).

## 2. Clonar el proyecto

```bash
git clone https://github.com/TU_USUARIO/SO_Geograficos.git
cd SO_Geograficos
```

## 3. Configurar Google Maps (necesario para ver el mapa)

1. Entra a <https://console.cloud.google.com/google/maps-apis/> y crea/elige un proyecto.
2. Habilita **Maps JavaScript API** y **Geocoding API**.
3. En *Credenciales* crea una **Clave de API** y restríngela por **Referenciadores HTTP**: `http://localhost:8080/*` (y el dominio donde publiques).
4. Edita `js/config.js` y reemplaza `TU_API_KEY_AQUI` por tu clave:

```js
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'AIza...tu_clave...',
  mapaInicialZoom: 11
};
```

5. Recarga con `Ctrl+F5`.

> Sin clave, la app muestra un aviso en el mapa, pero el **listado y las fichas funcionan igual**. La clave viaja al navegador (es normal en Google Maps JS), por eso debe estar **restringida por dominio**. Para no subir tu clave a GitHub, ejecuta `git update-index --skip-worktree js/config.js` después de pegarla.

## 4. Terminal 1 — Frontend (PWA)

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
# Windows: py -m http.server 8080  (o python -m http.server 8080)
```

Abre **http://localhost:8080**.

## 5. Terminal 2 — MySQL + backend Laravel

```bash
# Desde la raíz del repositorio: levanta MySQL 8 (Podman o Docker)
bash scripts/mysql-podman.sh
# Windows: usa Git Bash. Si Docker exige sudo: sudo bash scripts/mysql-podman.sh

cd backend

composer install
cp .env.example .env          # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate --force
php -S 127.0.0.1:8000 -t public public/index.php
```

Deja ambas terminales abiertas. Si usas **MySQL nativo** en vez del contenedor, crea la base de datos y omite el script:

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

...y verifica que `backend/.env` tenga:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=so_geograficos
DB_USERNAME=root
DB_PASSWORD=
```

> `php artisan migrate` es seguro de repetir: si las tablas ya existen muestra `Nothing to migrate.` (es normal, no es un error).

También puedes usar `php artisan serve` en lugar de `php -S ...`; el comando `php -S` es más portable y funciona igual en cualquier instalación de PHP.

## 6. Verificación rápida

```bash
# Frontend → debe devolver 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/index.html

# Backend → debe devolver {"status":"ok"}
curl http://localhost:8000/api/health
```

En Windows PowerShell: `Invoke-RestMethod http://localhost:8000/api/health`

| Servicio | URL |
|---|---|
| PWA | http://localhost:8080 |
| API Laravel | http://localhost:8000/api/health |
| MySQL | `127.0.0.1:3306` (BD `so_geograficos`, usuario `root`, sin contraseña) |

---

# 💻 Ejecutar desde Visual Studio Code

1. `File → Open Folder…` → carpeta `SO_Geograficos`.
2. Acepta las extensiones recomendadas (Live Server, Intelephense, Laravel).
3. `Terminal → Run Task…`:
   - **MySQL 8: iniciar (Podman)** — detecta Podman o Docker automáticamente;
   - **SETUP BACKEND** — `composer install` + `.env` + `APP_KEY` + migraciones;
   - **PWA: servir en localhost:8080** — frontend;
   - **Backend: servir API en localhost:8000** — API.
4. Abre <http://localhost:8080>.

Las tareas están en `.vscode/tasks.json` y usan rutas relativas (`${workspaceFolder}`), por lo que funcionan después de clonar en cualquier ruta. En Windows, ejecuta las tareas desde una terminal **Git Bash**.

> La PWA funciona de forma independiente con `localStorage`. La API Laravel está lista, pero **el frontend aún no consume el backend** (ese es el siguiente paso de integración).

---

# 🧰 Solución de problemas

| Síntoma | Solución |
|---|---|
| `Address already in use` | Ya hay otro servidor en ese puerto. Cámbialo (`8081` / `8001`) o detén el proceso: `pkill -f 'http.server 8080'` / `pkill -f 'php -S 127.0.0.1:8000'`. |
| El mapa no se dibuja | Revisa que la API Key esté en `js/config.js`, que **Maps JavaScript API** y **Geocoding API** estén habilitadas y que el referenciador `http://localhost:8080/*` coincida con tu puerto. |
| `Class "config" does not exist` / errores de PHP | Instala las extensiones PHP listadas arriba y vuelve a correr `composer install`. |
| `SQLSTATE[HY000] [2002] Connection refused` | MySQL no está corriendo: ejecuta `bash scripts/mysql-podman.sh` y espera el mensaje *MySQL listo*. |
| `cp: no se reconoce` en Windows | Usa `copy .env.example .env`. |
| `Nothing to migrate.` | Correcto: las migraciones ya se aplicaron. |
| Composer bloquea Laravel por *security advisories* | No cambies la versión: el `composer.lock` incluye Laravel 12, que ya está corregido. |

---

# 🗂️ Estructura

- `index.html` — interfaz y secciones
- `css/styles.css` — diseño adaptable a celular
- `js/config.js` — clave de **Google Maps API** (configuración local)
- `js/data.js` — **162 establecimientos** del cantón Latacunga extraídos del Excel
- `js/app.js` — toda la lógica de negocio y del mapa Google Maps
- `data/establecimientos.json` — fuente de datos original convertida a JSON
- `backend/` — API Laravel 12 + MySQL 8 (migraciones, modelos y enums)
- `.vscode/` — tareas y extensiones recomendadas
- `scripts/mysql-podman.sh` — levanta MySQL 8 con Podman o Docker
- `manifest.webmanifest`, `sw.js`, `icon.svg` — PWA
- `DOCUMENTACION.md` — documentación, arquitectura, costos y propiedad

# 📊 Datos

Los datos provienen de `Lacteos_Datos_Unificados_Consolidado (1).xlsx` (162 establecimientos encuestados en Latacunga, Cotopaxi), con latitud/longitud reales. Incluyen tipo, dirección, parroquia/sector, contacto, horario, categorías de lácteos, interés en nuevos proveedores, refrigeración, volumen y observaciones comerciales.

> Nota: la compatibilidad mostrada entre producto y comercio es **orientativa y no garantiza aceptación**, tal como exige el documento.

# 🗄️ Backend Laravel (base de datos)

La carpeta [`backend/`](backend/) contiene el proyecto Laravel 12 con **22 migraciones**, modelos Eloquent y enums para MySQL 8 (columna espacial `POINT` SRID 4326). No incluye seeder, según lo solicitado. Ver [`backend/README.md`](backend/README.md) para el detalle de las 27 tablas.

# 🔐 Privacidad

La geolocalización y la publicación de contactos se usan con fines de gestión comercial. La aplicación solicita autorización al usar el GPS y permite ingresar la ubicación manualmente (o buscar una dirección con Geocoding). Cada emprendedor solo ve sus propias propuestas, notas y negociaciones (filtradas por `usuarioId`).
