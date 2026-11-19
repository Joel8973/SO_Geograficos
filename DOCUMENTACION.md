# Documentación técnica — Mapa de Oportunidades

## 1. Objetivo
Aplicación web de geolocalización que conecta emprendedores con tiendas de barrio, minimercados y supermercados donde ofrecer sus productos, permitiendo encontrar, contactar y gestionar posibles canales de distribución hasta la colocación del producto en percha.

## 2. Usuarios y permisos (control por roles)

| Rol | Permisos |
|---|---|
| **Emprendedor** | Registrar productos, buscar establecimientos, consultar condiciones, enviar propuestas, guardar y dar seguimiento a sus oportunidades. Solo consulta sus propios registros. |
| **Propietario / responsable del comercio** | Registrar su establecimiento, indicar productos que busca, publicar requisitos y responder propuestas (Me interesa / Solicito información / Agendar visita / No interesado). |
| **Administrador** | Verificar establecimientos, corregir ubicaciones, revisar reportes, detectar duplicados y gestionar usuarios y categorías. |

## 3. Arquitectura

- **Frontend**: HTML5 + CSS3 + JavaScript (ES6), sin frameworks de pago.
- **Mapas**: **Google Maps JavaScript API** (mapa, marcadores, InfoWindows, geolocalización y búsqueda de direcciones con Geocoding API). La clave se configura en `js/config.js` y debe restringirse por dominio en Google Cloud. Sin clave, la PWA muestra un aviso pero el listado y las fichas siguen funcionando.
- **Persistencia**: la PWA usa `localStorage` para funcionar sin servidor. La base de datos relacional definitiva está en [`backend/`](backend/) (Laravel 12 + MySQL 8 con columna espacial `POINT` SRID 4326), implementada mediante 22 migraciones y modelos Eloquent. Autenticación real (Sanctum/JWT) queda para la integración API.
- **Instalable**: PWA con `manifest.webmanifest` y `service worker` (`sw.js`).
- **Datos iniciales**: 162 establecimientos del cantón Latacunga (Cotopaxi) convertidos desde el archivo Excel a `data/establecimientos.json` y `js/data.js`.

### Estructura de datos del establecimiento
```json
{
  "id": "1", "nombre": "Minimarket Los 3 Hermanos", "tipo": "Minimercado",
  "direccion": "...", "parroquia": "Mulalo", "sector": "Mulalo Centro",
  "lat": -0.7811922, "lon": -78.5753411,
  "telefono": "", "email": "", "responsable": "", "horario": "08:00 a 20:00",
  "categoriaProductos": ["Leche", "Queso", "Yogurt"],
  "mayorDemanda": "Leche", "recepcion": "Recibe propuestas",
  "refrigeracion": "Si", "capacidadFrio": "200 litros",
  "volumen": "40 kg / unidades", "frecuencia": "Semanal",
  "observaciones": "..."
}
```

## 4. Flujo principal (prueba clave de aceptación)
1. El emprendedor inicia sesión y registra un producto (foto, categoría, precios, mínimo, capacidad, zonas, conservación, documentos).
2. Pulsa **Buscar dónde ofrecerlo**: el sistema cruza categoría, zona de entrega, recepción de propuestas, conservación y capacidad, y explica cada coincidencia.
3. Abre la ficha del comercio y revisa condiciones, contacto, horarios y requisitos.
4. Guarda la oportunidad, contacta por el canal autorizado y envía una propuesta con sus productos.
5. Registra notas, próxima gestión y cambia el estado hasta **Primer pedido** o **Punto de venta activo**. Todo desde el celular.

## 5. Indicador principal de éxito
Número de emprendedores que consiguen un **primer pedido** y mantienen **puntos de venta activos**. Se muestra en la vista **Reportes**, junto al número de comercios del mapa (que NO es el indicador principal).

## 6. Condiciones técnicas del documento — estado

| Aspecto | Solución adoptada |
|---|---|
| Acceso | Web adaptable a celular, instalable como PWA |
| Facilidad de uso | Formularios cortos, etiquetas claras y navegación inferior fija |
| Geolocalización | Google Maps + GPS del navegador; dirección escrita geocodificada y latitud/longitud manual si no se activa el GPS |
| Seguridad | Roles de acceso; filtrado de oportunidades por `usuarioId` |
| Privacidad | Autorización del navegador para GPS; contactos con fines comerciales |
| Administración | Panel con establecimientos, usuarios, categorías, reportes, duplicados y ubicaciones |
| Propiedad y mantenimiento | Código fuente entregado en este repositorio; las cuentas de servicios deben crearse a nombre de la entidad responsable (verificación pendiente en el despliegue) |
| Costos | Detallados a continuación |

## 7. Costos estimados (antes de contratar)

> Los siguientes valores son referenciales y deben cotizarse con proveedores locales. Google Maps ofrece un nivel gratuito/mensual de uso; para producción revisa las tarifas vigentes y configura límites y restricciones de clave.

| Servicio | Alternativa sin costo | Alternativa gestionada (referencia mensual) |
|---|---|---|
| Alojamiento | GitHub Pages / Netlify Free | VPS o hosting compartido: USD 5–15 |
| Mapas | Google Maps API (cuota gratuita según tarifas vigentes) | Google Maps API con SLA / volumen alto: USD 0–50 según uso |
| Almacenamiento | localStorage / SQLite local | Base de datos administrada: USD 10–25 |
| Dominio y HTTPS | Dominio gratuito de GitHub Pages | Dominio propio: USD 1–2 |
| Mantenimiento | — | Actualización y soporte: USD 50–150 (según alcance) |

**Recomendación:** publicar la PWA en GitHub Pages (sin costo de alojamiento) con la clave de Google Maps restringida por dominio, y migrar a base de datos gestionada cuando se requiera multiusuario real con cuentas y respaldos.

## 8. Alcance de la primera versión
Incluida: registro de usuarios, catálogo de productos, mapa, filtros, fichas de establecimientos, contacto, seguimiento comercial y panel administrativo.
**Segunda etapa (no incluida):** pagos, inventarios y logística de pedidos.

## 9. Despliegue
```bash
# Opción 1: servidor local
python3 -m http.server 8080

# Opción 2: GitHub Pages
# Repositorio → Settings → Pages → Source: main / root
```
El repositorio ya contiene `index.html` en la raíz, listo para GitHub Pages.
