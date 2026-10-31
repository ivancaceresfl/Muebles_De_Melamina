const IMAGE_BASE_URL = "";
const WHATSAPP_NUMBER = "59177442225";
// Keep this key in sync with the inline theme initializer in index.html.
const THEME_STORAGE_KEY = "muebles-theme";

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
    image: "https://res.cloudinary.com/pbfuzqch/image/upload/v1793444411/Closet.jpg",
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
    image: "https://res.cloudinary.com/pbfuzqch/image/upload/v1793444411/comoda.jpg",
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
    image: "https://res.cloudinary.com/pbfuzqch/image/upload/v1793444411/Escritorio.jpg",
  },
  {
    id: "Cocina",
    name: "Cocina luces led",
    category: "Cocinas",
    width: 120,
    height: 75,
    depth: 55,
    color: "Gris y roble",
    price: 1200,
    image: ["https://res.cloudinary.com/pbfuzqch/image/upload/v1793444122/Cocina.jpg",
            "https://res.cloudinary.com/pbfuzqch/image/upload/v1793444411/Especiero.jpg",
            "https://res.cloudinary.com/pbfuzqch/image/upload/v1793444411/Isla.jpg"
    ]
  },
];

const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const catalogSearch = document.querySelector("#catalog-search");
const currentYear = document.querySelector("#current-year");
const contactWhatsapp = document.querySelector("#contact-whatsapp");
const themeToggle = document.querySelector("#theme-toggle");
const priceFormatter = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 0,
});

let activeCategory = null;
let searchQuery = "";

const setTheme = (theme) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      `Cambiar a tema ${isDark ? "claro" : "oscuro"}`,
    );
    themeToggle.textContent = `Tema ${isDark ? "claro" : "oscuro"}`;
  }
};

setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.warn("No se pudo guardar la preferencia de tema.", error);
  }
});

const normalizeCategory = (category) =>
  typeof category === "string"
    ? category
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";

const createWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const getProductImageUrl = (image) => {
  const coverImage = Array.isArray(image) ? image[0] : image;
  if (typeof coverImage !== "string") {
    return "";
  }

  const trimmedImage = coverImage.trim();
  if (/^https?:\/\//i.test(trimmedImage)) {
    return trimmedImage;
  }

  const baseUrl =
    typeof IMAGE_BASE_URL === "string"
      ? IMAGE_BASE_URL.trim().replace(/\/+$/, "")
      : "";
  const isValidFilename =
    trimmedImage &&
    trimmedImage !== "." &&
    trimmedImage !== ".." &&
    !/[\u0000-\u001f\u007f\\/?#]/.test(trimmedImage);

  return baseUrl && isValidFilename ? `${baseUrl}/${trimmedImage}` : "";
};

productGrid?.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (
      !(image instanceof HTMLImageElement) ||
      !image.classList.contains("product-card__visual")
    ) {
      return;
    }

    const productName = image
      .closest(".product-card")
      ?.querySelector(".product-card__name")
      ?.textContent?.trim();
    if (!productName) {
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "product-card__visual product-card__placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute(
      "aria-label",
      `Imagen de ${productName} próximamente`,
    );
    image.replaceWith(placeholder);
  },
  true,
);

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
      const imageUrl = getProductImageUrl(product.image);
      const visual = imageUrl
        ? `<img class="product-card__visual" src="${imageUrl}" alt="${product.name} en color ${product.color}" loading="lazy">`
        : `<div class="product-card__visual product-card__placeholder" role="img" aria-label="Imagen de ${product.name} próximamente"></div>`;
      const message = `Hola, me interesa el producto ${product.name} (${product.width} x ${product.height} x ${product.depth} cm). ¿Está disponible?`;
      const whatsappUrl = createWhatsAppUrl(message);

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
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory || normalizeCategory(product.category) === activeCategory;
    const matchesSearch =
      !searchQuery || normalizeCategory(product.name).includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  renderCategoryFilters();
  renderProducts(filteredProducts);
};

catalogSearch?.addEventListener("input", (event) => {
  searchQuery = normalizeCategory(event.target.value);
  renderCatalog();
});

categoryFilters?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  activeCategory = target.dataset.category || null;
  renderCatalog();
});

renderCatalog();

if (contactWhatsapp) {
  contactWhatsapp.href = createWhatsAppUrl("Hola, quisiera información sobre sus muebles.");
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
