Especificación: sitio de muebles en melamina

Qué es?
Sitio web de una carpintería/tienda de muebles en melamina. Muestra un catálogo de productos y permite contactar por WhatsApp.

Para quién?
Clientes que buscan closets, cómodas, escritorios y muebles similares, principalmente desde el celular.

Funciones actuales
1. Catálogo de productos generado desde el array products.
2. Filtro por categoría (botones generados desde los datos).
3. Botón de WhatsApp en cada tarjeta, con un mensaje prellenado que incluye el nombre y las medidas del producto.
4. Sección de contacto y ubicación.
5. Tema claro y oscuro


Mejoras pendientes (ideas a decidir, ordenadas por prioridad)
1. Imágenes desde Cloudinary, usando IMAGE_BASE_URL.
2. Búsqueda por texto en el catálogo.
3. Cotizador por medidas.

Diseño
1. Estilo elegante y minimalista en blanco y negro, con un solo color de acento.
2. Modo claro y modo oscuro, con un botón para alternar.
3. Primera visita: sigue la preferencia del sistema del usuario. Después
  se recuerda su elección.
4. Tipografía: fuentes del sistema, sin fuentes externas.
5. Todos los colores salen de variables CSS en :root.

Fuera de alcance
Pagos en línea, carrito de compras y cuentas de usuario.
Backend o base de datos: todo vive en el navegador.

Contacto
WhatsApp: 77442225

Decisiones tomadas
HTML, CSS y JavaScript puros, sin frameworks ni build.
Imágenes alojadas en Cloudflare R2, no en el repositorio.
Precios en bolivianos (Bs) y medidas en centímetros.