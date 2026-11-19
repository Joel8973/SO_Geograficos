# Mapa de Oportunidades – SO_Geograficos

## 1. Descripción del proyecto

**Mapa de Oportunidades** es una aplicación web progresiva (PWA) que permite conectar a emprendedores con tiendas de barrio, minimercados y supermercados donde puedan ofrecer sus productos.

El sistema utiliza la geolocalización para mostrar establecimientos en un mapa, facilitando la búsqueda de posibles clientes y puntos de venta.

Su propósito es ayudar a los emprendedores a encontrar comercios interesados en sus productos, conocer sus requisitos, establecer contacto y realizar un seguimiento de las posibles negociaciones hasta conseguir que sus productos lleguen a las perchas de los establecimientos.

Por ejemplo, si un emprendedor fabrica queso, puede registrar su producto y buscar tiendas que comercialicen lácteos, que reciban propuestas de proveedores y que tengan condiciones adecuadas para conservar este producto.

## 2. Objetivo del proyecto

Facilitar la conexión comercial entre emprendedores y establecimientos mediante una plataforma que permita:

- Localizar tiendas, minimercados y supermercados.
- Identificar establecimientos que podrían estar interesados en determinados productos.
- Consultar las necesidades y condiciones comerciales de cada establecimiento.
- Registrar productos de los emprendedores.
- Enviar propuestas comerciales.
- Guardar oportunidades y realizar un seguimiento de las negociaciones.

El objetivo final es ayudar a los emprendedores a conseguir sus primeros pedidos y mantener puntos de venta activos.

## 3. Usuarios del sistema

La aplicación contempla tres tipos principales de usuarios:

| Usuario | Funciones principales |
|---|---|
| **Emprendedor** | Registrar productos, buscar establecimientos, consultar condiciones, enviar propuestas y realizar seguimiento de sus oportunidades. |
| **Comercio** | Registrar su establecimiento, indicar qué productos necesita, publicar requisitos y responder propuestas de emprendedores. |
| **Administrador** | Verificar establecimientos, corregir ubicaciones, revisar reportes, detectar duplicados y gestionar usuarios y categorías. |

Cada usuario tiene diferentes permisos según su rol dentro del sistema.

## 4. ¿Cómo funciona la aplicación?

El funcionamiento principal se desarrolla mediante los siguientes pasos:

### Paso 1. Ingreso a la aplicación

El usuario ingresa a la aplicación y accede a las diferentes secciones disponibles según su tipo de cuenta.

La interfaz está diseñada para utilizarse tanto desde computadoras como desde dispositivos móviles.

### Paso 2. Visualización del mapa

En la pantalla principal se presenta un mapa con los establecimientos registrados.

El usuario puede:

- Visualizar los establecimientos mediante marcadores.
- Buscar comercios por nombre o ubicación.
- Aplicar filtros.
- Cambiar entre la vista de mapa y listado.
- Consultar la ubicación de cada establecimiento.
- Utilizar la opción de cómo llegar.

El proyecto contiene información de **162 establecimientos encuestados en el cantón Latacunga, provincia de Cotopaxi**.

### Paso 3. Consulta de establecimientos

Al seleccionar un establecimiento, se puede acceder a su ficha informativa.

Esta ficha contiene información como:

- Nombre del establecimiento.
- Tipo de establecimiento.
- Dirección y ubicación.
- Parroquia y sector.
- Teléfono y correo electrónico, cuando están disponibles.
- Horario de atención.
- Categorías de productos.
- Productos que necesita el establecimiento.
- Si recibe propuestas de proveedores.
- Información sobre refrigeración y capacidad.
- Requisitos para ingresar productos.
- Condiciones de compra.
- Información de verificación.

Esto permite que el emprendedor conozca mejor el establecimiento antes de intentar establecer una relación comercial.

### Paso 4. Registro de productos

El emprendedor dispone de una sección llamada **Productos**, donde puede registrar los productos que desea comercializar.

La información contempla:

- Fotografía del producto.
- Nombre y categoría.
- Precio.
- Cantidad mínima de pedido.
- Capacidad de producción.
- Vida útil y condiciones de conservación.
- Zonas de entrega.
- Documentos del producto.

De esta manera, el sistema dispone de información para comparar los productos con las necesidades de los establecimientos.

### Paso 5. Búsqueda de oportunidades comerciales

Una de las funciones principales es el botón **Buscar dónde ofrecerlo**.

Esta función permite comparar las características del producto registrado con las condiciones de los establecimientos.

Para realizar esta comparación se consideran aspectos como:

