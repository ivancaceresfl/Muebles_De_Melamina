Proyecto

Sitio web de una carpintería/tienda de muebles en melamina: catálogo de productos y contacto por WhatsApp. HTML, CSS y JavaScript puros. Sin frameworks, sin npm, sin build.

Estructura
index.html: única página; enlaza css/style.css y js/main.js.
css/style.css: todos los estilos.
js/main.js: toda la lógica y los datos de productos.

Datos
- Los productos viven en un array products al inicio de js/main.js.
- Cada producto tiene: id, name, category, width, height, depth (en cm), color, price (en Bs) e image.
- `image` es solo el nombre del archivo (ej. `closet-3-puertas.webp`).
  La URL completa se arma con la constante `IMAGE_BASE_URL`, definida
  al inicio de `main.js`. Las imágenes están en Cloudflare R2, no en el repositorio.
- Si `image` está vacío o `IMAGE_BASE_URL` no está definida, mostrar un
  bloque de color como marcador de posición.
- Las imágenes llevan `alt` descriptivo y `loading="lazy"`.
- El HTML del catálogo se genera desde ese array. No escribir productos a mano en index.html.


Cómo ejecutar y probar
No hay build. Servir con la extensión Live Server de VS Code, o con python -m http.server 5500 en la raíz (http://localhost:5500).
No hay tests automáticos: al terminar cada cambio, indica qué debo probar manualmente en el navegador.


Convenciones
JavaScript moderno (const/let, funciones flecha). Un solo main.js; no usar import/export salvo que lo pida.
Código (variables, funciones) en inglés; textos visibles en español.
Precios en bolivianos (Bs) y medidas en centímetros.
CSS: clases en kebab-case, colores en variables CSS dentro de :root.
Diseño responsive, mobile-first. HTML semántico, alt en imágenes.

Límites (pregunta antes de hacerlo)
Instalar librerías o añadir scripts externos (CDN incluidos).
Renombrar, mover o borrar archivos.
Borrar código que no sea parte de la tarea.

Forma de trabajar
Para cambios que toquen más de un archivo, propón un plan breve y espera mi confirmación.
Cambios pequeños y enfocados. Al final, resume qué cambiaste y en qué archivos.
La especificación del proyecto está en `docs/spec.md`; léela antes de
proponer cambios grandes y no implementes nada que figure en "Fuera de alcance".