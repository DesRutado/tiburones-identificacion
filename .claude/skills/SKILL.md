\# SKILL: Identificación de Tiburones



\## Cuándo usar este skill

Actívate cuando la tarea esté dentro de la carpeta `tiburones/` o mencione alguno de estos términos: tiburones, Guillermo, landing, blog-tiburones, portada del libro.



\## Proyecto

Web para el libro \*\*"Identificación de Tiburones"\*\* de Guillermo Carranza Hidalgo.

\- Instagram: @identificaciondetiburones

\- Libro: 8 órdenes, 35 familias, 103 géneros, 518 especies



\## Estado actual

\- `tiburones-landing.html` — landing page completa ✅

\- `blog-tiburones.html` — página de blog completa ✅

\- Pendiente: migrar a Next.js + Notion API como CMS



\## Stack

HTML + CSS + JS vanilla. Todo en un solo archivo por página. Sin frameworks, sin bundlers, sin npm.



\## Imágenes disponibles

```

img1.jpeg  — ilustración aleta suelta (arte base)

img2.jpeg  — mockup libro 3D (portada en perspectiva)

img3.jpeg  — logo circular con la aleta

img4.jpeg  — logo sobre fondo tiburones martillo

img5.jpeg  — sticker @identificaciondetiburones

img6.jpeg  — portada plana del libro (referencia colores)

```



\## Sistema de diseño



\### Paleta CSS

```css

:root {

&#x20; --ocean-deep:   #131e27;   /\* fondo principal, nav, footer \*/

&#x20; --ocean-mid:    #1e3040;   /\* fondos secundarios oscuros \*/

&#x20; --ocean-light:  #2a4558;   /\* sección stats \*/

&#x20; --cream:        #dce6ea;   /\* texto sobre oscuro \*/

&#x20; --cream-light:  #edf3f5;   /\* títulos principales \*/

&#x20; --accent:       #8faab8;   /\* acentos secundarios \*/

&#x20; --slate:        #b8cdd6;   /\* acentos primarios, labels \*/

&#x20; --wave-line:    #c8dde5;   /\* líneas de olas, números hero \*/

&#x20; --white:        #ffffff;   /\* sección "El libro" \*/

&#x20; --off-white:    #f7fafb;   /\* fondo blog \*/

&#x20; --text-dark:    #131e27;

&#x20; --text-mid:     #2a4558;

&#x20; --text-muted:   #6a8fa0;

}

```



\### Tipografía

```html

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700\&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400\&family=DM+Mono:wght@400\&display=swap" rel="stylesheet" />

```

\- \*\*Playfair Display 700/900\*\* — títulos H1, H2, números destacados

\- \*\*Crimson Pro 300/400\*\* — cuerpo de texto, nav links

\- \*\*DM Mono 400\*\* — etiquetas, categorías, datos, botones, monospace UI



\### Componentes clave



\*\*Botón primario:\*\*

```css

background: var(--slate); color: var(--ocean-deep);

border: 1px solid var(--slate); border-radius: 2px;

font-family: DM Mono; font-size: 0.75rem; letter-spacing: 0.2em;

padding: 1rem 2.5rem;

```



\*\*Botón secundario:\*\*

```css

background: transparent; color: var(--cream);

border: 1px solid rgba(220,230,234,0.25);

```



\*\*Nav:\*\*

```css

position: fixed; background: rgba(19,30,39,0.97);

backdrop-filter: blur(8px);

border-bottom: 1px solid rgba(184,205,214,0.08);

```



\*\*Post tag/label:\*\*

```css

font-family: DM Mono; font-size: 0.58-0.65rem;

letter-spacing: 0.2-0.3em; text-transform: uppercase;

color: var(--text-muted);

```



\## Hero SVG — olas estilo woodblock japonés



\### Colores de olas (de atrás hacia adelante)

```

Layer 1 (fondo):   #1e3d50  stroke: #c8dde5 op:0.35

Layer 2:           #244e62  stroke: #c8dde5 op:0.40

Layer 3:           #28556a  stroke: #c8dde5 op:0.45

Layer 4:           #2c5e73  stroke: #c8dde5 op:0.50

Layer 5:           #2f6678  stroke: #c8dde5 op:0.55

Layer 6:           #326e80  stroke: #d4e8ee op:0.65

Layer 7 (frente):  #1e3040  stroke: #d4e8ee op:0.70

```



\### Animaciones olas

```css

.wave-anim  { animation: waveShift 10s ease-in-out infinite alternate; }

.wave-anim2 { animation: waveShift 14s ease-in-out infinite alternate-reverse; }

@keyframes waveShift {

&#x20; 0%   { transform: translateX(0); }

&#x20; 100% { transform: translateX(-2%); }

}

```



\### Aleta tiburón

\- Dibujada como `<g id="shark-fin">` dentro del SVG del hero

\- Posicionada entre layer 3 y layer 4 de olas (base tapada por layer 4+)

\- Transform actual: `translate(660, 450)` en viewBox 1440x900

\- Animación: `finSway` 5s, 6px movimiento vertical

\- Gradiente: `#5a7080` → `#3e5464` → `#253545`



\### Cielo (hero background)

```css

/\* Gradiente SVG \*/

\#111b24 → #1c3244 → #2a4f62

```



\### Nubes

Elipses SVG con fill `#d8e8ed` / `#ddedf2`, opacity 0.10-0.18, blur suave. Animadas con `cloudDrift`.



\## Sección "El libro"

\- Fondo: `#ffffff` (blanco puro para que img2.jpeg no tenga corte)

\- Grid: `1.2fr 1fr` (libro izquierda, texto derecha)

\- Imagen: `img2.jpeg` sin box-shadow ni border-radius, sin blend-mode

\- Texto oscuro sobre blanco: `var(--text-dark)`, `var(--text-mid)`



\## Nav links (orden)

```html

El Libro → #libro

Contenido → #contenido  

Artículos → blog-tiburones.html

Autor → #autor

Adquirir → #adquirir

```



\## Footer

```html

Logo (img3.jpeg circular 28px) + "Identificación de Tiburones"

Instagram SVG icon + @identificaciondetiburones → instagram.com/identificaciondetiburones

© 2025 Guillermo Carranza Hidalgo

```



\## Errores conocidos y soluciones

\- \*\*Imagen img2 con fondo visible:\*\* Usar `background: #ffffff` en la sección, sin blend-mode

\- \*\*Aleta flotando en el aire:\*\* Debe dibujarse ANTES de las olas del primer plano en el SVG (entre layer 3 y 4)

\- \*\*Aleta con imagen embebida `<image>`:\*\* NO usar. Siempre path SVG

\- \*\*Colores dorados/cremas cálidas:\*\* Esta paleta NO usa dorado. Todo grises fríos y azul pizarra



\## Pendiente (no implementar aún)

\- Migración a Next.js

\- Notion API como CMS para el blog

\- Dominio propio (pendiente que el cliente lo compre)

\- Página de post individual

