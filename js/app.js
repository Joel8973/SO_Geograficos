/* =========================================================================
   Mapa de Oportunidades — SO_Geograficos
   Aplicación web progresiva (PWA) para conectar emprendedores con comercios.
   Datos: 162 establecimientos del cantón Latacunga (Cotopaxi).
   ========================================================================= */
'use strict';

/* Configuración (js/config.js): clave de Google Maps JavaScript API */
const CONFIG = window.APP_CONFIG || {GOOGLE_MAPS_API_KEY: '', mapaInicialZoom: 11};

/* ---------- Utilidades de persistencia ---------- */
const DB = {
  leer(clave, defecto) {
    try { const v = localStorage.getItem('mo_' + clave); return v ? JSON.parse(v) : defecto; }
    catch (e) { return defecto; }
  },
  guardar(clave, valor) { localStorage.setItem('mo_' + clave, JSON.stringify(valor)); }
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hoy = () => new Date().toISOString().slice(0, 10);
const distancia = (a, b, c, d) => {
  const R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(c - a), dLon = rad(d - b);
  const x = Math.sin(dLat/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

/* ---------- Estado global ---------- */
const App = {
  estado: {
    usuario: DB.leer('usuario', null),
    establecimientos: DB.leer('establecimientos', window.DATOS_INICIALES || []),
    productos: DB.leer('productos', []),
    oportunidades: [],
    propuestas: DB.leer('propuestas', []),
    respuestas: DB.leer('respuestas', []),
    reportes: DB.leer('reportes', []),
    categorias: DB.leer('categorias', ['Alimentos','Bebidas','Limpieza','Cuidado personal','Lácteos','Panadería','Otros']),
    usuarios: DB.leer('usuarios', []),
    lat: -0.9934, lon: -78.6000, // centro aproximado de Latacunga
    ubicacionUsuario: false,
    vista: 'mapa',
    filtro: 'todos',
    categoria: '',
    distanciaMax: 0
  },
  mapa: null,
  marcadores: [],
  infoWindow: null,
  marcadorUsuario: null,
  miniMapa: null,
  mapsListo: false,



  /* =====================================================================
     INICIALIZACIÓN
     ===================================================================== */
  init() {
    DB.guardar('establecimientos', this.estado.establecimientos);
    this.precargarCategorias();
    this.configurarEventos();
    this.actualizarPerfil();
    this.cargarGoogleMaps();
    this.actualizarRegistro('Carga inicial', `Se cargaron ${this.estado.establecimientos.length} establecimientos desde la base de datos del cantón Latacunga.`);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  },

  precargarCategorias() {
    const cats = new Set(this.estado.categorias);
    const lacteos = ['Lácteos','Alimentos'];
    lacteos.forEach(c => cats.add(c));
    const sel = document.getElementById('filtroCategoria');
    sel.innerHTML = '<option value="">Todas las categorías</option>' +
      [...cats].sort().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    this.estado.categorias = [...cats];
  },

  configurarEventos() {
    document.getElementById('busqueda').addEventListener('input', () => this.aplicarFiltros());
    document.querySelectorAll('#filtros .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#filtros .chip').forEach(c => c.classList.remove('activo'));
        chip.classList.add('activo');
        this.estado.filtro = chip.dataset.filtro;
        this.aplicarFiltros();
      });
    });
    document.getElementById('filtroCategoria').addEventListener('change', e => {
      this.estado.categoria = e.target.value; this.aplicarFiltros();
    });
    document.getElementById('filtroDistancia').addEventListener('change', e => {
      this.estado.distanciaMax = parseFloat(e.target.value) || 0; this.aplicarFiltros();
    });
    document.getElementById('btnUbicacion').addEventListener('click', () => this.usarMiUbicacion());
    document.getElementById('btnVerMapa').addEventListener('click', () => this.cambiarVista('mapa'));
    document.getElementById('btnVerLista').addEventListener('click', () => this.cambiarVista('lista'));
    document.querySelectorAll('.bottom-nav button').forEach(b => {
      b.addEventListener('click', () => this.mostrar(b.dataset.nav));
    });
    document.getElementById('btnMenu').addEventListener('click', () => this.abrirMenu());
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target.id === 'modal') this.cerrarModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.cerrarModal(); });
  },

  /* -------------------------------------------------------------------
     GOOGLE MAPS API
     ------------------------------------------------------------------- */
  cargarGoogleMaps() {
    const key = (CONFIG.GOOGLE_MAPS_API_KEY || '').trim();
    if (!key || key === 'TU_API_KEY_AQUI') {
      this.aplicarFiltros();
      this.mostrarAvisoApi();
      return;
    }
    if (window.google && window.google.maps) {
      this.onGoogleMapsReady();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js'
      + '?key=' + encodeURIComponent(key)
      + '&loading=async&v=weekly&callback=App.onGoogleMapsReady';
    script.async = true;
    script.onerror = () => {
      this.aplicarFiltros();
      this.mostrarAvisoApi('No se pudo cargar Google Maps. Revisa tu conexión y la API Key.');
    };
    document.head.appendChild(script);
  },

  onGoogleMapsReady() {
    this.mapsListo = true;
    this.iniciarMapa();
    this.aplicarFiltros();
  },

  mostrarAvisoApi(mensaje) {
    const el = document.getElementById('map');
    if (!el) return;
    el.innerHTML = `<div class="mapa-aviso-api">
      <div class="mapa-aviso-api-icono">🗺️</div>
      <h3>Google Maps necesita una API Key</h3>
      <p>${mensaje ? esc(mensaje) : 'Abre <code>js/config.js</code> y pega tu clave de Google Maps JavaScript API en <code>GOOGLE_MAPS_API_KEY</code>, luego recarga la página.'}</p>
      <p class="mapa-aviso-api-paso">También habilita <b>Maps JavaScript API</b> y <b>Geocoding API</b> en Google Cloud.</p>
      <button class="btn btn-primary" onclick="App.abrirAyudaApi()">Ver instrucciones</button>
    </div>`;
  },

  abrirAyudaApi() {
    this.abrirModal('Configurar Google Maps API', `
      <p><b>1.</b> Entra a <a href="https://console.cloud.google.com/google/maps-apis/" target="_blank">Google Cloud Console → Maps API</a>.</p>
      <p><b>2.</b> Crea un proyecto y habilita <b>Maps JavaScript API</b> y <b>Geocoding API</b>.</p>
      <p><b>3.</b> En <i>Credenciales</i>, crea una <b>Clave de API</b> y restríngela por referenciadores HTTP (<code>http://localhost:8080/*</code>).</p>
      <p><b>4.</b> Abre <code>js/config.js</code> y reemplaza <code>TU_API_KEY_AQUI</code> por tu clave.</p>
      <p><b>5.</b> Recarga la página (Ctrl+F5).</p>
      <p class="aviso">El listado, las fichas y el resto de la app funcionan igual sin la clave; solo el mapa no se dibuja.</p>
      <div class="modal-acciones"><button class="btn btn-primary" onclick="App.cerrarModal()">Entendido</button></div>`);
  },

  iniciarMapa() {
    if (this.mapa || !this.mapsListo) return;
    const g = window.google.maps;
    this.mapa = new g.Map(document.getElementById('map'), {
      center: {lat: this.estado.lat, lng: this.estado.lon},
      zoom: CONFIG.mapaInicialZoom || 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: 'cooperative',
      clickableIcons: false
    });
    this.infoWindow = new g.InfoWindow();
    setTimeout(() => this.redimensionarMapa(), 100);
  },

  redimensionarMapa() {
    if (this.mapsListo && this.mapa && window.google.maps.event) {
      window.google.maps.event.trigger(this.mapa, 'resize');
    }
  },

  iconoMarcador(tipo) {
    const colores = {
      Tienda: '#0b6e4f', Minimercado: '#d68910', Supermercado: '#2874a6', Otro: '#7f8c8d'
    };
    const simbolos = {Tienda: '🏪', Minimercado: '🏬', Supermercado: '🏢'};
    const color = colores[tipo] || colores.Otro;
    const simbolo = simbolos[tipo] || '📍';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
      <path d="M17 1C8.7 1 2 7.7 2 16c0 11 15 27 15 27s15-16 15-27C32 7.7 25.3 1 17 1z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="17" cy="16" r="10" fill="#fff" opacity="0.92"/>
      <text x="17" y="21" font-size="12" text-anchor="middle">${simbolo}</text></svg>`;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(34, 44),
      anchor: new window.google.maps.Point(17, 42)
    };
  },

  /* =====================================================================
     NAVEGACIÓN Y PERFIL
     ===================================================================== */
  mostrar(vista) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + vista).classList.add('active');
    document.querySelectorAll('.bottom-nav button').forEach(b =>
      b.classList.toggle('activo', b.dataset.nav === vista));
    this.estado.vista = vista;
    window.scrollTo(0, 0);
    if (vista === 'mapa') setTimeout(() => this.redimensionarMapa(), 50);
    if (vista === 'productos') this.renderizarProductos();
    if (vista === 'oportunidades') this.renderizarOportunidades();
    if (vista === 'admin') this.renderizarAdmin();
    if (vista === 'reportes') this.renderizarReportes();
  },

  actualizarPerfil() {
    const u = this.estado.usuario;
    document.getElementById('btnPerfil').textContent = u ? u.nombre.charAt(0).toUpperCase() : '?';
  },

  abrirMenu() {
    const u = this.estado.usuario;
    this.abrirModal('Menú', `
      <p style="font-size:13px;color:var(--muted)">${u ? `Sesión: <b>${esc(u.nombre)}</b> · ${esc(u.rol)}` : 'No has iniciado sesión. Puedes explorar el mapa igualmente.'}</p>
      <div class="modal-acciones" style="flex-direction:column">
        <button class="btn btn-full" onclick="App.abrirLogin()">🔑 Iniciar sesión / cambiar rol</button>
        <button class="btn btn-full" onclick="App.mostrar('reportes');App.cerrarModal()">📊 Reportes e indicadores</button>
        <button class="btn btn-full" onclick="App.abrirRegistroComercio()">🏪 Registrar establecimiento</button>
        <button class="btn btn-full" onclick="App.mostrar('admin');App.cerrarModal()">⚙️ Panel administrativo</button>
        <button class="btn btn-full" onclick="App.verGuia()">❓ Guía de uso</button>
        ${u ? '<button class="btn btn-full btn-peligro" onclick="App.cerrarSesion()">Cerrar sesión</button>' : ''}
      </div>`);
  },

  abrirLogin() {
    this.abrirModal('Iniciar sesión', `
      <p style="font-size:12px;color:var(--muted)">Elige tu rol para acceder a las funciones correspondientes. Para esta versión de demostración no se requiere contraseña.</p>
      <div class="campo"><label>Tu nombre</label><input id="loginNombre" value="${esc(this.estado.usuario?.nombre || '')}" placeholder="Ej. María Pérez"></div>
      <div class="campo"><label>Rol</label><select id="loginRol">
        <option value="emprendedor">Emprendedor</option>
        <option value="comercio">Propietario / responsable del comercio</option>
        <option value="admin">Administrador</option>
      </select></div>
      <div class="modal-acciones">
        <button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.iniciarSesion()">Entrar</button>
      </div>`);
  },

  iniciarSesion() {
    const nombre = document.getElementById('loginNombre').value.trim() || 'Usuario';
    const rol = document.getElementById('loginRol').value;
    this.estado.usuario = {id: uid(), nombre, rol};
    DB.guardar('usuario', this.estado.usuario);
    if (!this.estado.usuarios.find(u => u.nombre === nombre))
      { this.estado.usuarios.push(this.estado.usuario); DB.guardar('usuarios', this.estado.usuarios); }
    this.actualizarPerfil();
    this.cerrarModal();
    this.toast(`Bienvenido/a, ${nombre}`);
    if (rol === 'comercio') this.mostrar('admin');
  },

  cerrarSesion() {
    this.estado.usuario = null; DB.guardar('usuario', null);
    this.actualizarPerfil(); this.cerrarModal(); this.mostrar('mapa'); this.toast('Sesión cerrada');
  },

  verGuia() {
    this.abrirModal('Guía rápida', `
      <div style="font-size:13px;line-height:1.7">
      <p><b>1.</b> Regístrate con tu rol y crea tus productos en <b>Productos</b>.</p>
      <p><b>2.</b> En el mapa busca comercios y filtra por tipo, categoría, distancia y recepción de propuestas.</p>
      <p><b>3.</b> Pulsa un marcador para ver su ficha: condiciones, contacto, horarios y requisitos.</p>
      <p><b>4.</b> Usa <b>Buscar dónde ofrecerlo</b> en un producto para ver comercios compatibles con explicación de la coincidencia.</p>
      <p><b>5.</b> Guarda la oportunidad, contacta al comercio y envía una propuesta.</p>
      <p><b>6.</b> Haz seguimiento en <b>Mis oportunidades</b> hasta conseguir el primer pedido y el punto de venta activo.</p>
      <p class="aviso">La compatibilidad mostrada es orientativa y <b>no garantiza</b> la aceptación del comercio.</p>
      </div>`);
  },

  /* =====================================================================
     MAPA, BÚSQUEDA Y FILTROS
     ===================================================================== */
  usarMiUbicacion() {
    if (!navigator.geolocation) { this.toast('Tu navegador no admite geolocalización'); return; }
    this.toast('Solicitando tu ubicación…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.estado.lat = pos.coords.latitude; this.estado.lon = pos.coords.longitude;
        this.estado.ubicacionUsuario = true;
        if (this.mapsListo) {
          this.mapa.setCenter({lat: this.estado.lat, lng: this.estado.lon});
          this.mapa.setZoom(13);
          this.ponerMarcadorUsuario();
        }
        this.aplicarFiltros();
        this.toast('Ubicación obtenida');
      },
      () => {
        this.abrirModal('Ubicación manual', `
          <p style="font-size:13px">No se pudo acceder al GPS. Puedes ingresar una dirección o latitud/longitud manualmente.</p>
          <div class="campo"><label>Dirección o sector (ej. "Centro Latacunga")</label><input id="dirManual" placeholder="Centro Latacunga"></div>
          <div class="grid-2">
            <div class="campo"><label>Latitud</label><input id="latManual" type="number" step="any" value="${this.estado.lat}"></div>
            <div class="campo"><label>Longitud</label><input id="lonManual" type="number" step="any" value="${this.estado.lon}"></div>
          </div>
          <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="App.guardarUbicacionManual()">Usar ubicación</button></div>`);
      }, {enableHighAccuracy: true, timeout: 8000}
    );
  },

  ponerMarcadorUsuario() {
    if (!this.mapsListo) return;
    if (this.marcadorUsuario) this.marcadorUsuario.setMap(null);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="#1565c0" stroke="#fff" stroke-width="3"/>
      <circle cx="10" cy="10" r="2.5" fill="#fff"/></svg>`;
    this.marcadorUsuario = new window.google.maps.Marker({
      position: {lat: this.estado.lat, lng: this.estado.lon},
      map: this.mapa,
      title: 'Tú estás aquí',
      zIndex: 9999,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(20, 20),
        anchor: new window.google.maps.Point(10, 10)
      }
    });
    this.marcadorUsuario.addListener('click', () => {
      this.infoWindow.setContent('<b>📍 Tu ubicación actual</b>');
      this.infoWindow.open(this.mapa, this.marcadorUsuario);
    });
  },

  guardarUbicacionManual() {
    const dir = (document.getElementById('dirManual')?.value || '').trim();
    if (dir && this.mapsListo) { this.geocodificarManual(dir); return; }
    this.estado.lat = parseFloat(document.getElementById('latManual').value) || this.estado.lat;
    this.estado.lon = parseFloat(document.getElementById('lonManual').value) || this.estado.lon;
    if (this.mapsListo) {
      this.mapa.setCenter({lat: this.estado.lat, lng: this.estado.lon});
      this.mapa.setZoom(13);
      this.ponerMarcadorUsuario();
    }
    this.aplicarFiltros(); this.cerrarModal(); this.toast('Ubicación actualizada');
  },

  geocodificarManual(direccion) {
    if (!this.mapsListo) { this.toast('Google Maps no está disponible'); return; }
    new window.google.maps.Geocoder().geocode({address: direccion + ', Latacunga, Cotopaxi, Ecuador'}, (res, status) => {
      if (status !== 'OK' || !res[0]) { this.toast('No se encontró esa dirección'); return; }
      const p = res[0].geometry.location;
      this.estado.lat = p.lat(); this.estado.lon = p.lng();
      this.estado.ubicacionUsuario = true;
      this.mapa.setCenter(p); this.mapa.setZoom(13);
      this.ponerMarcadorUsuario();
      this.aplicarFiltros(); this.cerrarModal();
      this.toast('Ubicación: ' + res[0].formatted_address);
    });
  },

  obtenerFiltrados() {
    const q = document.getElementById('busqueda').value.toLowerCase().trim();
    return this.estado.establecimientos.filter(e => {
      if (q && ![e.nombre, e.direccion, e.sector, e.parroquia].join(' ').toLowerCase().includes(q)) return false;
      if (this.estado.filtro !== 'todos' && this.estado.filtro !== 'recibe' && e.tipo !== this.estado.filtro) return false;
      if (this.estado.filtro === 'recibe' && e.recepcion !== 'Recibe propuestas') return false;
      if (this.estado.categoria && !e.categoriaProductos.join(',').toLowerCase().includes(this.estado.categoria.toLowerCase())) return false;
      if (this.estado.distanciaMax && distancia(this.estado.lat, this.estado.lon, e.lat, e.lon) > this.estado.distanciaMax) return false;
      return true;
    });
  },

  aplicarFiltros() {
    const lista = this.obtenerFiltrados();
    document.getElementById('numResultados').textContent = lista.length;
    // Marcadores (Google Maps)
    this.marcadores.forEach(m => m.setMap(null));
    this.marcadores = [];
    if (this.mapsListo && window.google.maps.Marker) {
      lista.forEach(e => {
        const m = new window.google.maps.Marker({
          position: {lat: e.lat, lng: e.lon},
          map: this.mapa,
          title: e.nombre,
          icon: this.iconoMarcador(e.tipo)
        });
        m.addListener('click', () => {
          this.infoWindow.setContent(`<div class="popup-titulo">${esc(e.nombre)}</div>
            <div class="popup-tipo">${esc(e.tipo)} · ${esc(e.sector || e.parroquia)}</div>
            <div style="margin-top:4px">${e.recepcion === 'Recibe propuestas' ? '✅ Recibe propuestas' : '⏸️ ' + esc(e.recepcion)}</div>
            <a href="#" class="popup-btn" onclick="App.verFicha('${e.id}');return false;">Ver ficha →</a>`);
          this.infoWindow.open(this.mapa, m);
        });
        this.marcadores.push(m);
      });
    }
    this.renderizarLista(lista);
  },

  cambiarVista(tipo) {
    document.getElementById('btnVerMapa').classList.toggle('activo', tipo === 'mapa');
    document.getElementById('btnVerLista').classList.toggle('activo', tipo === 'lista');
    document.getElementById('mapaContainer').classList.toggle('hidden', tipo !== 'mapa');
    document.getElementById('listaContainer').classList.toggle('hidden', tipo !== 'lista');
    if (tipo === 'mapa') setTimeout(() => this.redimensionarMapa(), 50);
  },

  renderizarLista(lista) {
    const c = document.getElementById('listaContainer');
    if (!lista.length) { c.innerHTML = '<div class="aviso">No se encontraron establecimientos con esos filtros.</div>'; return; }
    c.innerHTML = lista.map(e => this.tarjetaEstablecimiento(e)).join('');
  },

  tarjetaEstablecimiento(e) {
    const badgeCls = e.recepcion === 'Recibe propuestas' ? '' : e.recepcion === 'No recibe por ahora' ? 'no' : 'confirmar';
    const d = distancia(this.estado.lat, this.estado.lon, e.lat, e.lon).toFixed(1);
    return `<div class="tarjeta">
      <h3>${esc(e.nombre)}</h3>
      <div class="meta">📍 ${esc(e.direccion)}<br>📌 ${esc(e.sector || e.parroquia)} · ${d} km de tu ubicación</div>
      <div><span class="badge tipo-${esc(e.tipo)}">${esc(e.tipo)}</span>
        <span class="badge ${badgeCls}">${esc(e.recepcion)}</span>
        ${(e.categoriaProductos || []).slice(0,3).map(p => `<span class="badge">${esc(p)}</span>`).join('')}
      </div>
      <div class="tarjeta-acciones">
        <button class="btn btn-small btn-primary" onclick="App.verFicha('${e.id}')">Ver ficha</button>
        <button class="btn btn-small" onclick="App.cómoLlegar(${e.lat},${e.lon},'${esc(e.nombre).replace(/'/g,'')}')">🧭 Cómo llegar</button>
        <button class="btn btn-small" onclick="App.guardarOportunidad('${e.id}')">💾 Guardar</button>
      </div>
    </div>`;
  },

  cómoLlegar(lat, lon, nombre) {
    const origen = this.estado.ubicacionUsuario
      ? `&origin=${this.estado.lat},${this.estado.lon}` : '';
    const destino = `&destination=${lat},${lon}&travelmode=driving`;
    window.open(`https://www.google.com/maps/dir/?api=1${origen}${destino}`, '_blank');
  },

  /* =====================================================================
     FICHA DEL ESTABLECIMIENTO
     ===================================================================== */
  verFicha(id) {
    const e = this.estado.establecimientos.find(x => x.id === id);
    if (!e) return;
    const esSuper = e.tipo === 'Supermercado';
    const req = e.observaciones || 'No se han publicado requisitos específicos.';
    const cond = [e.frecuencia && `Frecuencia de abastecimiento: ${e.frecuencia}`,
      e.volumen && `Volumen semanal: ${e.volumen}`,
      e.proveedorActual && `Proveedor actual: ${e.proveedorActual}`,
      e.clientesDia && `Clientes aprox./día: ${e.clientesDia}`].filter(Boolean).join(' · ') || 'No disponible';
    const contacto = [e.responsable && `Responsable: ${e.responsable}`, e.telefono && `Teléfono: ${e.telefono}`,
      e.email && `Correo: ${e.email}`].filter(Boolean).join('<br>') || 'Contacto no publicado';
    const guardada = this.estado.oportunidades.find(o => o.establecimientoId === id);
    const foto = `https://placehold.co/600x180/0b6e4f/ffffff?text=${encodeURIComponent(e.nombre.slice(0,28))}`;

    document.getElementById('fichaContenido').innerHTML = `
      <div class="ficha-header">
        <img src="${foto}" alt="Fotografía de ${esc(e.nombre)}" style="width:100%;height:150px;object-fit:cover;border-radius:10px;margin-bottom:12px">
        <h1>${esc(e.nombre)}</h1>
        <span class="badge tipo-${esc(e.tipo)}">${esc(e.tipo)}</span>
        <span class="badge ${e.recepcion==='Recibe propuestas'?'':'no'}">${esc(e.recepcion)}</span>
        ${guardada ? `<span class="badge verificado">Guardada · ${esc(guardada.estado)}</span>` : ''}
      </div>
      <div class="ficha-acciones">
        <button class="btn ${guardada?'':'btn-primary'}" onclick="App.guardarOportunidad('${e.id}')">${guardada?'✓ Oportunidad guardada':'💾 Guardar oportunidad'}</button>
        <button class="btn" onclick="App.contactar('${e.id}')">📞 Contactar al comercio</button>
        <button class="btn btn-primary" onclick="App.enviarPropuesta('${e.id}')">✉️ Enviar propuesta</button>
        <button class="btn" onclick="App.cómoLlegar(${e.lat},${e.lon},'${esc(e.nombre).replace(/'/g,'')}')">🧭 Cómo llegar</button>
        <button class="btn" onclick="App.reportarInfo('${e.id}')">⚠️ Reportar información incorrecta</button>
      </div>
      <div class="ficha-seccion"><h3>📍 Ubicación y tipo de comercio</h3>
        <div class="dato"><span class="etiqueta">Dirección</span><span class="valor">${esc(e.direccion)}</span></div>
        <div class="dato"><span class="etiqueta">Punto exacto</span><span class="valor">${e.lat.toFixed(6)}, ${e.lon.toFixed(6)} · ${esc(e.parroquia)}, ${esc(e.sector)}</span></div>
        <div class="dato"><span class="etiqueta">Tipo de comercio</span><span class="valor">${esc(e.tipo)} ${e.tipoOriginal!==e.tipo?`(${esc(e.tipoOriginal)})`:''}</span></div>
        <div id="miniMapa" style="height:180px;border-radius:10px;margin-top:10px"></div>
      </div>
      <div class="ficha-seccion"><h3>🏷️ Categorías y productos</h3>
        <div class="dato"><span class="etiqueta">Categorías que vende</span><span class="valor">${(e.categoriaProductos||[]).map(p=>`<span class="badge">${esc(p)}</span>`).join(' ')}</span></div>
        <div class="dato"><span class="etiqueta">Productos que busca</span><span class="valor">${esc(e.mayorDemanda||'No publicados')} ${e.artesanales==='Si'?'· Le interesan productos artesanales/asociaciones':''}</span></div>
        <div class="dato"><span class="etiqueta">Vende de productores locales</span><span class="valor">${esc(e.vendeLocales||'No indicado')}</span></div>
        <div class="dato"><span class="etiqueta">Marcas actuales</span><span class="valor">${esc(e.proveedorActual||'No indicado')}</span></div>
      </div>
      <div class="ficha-seccion"><h3>🤝 Recepción de proveedores</h3>
        <div class="dato"><span class="etiqueta">Estado</span><span class="valor"><b>${esc(e.recepcion)}</b></span></div>
        <div class="dato"><span class="etiqueta">Productos artesanales</span><span class="valor">${esc(e.artesanales||'No indicado')}</span></div>
        ${e.observaciones ? `<div class="aviso">📝 <b>Observación del comercio:</b> ${esc(e.observaciones)}</div>` : ''}
      </div>
      <div class="ficha-seccion"><h3>📞 Contacto comercial y horario</h3>
        <div class="dato"><span class="etiqueta">Contacto</span><span class="valor">${contacto}</span></div>
        <div class="dato"><span class="etiqueta">Horario de atención</span><span class="valor">${esc(e.horario||'No indicado')}</span></div>
        <div class="dato"><span class="etiqueta">Medio autorizado</span><span class="valor">${e.telefono?'Teléfono / WhatsApp'+(e.email?' y correo electrónico':''):e.email?'Correo electrónico':'Por definir — solicitar autorización'}</span></div>
      </div>
      <div class="ficha-seccion"><h3>📋 Requisitos y condiciones de compra</h3>
        <div class="dato"><span class="etiqueta">Requisitos de ingreso</span><span class="valor">${esc(req)}</span></div>
        <div class="dato"><span class="etiqueta">Condiciones conocidas</span><span class="valor">${esc(cond)}</span></div>
        <div class="dato"><span class="etiqueta">Refrigeración</span><span class="valor">${esc(e.refrigeracion||'No indicado')} ${e.capacidadFrio?`· Capacidad: ${esc(e.capacidadFrio)}`:''}</span></div>
        <div class="dato"><span class="etiqueta">Local</span><span class="valor">${esc(e.local||'No indicado')}</span></div>
        ${esSuper ? `<div class="aviso aviso-verde">🏢 <b>Decisión de compra:</b> al ser supermercado, la decisión puede realizarse en la sucursal o en oficina central. Contacto correspondiente: ${contacto.replace(/<br>/g,' · ')}</div>` : ''}
      </div>
      <div class="ficha-seccion"><h3>✅ Verificación</h3>
        <div class="dato"><span class="etiqueta">Última actualización</span><span class="valor">${hoy()}</span></div>
        <div class="dato"><span class="etiqueta">Estado de la información</span><span class="valor"><span class="badge confirmar">Pendiente de confirmación por el comercio</span></span></div>
        <div class="dato"><span class="etiqueta">Origen</span><span class="valor">Base de datos unificada · Encuesta cantón Latacunga (162 establecimientos)</span></div>
        <div class="dato"><span class="etiqueta">Distinto a</span><span class="valor">"Confirmó que recibe proveedores" — este comercio aún no ha confirmado su cuenta en la plataforma.</span></div>
      </div>`;
    this.mostrar('ficha');
    setTimeout(() => {
      const el = document.getElementById('miniMapa');
      if (!el) return;
      if (!this.mapsListo) {
        el.innerHTML = `<div class="aviso">Configura la API Key de Google Maps en <code>js/config.js</code> para ver el mapa.</div>`;
        return;
      }
      const centro = {lat: e.lat, lng: e.lon};
      this.miniMapa = new window.google.maps.Map(el, {
        center: centro, zoom: 15, disableDefaultUI: true,
        gestureHandling: 'none', clickableIcons: false
      });
      new window.google.maps.Marker({position: centro, map: this.miniMapa, icon: this.iconoMarcador(e.tipo)});
    }, 80);
  },

  contactar(id) {
    const e = this.estado.establecimientos.find(x => x.id === id);
    const medios = [e.telefono && `<a class="btn btn-primary" href="tel:${e.telefono}">📞 Llamar al ${esc(e.telefono)}</a>`,
      e.telefono && `<a class="btn" href="https://wa.me/593${e.telefono}" target="_blank">💬 WhatsApp</a>`,
      e.email && `<a class="btn" href="mailto:${e.email}?subject=Propuesta%20de%20proveedor">✉️ Correo</a>`].filter(Boolean).join('');
    this.abrirModal('Contactar al comercio', `
      <p style="font-size:13px"><b>${esc(e.nombre)}</b></p>
      <p style="font-size:12px;color:var(--muted)">Utiliza únicamente el medio autorizado por el comercio. La ubicación y los contactos se publicaron con fines de gestión comercial.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${medios || 'Este comercio no tiene contacto publicado. Puedes registrar el resultado manualmente.'}</div>
      <div class="campo" style="margin-top:14px"><label>Registrar resultado del contacto (opcional)</label>
        <select id="resultadoContacto"><option value="">— Seleccionar —</option><option>Me interesa</option><option>Solicito información</option><option>Agendar visita</option><option>No interesado por ahora</option></select></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cerrar</button>
        <button class="btn btn-primary" onclick="App.registrarResultado('${id}')">Guardar resultado</button></div>`);
  },

  registrarResultado(id) {
    const r = document.getElementById('resultadoContacto').value;
    if (!r) { this.toast('Selecciona un resultado'); return; }
    this.estado.respuestas.push({id: uid(), establecimientoId: id, usuarioId: this.estado.usuario?.id, respuesta: r, fecha: hoy(), manual: true});
    DB.guardar('respuestas', this.estado.respuestas);
    this.cerrarModal(); this.toast('Resultado registrado: ' + r);
  },

  /* =====================================================================
     PRODUCTOS Y CATÁLOGO
     ===================================================================== */
  abrirFormProducto(id) {
    const p = id ? this.estado.productos.find(x => x.id === id) : null;
    const cats = this.estado.categorias.filter(c => c !== 'Lácteos');
    this.abrirModal(p ? 'Editar producto' : 'Nuevo producto', `
      <div class="grid-2">
        <div class="campo"><label>Nombre *</label><input id="pNombre" value="${esc(p?.nombre||'')}" placeholder="Ej. Queso artesanal"></div>
        <div class="campo"><label>Categoría *</label><select id="pCategoria">${cats.map(c=>`<option ${p?.categoria===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
      </div>
      <div class="campo"><label>Fotografía (URL)</label><input id="pFoto" value="${esc(p?.foto||'')}" placeholder="https://…"></div>
      <div class="campo"><label>Descripción y presentación</label><textarea id="pDesc" placeholder="Ej. Queso fresco en presentación de 500 g">${esc(p?.descripcion||'')}</textarea></div>
      <div class="grid-2">
        <div class="campo"><label>Precio al comercio ($)</label><input id="pPrecioCom" type="number" step="0.01" value="${p?.precioComercio||''}"></div>
        <div class="campo"><label>Precio sugerido al consumidor ($)</label><input id="pPrecioCons" type="number" step="0.01" value="${p?.precioConsumidor||''}"></div>
        <div class="campo"><label>Pedido mínimo</label><input id="pMin" value="${esc(p?.pedidoMinimo||'')}" placeholder="Ej. 5 unidades"></div>
        <div class="campo"><label>Capacidad semanal</label><input id="pCap" value="${esc(p?.capacidad||'')}" placeholder="Ej. 100 kg/semana"></div>
        <div class="campo"><label>Vida útil / conservación</label><input id="pVida" value="${esc(p?.vidaUtil||'')}" placeholder="Ej. 8 días refrigerado"></div>
        <div class="campo"><label>Zonas de entrega</label><input id="pZonas" value="${esc(p?.zonas||'Latacunga, Lasso, Tanicuchi')}" placeholder="Separadas por coma"></div>
      </div>
      <div class="campo"><label>Frecuencia de entrega</label><input id="pFreq" value="${esc(p?.frecuencia||'Semanal')}"></div>
      <div class="campo"><label>Documentación disponible</label><input id="pDocs" value="${esc(p?.documentacion||'')}" placeholder="Ej. Registro sanitario, permiso municipal"></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.guardarProducto('${p?.id||''}')">Guardar producto</button></div>`);
  },

  guardarProducto(id) {
    const v = i => document.getElementById(i).value.trim();
    if (!v('pNombre')) { this.toast('El nombre es obligatorio'); return; }
    const datos = {
      nombre: v('pNombre'), categoria: v('pCategoria'), foto: v('pFoto'), descripcion: v('pDesc'),
      precioComercio: v('pPrecioCom'), precioConsumidor: v('pPrecioCons'), pedidoMinimo: v('pMin'),
      capacidad: v('pCap'), vidaUtil: v('pVida'), zonas: v('pZonas'), frecuencia: v('pFreq'), documentacion: v('pDocs')
    };
    if (id) Object.assign(this.estado.productos.find(x => x.id === id), datos);
    else this.estado.productos.push({id: uid(), ...datos});
    DB.guardar('productos', this.estado.productos);
    this.cerrarModal(); this.renderizarProductos(); this.toast('Producto guardado');
  },

  renderizarProductos() {
    const c = document.getElementById('listaProductos');
    if (!this.estado.productos.length) {
      c.innerHTML = `<div class="aviso">Aún no tienes productos registrados. Crea tu primer producto para poder buscar dónde ofrecerlo.
        <br><br><button class="btn btn-primary" onclick="App.abrirFormProducto()">+ Crear mi primer producto</button></div>`;
      return;
    }
    c.innerHTML = this.estado.productos.map(p => `
      <div class="tarjeta">
        ${p.foto ? `<img class="producto-img" src="${esc(p.foto)}" alt="${esc(p.nombre)}">` : '<div class="producto-placeholder">📦</div>'}
        <h3>${esc(p.nombre)}</h3>
        <div><span class="badge">${esc(p.categoria)}</span> <span class="badge">$${esc(p.precioComercio||'—')} al comercio</span></div>
        <div class="meta" style="margin-top:6px">${esc(p.descripcion||'Sin descripción')}<br>
          Mínimo: ${esc(p.pedidoMinimo||'—')} · Capacidad: ${esc(p.capacidad||'—')}<br>
          Zonas: ${esc(p.zonas||'—')} · Entrega: ${esc(p.frecuencia||'—')}</div>
        <div class="tarjeta-acciones">
          <button class="btn btn-small btn-primary" onclick="App.buscarDondeOfrecerlo('${p.id}')">🔎 Buscar dónde ofrecerlo</button>
          <button class="btn btn-small" onclick="App.abrirFormProducto('${p.id}')">✏️ Editar</button>
          <button class="btn btn-small btn-peligro" onclick="App.eliminarProducto('${p.id}')">🗑️</button>
        </div>
      </div>`).join('');
  },

  eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.estado.productos = this.estado.productos.filter(p => p.id !== id);
    DB.guardar('productos', this.estado.productos); this.renderizarProductos(); this.toast('Producto eliminado');
  },

  compartirCatalogo() {
    if (!this.estado.productos.length) { this.toast('Primero registra productos'); return; }
    const texto = '🌾 *Mi catálogo de productos*\n\n' + this.estado.productos.map(p =>
      `• *${p.nombre}* (${p.categoria})\n  ${p.descripcion||''}\n  Precio al comercio: $${p.precioComercio||'—'} | Mínimo: ${p.pedidoMinimo||'—'}\n  Entrega: ${p.zonas||'—'} (${p.frecuencia||'—'})`).join('\n\n');
    if (navigator.share) navigator.share({title: 'Mi catálogo', text: texto}).catch(()=>{});
    else {
      navigator.clipboard?.writeText(texto);
      this.abrirModal('Compartir catálogo', `<p style="font-size:13px">Copia este enlace o texto para compartir tu catálogo:</p>
        <textarea readonly style="width:100%;height:180px;padding:10px;border:1px solid var(--borde);border-radius:10px">${esc(texto)}</textarea>
        <div class="modal-acciones"><button class="btn btn-primary" onclick="App.cerrarModal()">Listo</button></div>`);
    }
  },

  descargarCatalogoPDF() {
    if (!this.estado.productos.length) { this.toast('Primero registra productos'); return; }
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Ficha comercial</title>
      <style>body{font-family:system-ui,sans-serif;padding:32px;color:#1e2b26}h1{color:#0b6e4f}.p{border:1px solid #dce3df;border-radius:10px;padding:14px;margin:12px 0;page-break-inside:avoid}.tag{background:#e6f4ee;color:#0b6e4f;padding:3px 8px;border-radius:10px;font-size:12px}</style></head>
      <body><h1>📦 Ficha comercial — ${esc(this.estado.usuario?.nombre||'Emprendedor')}</h1>
      <p>Generada el ${hoy()} · Mapa de Oportunidades · Latacunga</p>
      ${this.estado.productos.map(p=>`<div class="p"><h2>${esc(p.nombre)}</h2><span class="tag">${esc(p.categoria)}</span>
      <p>${esc(p.descripcion||'')}</p><p><b>Precio al comercio:</b> $${esc(p.precioComercio||'—')} · <b>Precio sugerido:</b> $${esc(p.precioConsumidor||'—')}<br>
      <b>Pedido mínimo:</b> ${esc(p.pedidoMinimo||'—')} · <b>Capacidad semanal:</b> ${esc(p.capacidad||'—')}<br>
      <b>Vida útil:</b> ${esc(p.vidaUtil||'—')} · <b>Zonas:</b> ${esc(p.zonas||'—')} · <b>Entrega:</b> ${esc(p.frecuencia||'—')}<br>
      <b>Documentación:</b> ${esc(p.documentacion||'—')}</p></div>`).join('')}
      <p style="font-size:11px;color:#60716a">La compatibilidad con comercios es orientativa y no garantiza aceptación.</p></body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 400);
  },

  /* =====================================================================
     VINCULACIÓN PRODUCTO ↔ ESTABLECIMIENTO
     ===================================================================== */
  buscarDondeOfrecerlo(id) {
    const p = this.estado.productos.find(x => x.id === id);
    const zonas = (p.zonas||'').toLowerCase().split(',').map(z => z.trim()).filter(Boolean);
    const cats = (p.categoria||'').toLowerCase();
    const compatibles = this.estado.establecimientos.map(e => {
      const razones = [];
      const eTexto = (e.categoriaProductos||[]).join(',').toLowerCase() + ' ' + (e.mayorDemanda||'').toLowerCase();
      const catMatch = cats && (eTexto.includes(cats) || cats.includes('lácteos') || cats.includes('alimentos'));
      if (catMatch) razones.push('Vende productos de tu categoría');
      const zonaMatch = zonas.some(z => [e.parroquia, e.sector, e.direccion].join(' ').toLowerCase().includes(z));
      if (zonaMatch) razones.push('está dentro de tu cobertura');
      if (e.recepcion === 'Recibe propuestas') razones.push('recibe propuestas');
      const frioOk = !p.vidaUtil?.toLowerCase().includes('refriger') || e.refrigeracion === 'Si';
      if (frioOk && p.vidaUtil) razones.push('compatible con conservación');
      const capOk = !p.capacidad || !!e.volumen;
      if (capOk) razones.push('capacidad apropiada');
      return {e, razones, score: razones.length, frioOk};
    }).filter(x => x.score >= 2 && x.e.recepcion !== 'No recibe por ahora')
      .sort((a,b) => b.score - a.score).slice(0, 30);

    this.abrirModal(`Dónde ofrecer "${esc(p.nombre)}"`, `
      <div class="aviso aviso-verde">Se encontraron <b>${compatibles.length}</b> comercios compatibles. La compatibilidad es orientativa y <b>no garantiza</b> la aceptación.</div>
      ${compatibles.map(({e, razones}) => `
        <div class="tarjeta" style="box-shadow:none;border:1px solid var(--borde)">
          <h3>${esc(e.nombre)}</h3>
          <div class="meta">${esc(e.tipo)} · ${esc(e.sector||e.parroquia)} · ${esc(e.direccion)}</div>
          <div class="aviso" style="margin:6px 0;font-size:12px">✓ ${razones.join(', ')}.</div>
          <div class="tarjeta-acciones">
            <button class="btn btn-small btn-primary" onclick="App.cerrarModal();App.verFicha('${e.id}')">Ver ficha y condiciones</button>
            <button class="btn btn-small" onclick="App.guardarOportunidad('${e.id}')">💾 Guardar</button>
          </div>
        </div>`).join('') || '<div class="aviso">No se encontraron comercios compatibles. Prueba ampliando tus zonas de entrega.</div>'}`);
  },

  /* =====================================================================
     OPORTUNIDADES Y SEGUIMIENTO
     ===================================================================== */
  estados: ['Por contactar','Contactado','Muestra entregada','En negociación','Primer pedido','Punto de venta activo'],

  
async guardarOportunidad(id) {
  if (!this.estado.usuario ||
      this.estado.usuario.rol !== 'emprendedor') {
    this.toast('Inicia sesión como emprendedor');
    this.abrirLogin();
    return;
  }

  const establecimientoId = String(id);

  if (this.estado.oportunidades.some(
    o => o.establecimientoId === establecimientoId
  )) {
    this.toast('Esta oportunidad ya está guardada');
    return;
  }

  try {
    await this.peticionLaravel('/api/opportunities', 'POST', {
      establishment_id: Number(establecimientoId)
    });

    await this.cargarOportunidades();

    this.toast('Oportunidad guardada correctamente');

    if (this.estado.vista === 'ficha') {
      this.verFicha(establecimientoId);
    }

  } catch (error) {
    console.error('Error al guardar oportunidad:', error);
    this.toast(error.message || 'No se pudo guardar');
  }
},


  enviarPropuesta(id) {
    if (!this.estado.productos.length) { this.toast('Registra productos antes de enviar una propuesta'); this.abrirFormProducto(); return; }
    this.abrirModal('Enviar propuesta', `
      <div class="campo"><label>Selecciona tus productos</label>
        <div class="lista-checks">${this.estado.productos.map(p=>`<label><input type="checkbox" class="propProducto" value="${esc(p.nombre)}"> ${esc(p.nombre)}</label>`).join('')}</div>
      </div>
      <div class="campo"><label>Mensaje para el comercio</label><textarea id="propMensaje" placeholder="Hola, somos productores locales y nos gustaría ofrecer nuestros productos…"></textarea></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.registrarPropuesta('${id}')">Registrar propuesta</button></div>`);
  },

  registrarPropuesta(id) {
    const prods = [...document.querySelectorAll('.propProducto:checked')].map(x => x.value);
    if (!prods.length) { this.toast('Selecciona al menos un producto'); return; }
    const prop = {id: uid(), establecimientoId: id, usuarioId: this.estado.usuario?.id,
      productos: prods, mensaje: document.getElementById('propMensaje').value, fecha: hoy(), estado: 'Enviada'};
    this.estado.propuestas.push(prop); DB.guardar('propuestas', this.estado.propuestas);
    const op = this.estado.oportunidades.find(o => o.establecimientoId === id && o.usuarioId === this.estado.usuario?.id);
    if (op && op.estado === 'Por contactar') { op.estado = 'Contactado'; DB.guardar('oportunidades', this.estado.oportunidades); }
    this.cerrarModal(); this.toast('Propuesta registrada. El comercio podrá responder: Me interesa / Solicito información / Agendar visita / No interesado.');
  },

  renderizarOportunidades() {
    const mis = this.estado.usuario
      ? this.estado.oportunidades.filter(o => o.usuarioId === this.estado.usuario.id)
      : this.estado.oportunidades;
    const activas = mis.filter(o => o.estado !== 'No concretada');
    const primerPedido = mis.filter(o => ['Primer pedido','Punto de venta activo'].includes(o.estado)).length;
    document.getElementById('estadisticas').innerHTML = `
      <div class="stat"><strong>${mis.length}</strong><small>Oportunidades</small></div>
      <div class="stat"><strong>${activas.length}</strong><small>Activas</small></div>
      <div class="stat"><strong>${primerPedido}</strong><small>Primer pedido</small></div>
      <div class="stat"><strong>${mis.filter(o=>o.estado==='Punto de venta activo').length}</strong><small>Puntos activos</small></div>
      <div class="stat"><strong>${this.estado.propuestas.filter(p=>p.usuarioId===this.estado.usuario?.id).length}</strong><small>Propuestas</small></div>`;
    document.getElementById('kanban').innerHTML = this.estados.map(e =>
      `<div class="kanban-col"><h4>${esc(e)}</h4>${mis.filter(o=>o.estado===e).map(o=>{
        const t = this.estado.establecimientos.find(x=>x.id===o.establecimientoId);
        return `<div class="kanban-item">${esc(t?.nombre||'Comercio')}</div>`;}).join('')}</div>`).join('');
    const c = document.getElementById('listaOportunidades');
    if (!mis.length) { c.innerHTML = '<div class="aviso">Aún no tienes oportunidades guardadas. Explora el mapa y guarda los comercios que te interesen.</div>'; return; }
    c.innerHTML = mis.map(o => {
      const t = this.estado.establecimientos.find(x=>x.id===o.establecimientoId) || {};
      return `<div class="tarjeta"><h3>${esc(t.nombre||'Comercio')}</h3>
        <div><span class="estado ${o.estado==='No concretada'?'no':''}">${esc(o.estado)}</span></div>
        <div class="meta" style="margin-top:6px">${esc(t.direccion||'')}<br>
        📝 ${esc(o.notas||'Sin notas')}<br>
        📅 Próxima gestión: ${esc(o.siguienteGestion||'Sin fecha')}<br>
        🤝 Condiciones: ${esc(o.condiciones||'Sin registrar')}</div>
        <div class="tarjeta-acciones">
          <select onchange="App.cambiarEstado('${o.id}',this.value)" class="btn btn-small" style="max-width:190px">
            ${this.estados.concat(['No concretada']).map(e=>`<option ${o.estado===e?'selected':''}>${e}</option>`).join('')}
          </select>
          <button class="btn btn-small" onclick="App.editarSeguimiento('${o.id}')">✏️ Notas y gestión</button>
          <button class="btn btn-small" onclick="App.verFicha('${o.establecimientoId}')">Ver ficha</button>
        </div></div>`;
    }).join('');
  },

 
async cambiarEstado(id, estado) {
  const estados = {
    'Por contactar': 'por_contactar',
    'Contactado': 'contactado',
    'Muestra entregada': 'muestra_entregada',
    'En negociación': 'en_negociacion',
    'Primer pedido': 'primer_pedido',
    'Punto de venta activo': 'punto_venta_activo',
    'No concretada': 'no_concretada'
  };

  if (!estados[estado]) {
    this.toast('Estado no válido');
    return;
  }

  try {
    await this.peticionLaravel(
      `/api/opportunities/${id}`,
      'PATCH',
      { status: estados[estado] }
    );

    await this.cargarOportunidades();
    this.renderizarOportunidades();

    this.toast('Estado actualizado: ' + estado);

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    await this.cargarOportunidades();
    this.renderizarOportunidades();

    this.toast('No se pudo actualizar el estado');
  }
},


  editarSeguimiento(id) {
    const o = this.estado.oportunidades.find(x => x.id === id);
    this.abrirModal('Notas y seguimiento', `
      <div class="campo"><label>Notas privadas</label><textarea id="segNotas">${esc(o.notas)}</textarea></div>
      <div class="campo"><label>Fecha de próxima gestión</label><input id="segFecha" type="date" value="${esc(o.siguienteGestion)}"></div>
      <div class="campo"><label>Condiciones acordadas</label><textarea id="segCond">${esc(o.condiciones)}</textarea></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.guardarSeguimiento('${id}')">Guardar</button></div>`);
  },

 
async guardarSeguimiento(id) {
  const datos = {
    private_notes: document.getElementById('segNotas').value,
    next_follow_up_at:
      document.getElementById('segFecha').value || null,
    agreed_conditions:
      document.getElementById('segCond').value
  };

  try {
    await this.peticionLaravel(
      `/api/opportunities/${id}`,
      'PATCH',
      datos
    );

    await this.cargarOportunidades();

    this.cerrarModal();
    this.renderizarOportunidades();

    this.toast('Seguimiento guardado correctamente');

  } catch (error) {
    console.error('Error guardando seguimiento:', error);
    this.toast('No se pudo guardar el seguimiento');
  }
},


  /* =====================================================================
     REGISTRO DE ESTABLECIMIENTOS Y ADMINISTRACIÓN
     ===================================================================== */
  abrirRegistroComercio() {
    this.abrirModal('Registrar establecimiento', `
      <div class="grid-2">
        <div class="campo"><label>Nombre *</label><input id="cNombre"></div>
        <div class="campo"><label>Tipo</label><select id="cTipo"><option>Tienda</option><option>Minimercado</option><option>Supermercado</option><option>Otro</option></select></div>
      </div>
      <div class="campo"><label>Dirección *</label><input id="cDir"></div>
      <div class="grid-2">
        <div class="campo"><label>Sector / barrio</label><input id="cSector"></div>
        <div class="campo"><label>Parroquia</label><input id="cParroquia" value="Latacunga"></div>
        <div class="campo"><label>Latitud *</label><input id="cLat" type="number" step="any" value="-0.9934"></div>
        <div class="campo"><label>Longitud *</label><input id="cLon" type="number" step="any" value="-78.6"></div>
        <div class="campo"><label>Teléfono</label><input id="cTel"></div>
        <div class="campo"><label>Correo</label><input id="cEmail"></div>
      </div>
      <div class="campo"><label>Productos que busca (separados por coma)</label><input id="cBusca" value="Leche, Queso, Yogurt"></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.guardarComercio()">Registrar</button></div>`);
  },

  guardarComercio() {
    const v = i => document.getElementById(i).value.trim();
    if (!v('cNombre') || !v('cDir')) { this.toast('Nombre y dirección son obligatorios'); return; }
    const duplicado = this.estado.establecimientos.find(e =>
      e.nombre.toLowerCase() === v('cNombre').toLowerCase() ||
      e.direccion.toLowerCase() === v('cDir').toLowerCase() ||
      (v('cTel') && e.telefono === v('cTel')));
    if (duplicado && !confirm(`Posible duplicado: "${duplicado.nombre}". ¿Deseas registrarlo de todas formas?`)) return;
    const e = {
      id: 'N-' + uid(), nombre: v('cNombre'), tipo: v('cTipo'), tipoOriginal: v('cTipo'),
      direccion: v('cDir'), sector: v('cSector'), parroquia: v('cParroquia'),
      lat: parseFloat(v('cLat')) || -0.9934, lon: parseFloat(v('cLon')) || -78.6,
      telefono: v('cTel'), email: v('cEmail'), responsable: this.estado.usuario?.nombre || '',
      horario: 'Por confirmar', categoriaProductos: v('cBusca').split(',').map(s=>s.trim()).filter(Boolean),
      vendeLocales: 'No indicado', mayorDemanda: v('cBusca'), volumen: '', frecuencia: '', proveedorActual: '',
      refrigeracion: 'No indicado', capacidadFrio: '', recepcion: 'Por confirmar', artesanales: '',
      observaciones: 'Registrado por el usuario — pendiente de verificación por el administrador.', local: '', clientesDia: ''
    };
    this.estado.establecimientos.push(e); DB.guardar('establecimientos', this.estado.establecimientos);
    this.cerrarModal(); this.aplicarFiltros(); this.mostrar('mapa');
    this.toast('Establecimiento registrado. El administrador deberá verificarlo.');
  },

  reportarInfo(id) {
    this.abrirModal('Reportar información incorrecta', `
      <div class="campo"><label>¿Qué información es incorrecta?</label>
        <select id="repTipo"><option>Ubicación en el mapa</option><option>Dirección</option><option>Teléfono / contacto</option><option>Horario</option><option>Recepción de propuestas</option><option>Otro</option></select></div>
      <div class="campo"><label>Detalle</label><textarea id="repDetalle" placeholder="Describe la corrección sugerida"></textarea></div>
      <div class="modal-acciones"><button class="btn" onclick="App.cerrarModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="App.guardarReporte('${id}')">Enviar reporte</button></div>`);
  },

  guardarReporte(id) {
    this.estado.reportes.push({id: uid(), establecimientoId: id,
      tipo: document.getElementById('repTipo').value, detalle: document.getElementById('repDetalle').value,
      fecha: hoy(), estado: 'Pendiente', usuarioId: this.estado.usuario?.id});
    DB.guardar('reportes', this.estado.reportes); this.cerrarModal();
    this.toast('Reporte enviado. Gracias por ayudar a mantener la información actualizada.');
  },

  renderizarAdmin() {
    const u = this.estado.usuario;
    if (!u || u.rol !== 'admin') {
      document.getElementById('adminContenido').innerHTML = `<div class="aviso">Esta sección es solo para administradores. Inicia sesión con el rol "Administrador" desde el menú ☰.</div>`;
      document.getElementById('adminGrid').innerHTML = '';
      return;
    }
    const dup = this.detectarDuplicados();
    document.getElementById('adminGrid').innerHTML = `
      <button class="admin-tile" onclick="App.adminVer('establecimientos')"><span>🏪</span><strong>Establecimientos (${this.estado.establecimientos.length})</strong></button>
      <button class="admin-tile" onclick="App.adminVer('usuarios')"><span>👥</span><strong>Usuarios (${this.estado.usuarios.length})</strong></button>
      <button class="admin-tile" onclick="App.adminVer('categorias')"><span>🏷️</span><strong>Categorías</strong></button>
      <button class="admin-tile" onclick="App.adminVer('reportes')"><span>⚠️</span><strong>Reportes (${this.estado.reportes.length})</strong></button>
      <button class="admin-tile" onclick="App.adminVer('duplicados')"><span>🔍</span><strong>Duplicados (${dup.length})</strong></button>
      <button class="admin-tile" onclick="App.adminVer('ubicaciones')"><span>📍</span><strong>Corregir ubicación</strong></button>
      <button class="admin-tile" onclick="App.abrirRegistroComercio()"><span>➕</span><strong>Nuevo comercio</strong></button>
      <button class="admin-tile" onclick="App.adminVer('carga')"><span>📥</span><strong>Carga de Excel</strong></button>`;
    document.getElementById('adminContenido').innerHTML = '<div class="aviso aviso-verde">Selecciona un módulo para gestionarlo. Los datos se guardan en este dispositivo; en producción se sincronizarían con la base de datos de la entidad responsable.</div>';
  },

  detectarDuplicados() {
    const vistos = {}, dup = [];
    this.estado.establecimientos.forEach(e => {
      [e.nombre.toLowerCase(), e.direccion.toLowerCase(), e.telefono].filter(Boolean).forEach(k => {
        if (vistos[k] && vistos[k] !== e.id) dup.push({a: vistos[k], b: e.id, clave: k});
        vistos[k] = e.id;
      });
    });
    return dup;
  },

  adminVer(mod) {
    let html = '';
    if (mod === 'establecimientos') {
      html = '<h3>Establecimientos registrados</h3><table class="tabla"><tr><th>Nombre</th><th>Tipo</th><th>Sector</th><th>Recepción</th><th>Acción</th></tr>' +
        this.estado.establecimientos.slice(0, 200).map(e=>`<tr><td>${esc(e.nombre)}</td><td>${esc(e.tipo)}</td><td>${esc(e.sector)}</td><td>${esc(e.recepcion)}</td><td><button class="btn btn-small" onclick="App.verFicha('${e.id}')">Ver</button></td></tr>`).join('') + '</table>';
    } else if (mod === 'usuarios') {
      html = '<h3>Usuarios</h3><table class="tabla"><tr><th>Nombre</th><th>Rol</th><th>ID</th></tr>' +
        this.estado.usuarios.map(u=>`<tr><td>${esc(u.nombre)}</td><td>${esc(u.rol)}</td><td>${esc(u.id)}</td></tr>`).join('') + '</table>';
    } else if (mod === 'categorias') {
      html = '<h3>Categorías de productos</h3><div class="lista-checks">' +
        this.estado.categorias.map(c=>`<span class="badge" style="font-size:13px;padding:8px 12px">${esc(c)} <button onclick="App.eliminarCategoria('${esc(c)}')" style="border:none;background:none;color:#c0392b">✕</button></span>`).join('') +
        '</div><div class="campo" style="margin-top:12px"><input id="nuevaCat" placeholder="Nueva categoría"><button class="btn btn-primary btn-small" onclick="App.agregarCategoria()">Agregar</button></div>';
    } else if (mod === 'reportes') {
      html = '<h3>Reportes de información incorrecta</h3>' +
        (this.estado.reportes.length ? '<table class="tabla"><tr><th>Comercio</th><th>Tipo</th><th>Detalle</th><th>Estado</th><th></th></tr>' +
          this.estado.reportes.map(r=>{const e=this.estado.establecimientos.find(x=>x.id===r.establecimientoId);
            return `<tr><td>${esc(e?.nombre||'—')}</td><td>${esc(r.tipo)}</td><td>${esc(r.detalle)}</td><td>${esc(r.estado)}</td><td><button class="btn btn-small" onclick="App.resolverReporte('${r.id}')">Resolver</button></td></tr>`;}).join('') + '</table>' : '<div class="aviso">No hay reportes pendientes.</div>');
    } else if (mod === 'duplicados') {
      html = '<h3>Posibles duplicados detectados</h3>' + (dup.length ?
        '<table class="tabla"><tr><th>Registro A</th><th>Registro B</th><th>Coincidencia</th></tr>' +
        this.detectarDuplicados().map(d=>{const n=id=>this.estado.establecimientos.find(x=>x.id===id)?.nombre||id;
          return `<tr><td>${esc(n(d.a))}</td><td>${esc(n(d.b))}</td><td>${esc(d.clave)}</td></tr>`;}).join('') + '</table>' : '<div class="aviso aviso-verde">No se detectaron duplicados por nombre, dirección o teléfono.</div>');
    } else if (mod === 'ubicaciones') {
      html = `<h3>Corregir ubicación en el mapa</h3><div class="campo"><label>Seleccionar establecimiento</label>
        <select id="corregirId">${this.estado.establecimientos.map(e=>`<option value="${e.id}">${esc(e.nombre)} — ${esc(e.parroquia)}</option>`).join('')}</select></div>
        <div class="grid-2"><div class="campo"><label>Nueva latitud</label><input id="corregirLat" type="number" step="any"></div>
        <div class="campo"><label>Nueva longitud</label><input id="corregirLon" type="number" step="any"></div></div>
        <button class="btn btn-primary" onclick="App.corregirUbicacion()">Guardar corrección</button>`;
    } else if (mod === 'carga') {
      html = `<div class="aviso">El archivo <b>Lacteos_Datos_Unificados_Consolidado (1).xlsx</b> ya fue procesado e integrado: <b>${this.estado.establecimientos.length} establecimientos</b> con latitud, longitud, tipo, contacto, horario, categorías, recepción de proveedores, refrigeración y observaciones. Para actualizar, convierte el Excel a JSON y reemplaza <code>data/establecimientos.json</code>.</div>
        <div class="campo"><label>Importar JSON de establecimientos</label><input type="file" id="archivoExcel" accept=".json"></div>
        <button class="btn btn-primary" onclick="App.importarJSON()">Importar</button>`;
    }
    document.getElementById('adminContenido').innerHTML = html;
  },

  agregarCategoria() {
    const v = document.getElementById('nuevaCat').value.trim();
    if (!v) return;
    this.estado.categorias.push(v); DB.guardar('categorias', this.estado.categorias);
    this.precargarCategorias(); this.adminVer('categorias'); this.toast('Categoría agregada');
  },
  eliminarCategoria(c) {
    this.estado.categorias = this.estado.categorias.filter(x => x !== c);
    DB.guardar('categorias', this.estado.categorias); this.precargarCategorias(); this.adminVer('categorias');
  },
  resolverReporte(id) {
    const r = this.estado.reportes.find(x => x.id === id); r.estado = 'Resuelto';
    DB.guardar('reportes', this.estado.reportes); this.adminVer('reportes'); this.toast('Reporte marcado como resuelto');
  },
  corregirUbicacion() {
    const e = this.estado.establecimientos.find(x => x.id === document.getElementById('corregirId').value);
    e.lat = parseFloat(document.getElementById('corregirLat').value) || e.lat;
    e.lon = parseFloat(document.getElementById('corregirLon').value) || e.lon;
    DB.guardar('establecimientos', this.estado.establecimientos); this.aplicarFiltros();
    this.toast('Ubicación corregida');
  },
  importarJSON() {
    const archivo = document.getElementById('archivoExcel').files[0];
    if (!archivo) { this.toast('Selecciona un archivo'); return; }
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        if (!Array.isArray(datos)) throw Error('Formato inválido');
        this.estado.establecimientos = datos; DB.guardar('establecimientos', datos);
        this.aplicarFiltros(); this.adminVer('carga'); this.toast(`Importados ${datos.length} establecimientos`);
      } catch (e) { this.toast('Error al importar: ' + e.message); }
    };
    lector.readAsText(archivo);
  },

  /* =====================================================================
     REPORTES E INDICADORES (KPI principal del documento)
     ===================================================================== */
  renderizarReportes() {
    const total = this.estado.establecimientos.length;
    const reciben = this.estado.establecimientos.filter(e=>e.recepcion==='Recibe propuestas').length;
    const emprendedores = this.estado.usuarios.filter(u=>u.rol==='emprendedor').length;
    const conPedido = this.estado.oportunidades.filter(o=>['Primer pedido','Punto de venta activo'].includes(o.estado)).length;
    const activos = this.estado.oportunidades.filter(o=>o.estado==='Punto de venta activo').length;
    document.getElementById('reportesContenido').innerHTML = `
      <div class="estadisticas">
        <div class="stat"><strong>${total}</strong><small>Comercios en el mapa</small></div>
        <div class="stat"><strong>${reciben}</strong><small>Reciben propuestas</small></div>
        <div class="stat"><strong>${emprendedores}</strong><small>Emprendedores</small></div>
        <div class="stat"><strong>${conPedido}</strong><small>Primer pedido logrado</small></div>
        <div class="stat"><strong>${activos}</strong><small>Puntos de venta activos</small></div>
      </div>
      <div class="ficha-seccion"><h3>🎯 Indicador principal de éxito</h3>
        <p style="font-size:13px;line-height:1.6">El éxito se mide por <b>cuántos emprendedores consiguen un primer pedido y mantienen puntos de venta activos</b>, no únicamente por cuántos establecimientos aparecen en el mapa.</p>
        <div class="aviso aviso-verde">${conPedido ? `✅ ${conPedido} oportunidad(es) han llegado a primer pedido o punto activo.` : '📌 Aún no hay pedidos registrados. Registra el avance de tus oportunidades para medir el impacto real.'}</div>
      </div>
      <div class="ficha-seccion"><h3>📊 Distribución por tipo de comercio</h3>
        ${['Tienda','Minimercado','Supermercado','Otro'].map(t=>{const n=this.estado.establecimientos.filter(e=>e.tipo===t).length;
          return `<div class="dato"><span class="etiqueta">${t}</span><span class="valor"><b>${n}</b> · ${(n/total*100).toFixed(1)}%</span></div>`;}).join('')}
      </div>
      <div class="ficha-seccion"><h3>🕒 Registro de actividad</h3>
        ${(this.estado.actividad||[]).slice(0,10).map(a=>`<div class="dato"><span class="etiqueta">${esc(a.fecha)}</span><span class="valor">${esc(a.texto)}</span></div>`).join('') || '<div class="meta">Sin actividad registrada.</div>'}
      </div>`;
  },

  actualizarRegistro(accion, texto) {
    const a = DB.leer('actividad', []);
    a.unshift({fecha: hoy(), texto}); DB.guardar('actividad', a);
    this.estado.actividad = a;
  },

  /* =====================================================================
     MODALES Y TOAST
     ===================================================================== */
  abrirModal(titulo, contenido) {
    document.getElementById('modalContenido').innerHTML = `<h2>${titulo}</h2>${contenido}`;
    document.getElementById('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },
  cerrarModal() {
    document.getElementById('modal').classList.add('hidden');
    document.body.style.overflow = '';
  },
  toast(mensaje) {
    const t = document.getElementById('toast');
    t.textContent = mensaje; t.classList.add('visible');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('visible'), 3200);
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());