- Categoría del producto.
- Zona de entrega.
- Recepción de propuestas de proveedores.
- Condiciones de conservación.
- Capacidad disponible o requerida.

El sistema presenta posibles coincidencias y explica por qué un establecimiento podría ser adecuado para ofrecer determinado producto.

**Importante:** una coincidencia representa una oportunidad comercial orientativa. No significa que el establecimiento haya aceptado comprar el producto.

### Paso 6. Contacto y envío de propuestas

Cuando el emprendedor encuentra un establecimiento interesante, puede guardar la oportunidad, consultar sus medios de contacto autorizados y enviar una propuesta comercial.

El comercio puede responder mediante diferentes opciones:

- Me interesa.
- Solicito información.
- Agendar visita.
- No interesado.

También se contempla el registro manual de las respuestas recibidas.

### Paso 7. Seguimiento de oportunidades

La sección **Mis oportunidades** permite organizar las negociaciones comerciales.

El emprendedor puede:

- Consultar sus oportunidades guardadas.
- Actualizar el estado de cada negociación.
- Registrar notas.
- Establecer una próxima gestión.
- Consultar las condiciones comerciales.

El seguimiento permite conocer el avance de cada negociación hasta conseguir un primer pedido o mantener un punto de venta activo.

También existe el estado **No concretada** para las oportunidades que no llegan a convertirse en una negociación exitosa.

### Paso 8. Administración del sistema

El administrador dispone de un panel para gestionar y mantener organizada la información.

Entre sus funciones se encuentran:

- Registrar y revisar establecimientos.
- Detectar posibles establecimientos duplicados.
- Corregir ubicaciones geográficas.
- Revisar reportes de información incorrecta.
- Gestionar usuarios.
- Administrar categorías.
- Verificar establecimientos.
- Consultar información de actividad.

## 5. Tecnologías utilizadas

El proyecto utiliza diferentes tecnologías para desarrollar la interfaz, gestionar la información y almacenar los datos.

| Tecnología | Función dentro del proyecto |
|---|---|
| HTML5 | Construcción de la estructura de las páginas web. |
| CSS3 | Diseño visual, colores, distribución y adaptación a dispositivos móviles. |
| JavaScript ES6 | Funcionalidades, interacciones, filtros y lógica de la aplicación. |
| Google Maps JavaScript API | Visualización del mapa, marcadores y ubicaciones. |
| Geocoding API | Conversión de direcciones en coordenadas geográficas. |
| Python 3 | Ejecución de un servidor local para visualizar el frontend. |
| PHP 8.2+ | Lenguaje utilizado para desarrollar el backend. |
| Laravel 12 | Framework utilizado para organizar la API y la lógica del servidor. |
| MySQL 8 | Sistema de gestión de la base de datos. |
| Composer 2 | Instalación y administración de dependencias de PHP. |
| Podman o Docker | Ejecución de MySQL mediante contenedores. |

### ¿Qué es una PWA?

PWA significa *Progressive Web App* o aplicación web progresiva.

Es una aplicación web que puede ofrecer características similares a una aplicación instalada en un dispositivo.

En este proyecto se utilizan:

- `manifest.webmanifest`: contiene la configuración para instalar la aplicación.
- `sw.js`: contiene el Service Worker, encargado de gestionar recursos y funcionalidades de la aplicación web progresiva.
- `icon.svg`: proporciona el icono de la aplicación.

## 6. Estructura del proyecto

El proyecto está organizado en diferentes carpetas y archivos. Cada uno cumple una función específica.

```text
SO_Geograficos/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── config.js
│   └── data.js
│
├── data/
│   └── establecimientos.json
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── public/
│   ├── .env.example
│   └── README.md
│
├── scripts/
│   └── mysql-podman.sh
│
├── .vscode/
│
├── manifest.webmanifest
├── sw.js
├── icon.svg
│
├── DOCUMENTACION.md
└── README.md
```

### Descripción de los archivos principales

**index.html**

Es el archivo principal de la aplicación. Contiene la estructura de las diferentes secciones que se muestran al usuario.

**css/styles.css**

Contiene los estilos visuales de la aplicación, como colores, tamaños, distribución de elementos y adaptación a dispositivos móviles.

**js/app.js**

Contiene la lógica principal de la aplicación. Aquí se gestionan las interacciones, el mapa, las búsquedas, los filtros, los productos, las oportunidades y las funciones administrativas.

**js/config.js**

Contiene la configuración de Google Maps. En este archivo se coloca la clave de API necesaria para mostrar el mapa.

**js/data.js**

Contiene los datos de los 162 establecimientos que utiliza el frontend.

**data/establecimientos.json**

Contiene los datos originales de los establecimientos organizados en formato JSON.

