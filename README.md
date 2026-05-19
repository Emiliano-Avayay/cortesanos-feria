# Cultura Cortesana — Sitio web del evento

Sitio web premium para **Cultura Cortesana — Feria de Vinos**, celebración por los 8 años de Los Cortesanos en Rafaela.

---

## 📁 Estructura de archivos

```
cultura-cortesana/
├── index.html        ← todo el contenido del sitio
├── styles.css        ← estilos y paleta (editable arriba del archivo)
├── script.js         ← WhatsApp, menú móvil, animaciones
├── README.md         ← este archivo
└── assets/
    ├── favicon.svg   ← ícono de la pestaña del navegador
    └── bodegas/      ← carpeta lista para sumar logos reales
```

---

## ▶️ Cómo probar el sitio en tu computadora

### Opción A — La más simple (doble clic)
1. Abrí la carpeta `cultura-cortesana/`.
2. Hacé doble clic en `index.html`.
3. Se abre en tu navegador por defecto. Listo.

### Opción B — Recomendada (servidor local)
Algunas funciones (como el mapa de Google) se ven mejor con un servidor local. Si tenés Python instalado:

```bash
cd cultura-cortesana
python3 -m http.server 8080
```

Después abrí en el navegador: **http://localhost:8080**

Si usás VS Code, instalá la extensión **"Live Server"**, hacé clic derecho sobre `index.html` y elegí *"Open with Live Server"*. Se recarga sola cuando guardás cambios.

---

## ✏️ Cómo editar los datos más comunes

### 1. Cambiar el número de WhatsApp
Abrí `script.js`. Al principio del archivo vas a ver:

```js
const WHATSAPP_NUMBER = '5493492000000';
```

Reemplazá ese número por el real, en formato internacional, **sin** el símbolo `+`, **sin** espacios y **sin** guiones.
Formato argentino: `549` + código de área (sin 0) + número de celular (sin 15).
Ejemplo Rafaela: `5493492` + número.

También podés cambiar el mensaje predeterminado:
```js
const WHATSAPP_MESSAGE = '¡Hola! Quiero reservar mi entrada...';
```

### 2. Cambiar precios, cupos o beneficios
Abrí `index.html`, buscá la sección `<!-- ENTRADAS -->` (alrededor de la línea donde aparece "Entrada General"). Modificá los textos directamente, son HTML plano.

### 3. Cambiar fecha, lugar u horario
Hacé buscar y reemplazar en `index.html`:
- `13 de junio de 2026`
- `al mediodía`
- `Finca Los Teros`
- `Bella Italia`

Aparecen en el hero, en ubicación, en FAQ, en footer y en el script de Schema.org del `<head>`. Cambiá todos para mantener consistencia.

### 4. Cambiar la paleta de colores
Abrí `styles.css`. Al principio (sección "1. VARIABLES") están todos los colores:

```css
:root {
  --wine: #5C1A2B;     /* color bordó principal */
  --gold: #B89456;     /* dorado de acentos */
  --cream: #FAF6EE;    /* fondo */
  ...
}
```

Cambiá los valores y se actualiza todo el sitio automáticamente.

### 5. Sumar logos reales de bodegas
1. Conseguí los logos en PNG con fondo transparente (idealmente).
2. Guardalos en `assets/bodegas/` con nombres simples: `bottega.png`, `lagarde.png`, etc.
3. En `index.html`, buscá la sección `<!-- BODEGAS -->` y reemplazá cada línea así:

```html
<!-- Antes -->
<li class="bodega-card"><span>Bottega</span></li>

<!-- Después -->
<li class="bodega-card"><img src="assets/bodegas/bottega.png" alt="Bottega"></li>
```

El CSS ya está preparado para mostrar los logos elegantes (en escala de grises que se colorea al pasar el mouse).

### 6. Reemplazar el fondo del hero por una foto real
1. Conseguí una foto horizontal de alta calidad (mínimo 1920px de ancho) — un viñedo, la finca, o copas al sol.
2. Guardala como `assets/hero-evento.jpg`.
3. En `styles.css`, buscá `.hero-bg-image` y reemplazá el bloque por:

