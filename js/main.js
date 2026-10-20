const IMAGE_BASE_URL = "";
const WHATSAPP_NUMBER = "59177442225";

const products = [
  {
    id: "closet-3-puertas",
    name: "Closet de 3 puertas",
    category: "Closets",
    width: 150,
    height: 200,
    depth: 50,
    color: "Roble claro",
    price: 1850,
    image: "closet-3-puertas.webp",
  },
  {
    id: "comoda-4-cajones",
    name: "Cómoda de 4 cajones",
    category: "Cómodas",
    width: 80,
    height: 90,
    depth: 40,
    color: "Blanco",
    price: 950,
    image: "comoda-4-cajones.webp",
  },
  {
    id: "escritorio-moderno",
    name: "Escritorio moderno",
    category: "Escritorios",
    width: 120,
    height: 75,
    depth: 55,
    color: "Gris y roble",
    price: 1200,
    image: "escritorio-moderno.webp",
  },
];

const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const currentYear = document.querySelector("#current-year");
const priceFormatter = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 0,
});

let activeCategory = null;

const normalizeCategory = (category) =>
  typeof category === "string" ? category.trim().toLocaleLowerCase("es") : "";

const renderCategoryFilters = () => {
  if (!categoryFilters) {
    return;
  }

  const categories = new Map();
  products.forEach((product) => {
    const value = normalizeCategory(product.category);
    if (value && !categories.has(value)) {
      categories.set(value, product.category.trim());
    }
  });
  const filters = [
    { value: null, label: "Todos" },
    ...[...categories].map(([value, label]) => ({
      value,
      label,
    })),
  ];

  categoryFilters.innerHTML = filters
    .map(
      ({ value, label }) => `
        <button
          class="catalog__filter"
          type="button"
          data-category="${value ?? ""}"
          aria-pressed="${activeCategory === value}"
        >${label}</button>
      `,
    )
    .join("");
};

const renderProducts = (items) => {
  if (!productGrid) {
    return;
  }

  if (items.length === 0) {
    productGrid.innerHTML =
      '<p class="catalog__empty">No hay productos disponibles en esta categoría.</p>';
    return;
  }

  productGrid.innerHTML = items
    .map((product) => {
      const imageUrl = IMAGE_BASE_URL
        ? `${IMAGE_BASE_URL.replace(/\/$/, "")}/${product.image}`
        : "";
      const visual = imageUrl
        ? `<img class="product-card__visual" src="${imageUrl}" alt="${product.name} en color ${product.color}" loading="lazy">`
        : `<div class="product-card__visual product-card__placeholder" role="img" aria-label="Imagen de ${product.name} próximamente"></div>`;
      const message = `Hola, me interesa el producto ${product.name} (${product.width} x ${product.height} x ${product.depth} cm). ¿Está disponible?`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      return `
        <article class="product-card">
          ${visual}
          <div class="product-card__content">
            <p class="product-card__category">${product.category}</p>
            <h2 class="product-card__name">${product.name}</h2>
            <div class="product-card__details">
              <p>Medidas: ${product.width} x ${product.height} x ${product.depth} cm</p>
              <p>Color: ${product.color}</p>
            </div>
            <p class="product-card__price">Bs ${priceFormatter.format(product.price)}</p>
            <a
              class="product-card__whatsapp"
              href="${whatsappUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >Consultar por WhatsApp</a>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderCatalog = () => {
  const filteredProducts = activeCategory
    ? products.filter((product) => normalizeCategory(product.category) === activeCategory)
    : products;

  renderCategoryFilters();
  renderProducts(filteredProducts);
};

categoryFilters?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  activeCategory = target.dataset.category || null;
  renderCatalog();
});

renderCatalog();

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
