# Mapa de Oportunidades — SO_Geograficos

Aplicación web que conecta emprendedores con tiendas de barrio, minimercados y supermercados de **Latacunga (Cotopaxi)** para que encuentren posibles puntos de venta de sus productos.

Incluye un mapa con **162 establecimientos encuestados**, fichas con condiciones comerciales, registro de productos, búsqueda de coincidencias ("¿dónde ofrecerlo?"), seguimiento de oportunidades y panel administrativo.

---

## ¿Qué puedo hacer con la aplicación?

- Ver los establecimientos en un mapa o en un listado, con búsqueda, filtros y "Mi ubicación".
- Consultar la ficha de cada comercio: dirección, horario, categorías, requisitos, refrigeración y condiciones de compra.
- Registrar mis productos y usar **Buscar dónde ofrecerlo** para obtener establecimientos compatibles.
- Guardar oportunidades, enviar propuestas y registrar el avance hasta **Primer pedido** o **Punto de venta activo**.
- Administrar establecimientos, usuarios, categorías y reportes desde el panel de administración.
- Instalar la aplicación en el celular como PWA (funciona sin conexión para el listado).

---

## Tecnologías

| Parte | Tecnología |
|---|---|
| Interfaz (PWA) | HTML5, CSS3, JavaScript ES6, Google Maps JavaScript API + Geocoding API |
| Persistencia de la PWA | `localStorage` del navegador |
| Backend | PHP 8.2+, Laravel 12 |
| Base de datos | MySQL 8 (22 migraciones, columna espacial `POINT` SRID 4326) |
| Herramientas | Python 3, Composer 2, Podman o Docker |

---

## Estructura del proyecto

```text
SO_Geograficos/
├── index.html                  # Página principal de la PWA
├── css/styles.css              # Estilos y diseño responsive
├── js/
│   ├── config.js               # Clave de Google Maps (editar aquí)
│   ├── data.js                 # Los 162 establecimientos para el frontend
│   └── app.js                  # Toda la lógica de la aplicación
├── data/establecimientos.json  # Datos originales en JSON
├── backend/                    # API Laravel + migraciones de MySQL
├── scripts/mysql-podman.sh     # Inicia MySQL 8 con Podman/Docker
├── manifest.webmanifest        # Configuración de instalación PWA
├── sw.js                       # Service Worker
├── DOCUMENTACION.md            # Documentación técnica detallada
└── README.md                   # Esta guía
```

---

## Requisitos

| Herramienta | Versión |
|---|---|
| Git | Cualquiera reciente |
| Python | 3.8 o superior |
| PHP | 8.2 o superior (con extensiones `mbstring`, `xml`, `curl`, `zip`, `pdo_mysql`) |
| Composer | 2 o superior |
| Podman o Docker | Cualquiera (solo para el backend) |

Para comprobarlo en una terminal:

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

**Windows:** instala Git for Windows, Python (python.org), PHP 8.2+, Composer y Docker Desktop, y ejecuta los comandos desde **Git Bash**. En Windows usa `py -m http.server 8080` en lugar de `python3 -m http.server 8080` y `copy .env.example .env` en lugar de `cp .env.example .env`.

---

## Ejecución paso a paso (copiar y pegar)

### 1. Descargar el proyecto

```bash
git clone https://github.com/Joel8973/SO_Geograficos.git
cd SO_Geograficos
```

> Si ya tienes la carpeta, solo ejecuta `cd SO_Geograficos`.

### 2. Iniciar la aplicación (frontend)

En la terminal dentro de la carpeta del proyecto:

```bash
python3 -m http.server 8080
```

Abre en el navegador: **http://localhost:8080**

Para detener el servidor presiona **Ctrl + C**.

> Con esto la aplicación ya es usable: mapa, listado, fichas, productos y oportunidades funcionan con los datos guardados en el navegador.

### 3. Iniciar el backend (opcional: API y base de datos)

Abre una **segunda terminal** y pega todo este bloque:

```bash
cd SO_Geograficos
bash scripts/mysql-podman.sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php -S 127.0.0.1:8000 -t public public/index.php
```

- El script `mysql-podman.sh` crea el contenedor `so_geo_mysql` con MySQL 8, base de datos `so_geograficos`, usuario `root` y contraseña vacía en el puerto `3306`. Si ya tienes MySQL 8 instalado, puedes omitir ese paso y crear la base de datos manualmente:

```sql
CREATE DATABASE so_geograficos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- Mantén esta terminal abierta mientras uses la API. Para detenerla presiona **Ctrl + C**.
- No hay seeder: las migraciones crean las tablas, pero no cargan los 162 establecimientos en MySQL.

---

## Comprobar que todo funciona

| Servicio | Dirección | Respuesta esperada |
|---|---|---|
| Aplicación web | http://localhost:8080 | Interfaz "Mapa de Oportunidades" |
| API Laravel | http://localhost:8000/api/health | `{"status":"ok"}` |
| MySQL | `127.0.0.1:3306` | Conexión aceptada |

---

## Configurar Google Maps (recomendado)

Sin clave de API el mapa muestra un aviso, pero el listado y las fichas siguen funcionando. Para activarlo:

1. Entra a https://console.cloud.google.com/google/maps-apis/ y crea o selecciona un proyecto.
2. Habilita **Maps JavaScript API** y **Geocoding API**.
3. Crea una clave en **Credenciales → Crear credencial → Clave de API** y restríngele los referenciadores HTTP (por ejemplo `http://localhost:8080/*`).
4. Abre `js/config.js` y reemplaza `TU_API_KEY_AQUI` por tu clave:

```javascript
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'TU_API_KEY_AQUI',
  mapaInicialZoom: 11
};
```

5. Guarda el archivo y recarga http://localhost:8080.

> La clave queda visible en el navegador (es normal en Google Maps JS), por eso debe estar restringida por dominio. No subas una clave sin restricciones a GitHub.

---

## Estado actual del proyecto (importante)

- El **frontend funciona de forma independiente** usando `localStorage`: no necesita el backend para usarse.
- El **backend** tiene la estructura de la API, los modelos y las 22 migraciones de MySQL, pero por ahora solo expone el endpoint `/api/health`.
- **Frontend y backend todavía no están conectados**; la autenticación (Sanctum/JWT) y la carga de datos a MySQL corresponden a una siguiente etapa.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| `Address already in use` | El puerto está ocupado. Usa `python3 -m http.server 8081` y abre http://localhost:8081 (actualiza también la restricción de la clave de Google Maps). |
| El mapa no aparece | Revisa la clave en `js/config.js` y que ambas API estén habilitadas en Google Cloud. |
| `Connection refused` al migrar | Verifica que `bash scripts/mysql-podman.sh` terminó con "MySQL listo". |
| Composer o PHP dan error | Comprueba las versiones con el comando de la sección Requisitos e instala las extensiones PHP faltantes. |
| `Nothing to migrate` | No es un error: las migraciones ya se ejecutaron. |
| La página no carga | Confirma que la terminal del frontend siga activa y que la dirección sea http://localhost:8080. |

---

## Más información

- [DOCUMENTACION.md](DOCUMENTACION.md): arquitectura, usuarios, flujo principal, costos y alcance.
- [backend/README.md](backend/README.md): detalle de tablas y notas de diseño del backend.