```css
.hero-bg-image {
  position: absolute; inset: 0;
  background: url('assets/hero-evento.jpg') center/cover no-repeat;
}
.hero-bg-overlay {
  background: linear-gradient(180deg, rgba(250,246,238,0.4), rgba(250,246,238,0.85));
}
```

### 7. Cambiar el mapa
En `index.html`, buscá `<!-- Mapa: -->`. Te dejé apuntando a "Bella Italia, Santa Fe".
Cuando tengas la ubicación exacta de Finca Los Teros:
1. Andá a [Google Maps](https://maps.google.com), buscá el lugar.
2. Clic en **Compartir → Insertar mapa → Copiar HTML**.
3. Reemplazá el `<iframe>` actual por el nuevo.

### 8. Cambiar la imagen para compartir en WhatsApp / Instagram (Open Graph)
1. Diseñá una imagen de **1200×630 píxeles** (formato horizontal estándar para previews de redes).
2. Guardala como `assets/og-image.jpg`.
3. Ya está enlazada en el `<head>` del HTML. Solo subila al servidor.

---

## 🚀 Cómo subir el sitio a internet (hosting)

### Opción 1 — Netlify (recomendado, gratis)
1. Entrá a [netlify.com](https://www.netlify.com) y creá una cuenta gratuita.
2. En el dashboard, hacé clic en **"Add new site → Deploy manually"**.
3. Arrastrá la carpeta `cultura-cortesana/` completa sobre el área indicada.
4. ¡Listo! Te da una URL del tipo `https://nombre-aleatorio.netlify.app` en menos de un minuto.
5. Para conectar un dominio propio (ej: `culturacortesana.com.ar`), seguí *Domain settings → Add custom domain*.

### Opción 2 — Vercel
1. Entrá a [vercel.com](https://vercel.com).
2. Subí el proyecto desde GitHub o arrastrá la carpeta.
3. URL automática en segundos.

### Opción 3 — Hosting tradicional (cPanel, FTP)
1. Comprimí la carpeta en un .zip o usá un cliente FTP (FileZilla).
2. Subí **el contenido** de `cultura-cortesana/` (no la carpeta en sí) a la carpeta `public_html/` o `www/` de tu hosting.
3. Visitá tu dominio: el sitio se ve.

---

## 📱 Tested en

El sitio fue probado mentalmente para:
- iPhone (Safari)
- Android (Chrome)
- Tablet
- Notebook
- Pantalla grande

Si encontrás un detalle que se rompe en algún dispositivo, contame para ajustarlo.

---

## ⚠️ Datos que faltan completar

El brief no especificaba estos puntos. Cuando los tengas, sumalos a la sección FAQ del HTML:

- [ ] ¿Qué pasa si llueve?
- [ ] Política sobre menores de edad
- [ ] Estacionamiento disponible
- [ ] Medios de pago aceptados para comprar la entrada
- [ ] Política de cancelación / reembolso
- [ ] Dirección exacta de Finca Los Teros (para el mapa)

---

## 🎨 Imágenes recomendadas (placeholders elegantes)

Ahora el hero usa **gradientes cálidos** que evocan finca al mediodía sin necesidad de fotos. Cuando consigas las fotos reales, sumalas según el punto 6 de la guía de arriba. Las que más impacto generan:

1. **Hero** — Plano amplio del viñedo o finca al mediodía, luz natural.
2. **Ubicación** — Detalle de la entrada o el portón de Finca Los Teros.
3. **Gastronomía** — Foto cercana de las brasas, alguien sirviendo, o el sándwich.
4. **Bodegas** — Los 14 logos en alta resolución, fondo transparente.
5. **OG / Compartir** — 1200×630px con el nombre del evento y la fecha.

---

**Los Cortesanos Experience** · Cultura Cortesana 2026
# cortesanos-feria
