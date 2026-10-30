# Especificación: sitio de muebles en melamina

## Qué es
Sitio web de una carpintería/tienda de muebles en melamina.
Muestra un catálogo de productos y permite contactar por WhatsApp.

## Para quién
Clientes que buscan closets, cómodas, escritorios y muebles similares,
principalmente desde el celular.

## Funciones actuales
- Catálogo de productos generado desde el array `products`.
- Filtro por categoría (botones generados desde los datos).
- Categorías normalizadas y mensaje cuando no hay productos que mostrar.
- Botón de WhatsApp en cada tarjeta, con un mensaje prellenado que incluye
  el nombre y las medidas del producto.
- Búsqueda por texto, combinada con el filtro de categoría.

## Mejoras pendientes (ideas a decidir, ordenadas por prioridad)
1. Sección de contacto y ubicación.
2. Imágenes desde Cloudflare R2, usando `IMAGE_BASE_URL`.
3. Cotizador por medidas (requiere definir antes las reglas de precio).

## Fuera de alcance
- Pagos en línea, carrito de compras y cuentas de usuario.
- Backend o base de datos: todo vive en el navegador.

## Contacto
- WhatsApp: 77442225

## Decisiones tomadas
- HTML, CSS y JavaScript puros, sin frameworks ni build.
- Imágenes alojadas en Cloudflare R2, no en el repositorio.
- Precios en bolivianos (Bs) y medidas en centímetros.