**backend/**

Contiene el proyecto desarrollado con Laravel 12. Aquí se encuentran los modelos, las migraciones, las rutas y los demás elementos necesarios para gestionar la API y la base de datos.

**backend/database/**

Contiene las migraciones que permiten crear la estructura de las tablas de MySQL.

**scripts/mysql-podman.sh**

Es un script que permite iniciar un contenedor MySQL 8 utilizando Podman o Docker.

**.vscode/**

Contiene configuraciones, extensiones recomendadas y tareas para facilitar el trabajo desde Visual Studio Code.

**DOCUMENTACION.md**

Contiene información técnica sobre el objetivo, arquitectura, usuarios, condiciones técnicas, costos y alcance del proyecto.

**README.md**

Es el archivo que explica cómo funciona el proyecto, qué tecnologías utiliza y cómo instalarlo y ejecutarlo.

## 7. Requisitos previos

Antes de ejecutar el proyecto, es necesario contar con las siguientes herramientas:

| Herramienta | Versión requerida |
|---|---|
| Git | Cualquier versión reciente |
| Python | 3.8 o superior |
| PHP | 8.2 o superior |
| Composer | 2 o superior |
| MySQL | 8.0 o superior |
| Podman o Docker | Cualquier versión compatible |
| Google Maps API Key | Clave configurada en Google Cloud |

También se necesitan las siguientes extensiones de PHP:

- mbstring
- xml
- dom
- xmlwriter
- curl
- zip
- pdo_mysql
- fileinfo
- tokenizer

## 8. Instalación del proyecto

A continuación, se explica cómo preparar y ejecutar el proyecto desde una computadora.

### Paso 1. Descargar el proyecto

Descarga el repositorio desde GitHub o utiliza el archivo ZIP proporcionado.

Si utilizas Git, abre una terminal y ejecuta:

```bash
git clone https://github.com/TU_USUARIO/SO_Geograficos.git
```

Después ingresa a la carpeta:

```bash
cd SO_Geograficos
```

Si utilizas el archivo ZIP, primero debes descomprimirlo y abrir una terminal dentro de la carpeta principal.

### Paso 2. Instalar las herramientas necesarias

Para Linux basado en Fedora:

```bash
sudo dnf install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-pdo php-mysqlnd composer podman
```

Para Ubuntu o Debian:

```bash
sudo apt update
sudo apt install -y git python3 php-cli php-mbstring php-xml php-curl php-zip php-mysql composer docker.io
```

Para Windows:

1. Instalar Git for Windows.
2. Instalar Python desde python.org.
3. Instalar PHP 8.2 o superior.
4. Instalar Composer.
5. Instalar Docker Desktop.

Se recomienda utilizar Git Bash en Windows para ejecutar los comandos de este documento.

### Paso 3. Configurar Google Maps

El proyecto utiliza Google Maps para mostrar los establecimientos y sus ubicaciones.

Para configurar esta función:

1. Ingresar a https://console.cloud.google.com/google/maps-apis/.
2. Crear un proyecto en Google Cloud o seleccionar uno existente.
3. Habilitar **Maps JavaScript API**.
4. Habilitar **Geocoding API**.
5. Ingresar a la sección Credenciales.
6. Crear una clave de API.
7. Restringir la clave para que funcione únicamente desde los dominios autorizados.

Después abrir el archivo:

```text
js/config.js
```

Buscar la siguiente configuración:

```javascript
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'TU_API_KEY_AQUI',
  mapaInicialZoom: 11
};
```

Reemplazar `TU_API_KEY_AQUI` por la clave obtenida en Google Cloud.

Guardar los cambios.

**Nota:** si no se configura la clave de Google Maps, la aplicación mostrará un aviso en el mapa, pero el listado y las fichas de establecimientos seguirán funcionando.

No se recomienda publicar la clave sin restricciones en GitHub.

## 9. Ejecución del proyecto

Para ejecutar correctamente el proyecto se deben iniciar dos servicios: el frontend y el backend.

### Parte A. Ejecutar el frontend

El frontend es la parte visual con la que interactúa el usuario.

**Paso 1.** Abrir una terminal en la carpeta principal del proyecto.

**Paso 2.** Ejecutar el siguiente comando:

```bash
python3 -m http.server 8080
```

En Windows también puedes utilizar:

```bash
py -m http.server 8080
```

**Paso 3.** Mantener abierta la terminal.

**Paso 4.** Abrir un navegador web e ingresar a:

```text
http://localhost:8080
```

Si todo está correcto, se mostrará la aplicación Mapa de Oportunidades.

### Parte B. Ejecutar MySQL y el backend

El backend es la parte encargada de gestionar la lógica del servidor y la estructura de la base de datos.

Para ejecutarlo se deben realizar los siguientes pasos.

**Paso 1. Iniciar una segunda terminal**

No cierres la terminal donde está funcionando el frontend.

Abre otra terminal y ubícate nuevamente en la carpeta principal del proyecto.

**Paso 2. Iniciar MySQL**

Ejecutar:

```bash
bash scripts/mysql-podman.sh
```

Este script utiliza Podman o Docker para iniciar un contenedor con MySQL 8.

La configuración de desarrollo utilizada es:

| Parámetro | Valor |
|---|---|
| Contenedor | so_geo_mysql |
| Base de datos | so_geograficos |
| Usuario | root |
| Contraseña | Vacía |
| Puerto | 3306 |

Si ya tienes MySQL 8 instalado directamente en tu computadora, puedes utilizarlo sin necesidad de iniciar el contenedor.

En ese caso, crea la base de datos manualmente:

```sql
CREATE DATABASE so_geograficos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

**Paso 3. Ingresar a la carpeta backend**

Desde la carpeta principal ejecuta:

```bash
cd backend
```

**Paso 4. Instalar las dependencias**

Ejecuta:

```bash
composer install
```

Este comando instala las librerías necesarias para que Laravel funcione correctamente.

**Paso 5. Crear el archivo de configuración**

Ejecuta:

```bash
cp .env.example .env
```

En Windows puedes utilizar:

```bash
copy .env.example .env
```

Este archivo contiene la configuración de la aplicación y la conexión con MySQL.

**Paso 6. Generar la clave de Laravel**

Ejecuta:

```bash
php artisan key:generate
```

Este comando genera una clave necesaria para el funcionamiento de Laravel.

**Paso 7. Crear las tablas de la base de datos**

Ejecuta:

```bash
php artisan migrate --force
```

Laravel ejecutará las migraciones y creará las tablas definidas en el proyecto.

El backend contiene 22 migraciones que establecen la estructura de la base de datos.

**Importante:** el proyecto no incluye un seeder. Las migraciones crean la estructura de las tablas, pero no realizan automáticamente la carga inicial de los datos de los establecimientos.

**Paso 8. Iniciar el servidor backend**

Ejecuta:

```bash
php -S 127.0.0.1:8000 -t public public/index.php
```

Mantén abierta esta terminal para que el servidor continúe funcionando.

## 10. Comprobar que el proyecto funciona

Una vez iniciados los servicios, se pueden comprobar las siguientes direcciones:

| Servicio | Dirección |
|---|---|
| Aplicación web (frontend) | http://localhost:8080 |
| API Laravel | http://localhost:8000 |
| Comprobación de la API | http://localhost:8000/api/health |
| Base de datos MySQL | 127.0.0.1:3306 |

Para comprobar el frontend, abre:

```text
http://localhost:8080
```

Para comprobar el backend, abre:

```text
http://localhost:8000/api/health
```

La respuesta esperada es:

```json
{"status":"ok"}
```

Si aparece esta respuesta, significa que el servidor backend está respondiendo correctamente.

## 11. Ejecutar el proyecto desde Visual Studio Code

También es posible trabajar con el proyecto desde Visual Studio Code.

Para hacerlo:

1. Abrir Visual Studio Code.
2. Seleccionar **File → Open Folder**.
3. Elegir la carpeta `SO_Geograficos`.
4. Aceptar las extensiones recomendadas.
5. Abrir **Terminal → Run Task**.
6. Seleccionar la tarea que se desea ejecutar.

Las tareas disponibles son:

| Tarea | Función |
|---|---|
| MySQL 8: iniciar (Podman) | Inicia el contenedor de MySQL. |
| SETUP BACKEND | Instala dependencias, prepara `.env`, genera la clave y ejecuta migraciones. |
| PWA: servir en localhost:8080 | Inicia el frontend. |
| Backend: servir API en localhost:8000 | Inicia el servidor Laravel. |

Las tareas están configuradas en `.vscode/tasks.json`.

## 12. Problemas frecuentes y soluciones

Durante la instalación pueden aparecer algunos errores. A continuación se presentan los más comunes.

| Problema | Solución |
|---|---|
| Address already in use | El puerto ya está ocupado. Detener el proceso anterior o utilizar otro puerto. |
| El mapa no aparece | Revisar la clave de Google Maps y comprobar que las API estén habilitadas. |
| Error de conexión con MySQL | Comprobar que MySQL esté iniciado y que la configuración de conexión sea correcta. |
| Composer no funciona | Verificar que Composer esté instalado y disponible desde la terminal. |
| Class de PHP no encontrada | Comprobar que las extensiones de PHP necesarias estén instaladas. |
| Nothing to migrate | No es un error. Significa que las migraciones ya fueron ejecutadas. |
| El frontend no carga | Comprobar que el servidor Python siga funcionando y que la dirección sea correcta. |
| Connection refused | Verificar que MySQL o el servidor correspondiente esté iniciado. |

Si el puerto 8080 está ocupado, se puede utilizar otro:

```bash
python3 -m http.server 8081
```

En ese caso, la aplicación estará disponible en:

```text
http://localhost:8081
```

También será necesario actualizar las restricciones de la clave de Google Maps para el nuevo puerto.

## 13. Datos utilizados en el proyecto

Los datos iniciales provienen del archivo:

`Lacteos_Datos_Unificados_Consolidado (1).xlsx`

Este archivo contiene información de **162 establecimientos encuestados en Latacunga, Cotopaxi**.

Los datos incluyen:

- Tipo de establecimiento.
- Nombre y dirección.
- Parroquia y sector.
- Latitud y longitud.
- Información de contacto.
- Horarios de atención.
- Categorías de productos lácteos.
- Interés en recibir nuevos proveedores.
- Información sobre refrigeración.
- Capacidad y volumen.
- Observaciones comerciales.

Esta información fue convertida a formato JSON para utilizarla dentro de la aplicación.

## 14. Arquitectura y funcionamiento interno

El proyecto está dividido en dos partes principales:

### Frontend

Es la parte que visualiza el usuario. Está desarrollado con HTML5, CSS3 y JavaScript.

Se encarga de mostrar el mapa, los establecimientos, los formularios, los productos y las oportunidades comerciales.

Actualmente utiliza `localStorage` para guardar información en el navegador.

### Backend

Está desarrollado con Laravel 12 y utiliza MySQL 8 como sistema de almacenamiento relacional.

Contiene 22 migraciones, modelos Eloquent y enumeraciones para organizar la información del sistema.

La base de datos contempla usuarios, roles, establecimientos, categorías, productos, oportunidades, propuestas, respuestas, reportes y otras tablas necesarias para la gestión comercial.

### Estado de integración

**Es importante tener presente que el frontend y el backend todavía no están conectados entre sí.**

El frontend funciona independientemente utilizando `localStorage`, mientras que el backend cuenta con la estructura de la API y la base de datos.

Por lo tanto, iniciar ambos servicios permite probarlos por separado, pero todavía es necesario realizar la integración para que la información se gestione desde el frontend y se almacene en MySQL.

La autenticación real mediante Sanctum o JWT también queda pendiente para la etapa de integración de la API.

## 15. Alcance del proyecto

### Funcionalidades contempladas en la primera versión

- Registro y gestión de usuarios.
- Catálogo de productos.
- Mapa de establecimientos.
- Búsqueda y filtros.
- Fichas informativas de comercios.
- Geolocalización.
- Comparación entre productos y establecimientos.
- Contacto y envío de propuestas.
- Seguimiento de oportunidades.
- Panel de administración.
- Verificación de establecimientos.
- Reportes de información incorrecta.

### Funcionalidades consideradas para una segunda etapa

- Pagos.
- Gestión de inventarios.
- Logística de pedidos.

## 16. Indicador principal de éxito

El principal indicador del proyecto es conocer cuántos emprendedores consiguen su **primer pedido** y cuántos mantienen **puntos de venta activos**.

Esto permite evaluar si la aplicación realmente está ayudando a los emprendedores a encontrar oportunidades comerciales y establecer relaciones con los establecimientos.

## 17. Documentación adicional

El repositorio contiene otros documentos que permiten conocer más detalles del proyecto:

- **DOCUMENTACION.md:** explica el objetivo, los usuarios, la arquitectura, el flujo principal, las condiciones técnicas, los costos y el alcance.
- **backend/README.md:** contiene información específica sobre la instalación del backend, las migraciones y las tablas de la base de datos.

---

## Resumen general

**Mapa de Oportunidades** es una aplicación web que busca facilitar la conexión entre emprendedores y establecimientos comerciales.

Mediante un mapa geográfico, los emprendedores pueden encontrar posibles puntos de venta, registrar sus productos, conocer las necesidades de los comercios, enviar propuestas y realizar un seguimiento de sus oportunidades.

El proyecto utiliza HTML, CSS, JavaScript, Google Maps, PHP, Laravel y MySQL para desarrollar una plataforma que facilite la búsqueda de nuevos clientes y ayude a los emprendedores a llevar sus productos al mercado.
