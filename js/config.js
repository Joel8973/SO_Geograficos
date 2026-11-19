/* =========================================================================
   Configuración de la PWA — Mapa de Oportunidades
   -------------------------------------------------------------------------
   Google Maps JavaScript API:
   1. Entra a https://console.cloud.google.com/google/maps-apis/
   2. Crea un proyecto y habilita:
      - Maps JavaScript API  (mapa y marcadores)
      - Geocoding API        (buscar dirección escrita por el usuario)
   3. Crea una clave de API ( Credenciales → Crear credencial → Clave de API ).
   4. Restringe la clave por "Referenciadores HTTP" (por ejemplo
      http://localhost:8080/* y el dominio de GitHub Pages).
   5. Pega la clave entre comillas en GOOGLE_MAPS_API_KEY.

   La clave queda expuesta en el navegador (es normal en Google Maps JS);
   por eso es importante restringirla por dominio en Google Cloud.
   ========================================================================= */
window.APP_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'AIzaSyDZ8py-O1HnJxGjxLI2F3IZNrSqmeBBa8I',
  mapaInicialZoom: 11
};
