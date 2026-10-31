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
const productGallery = document.querySelector("#product-gallery");
const galleryTitle = document.querySelector("#product-gallery-title");
const galleryImage = document.querySelector("#product-gallery-image");
const galleryPlaceholder = document.querySelector("#product-gallery-placeholder");
const galleryThumbnails = document.querySelector("#product-gallery-thumbnails");
const galleryClose = document.querySelector("#product-gallery-close");
const priceFormatter = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 0,
});

let activeCategory = null;
let searchQuery = "";
let galleryOpener = null;

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

const getProductImageUrls = (image) => {
  const imageValues = Array.isArray(image) ? image : [image];
  const baseUrl =
    typeof IMAGE_BASE_URL === "string"
      ? IMAGE_BASE_URL.trim().replace(/\/+$/, "")
      : "";
  const seenUrls = new Set();
  return imageValues.flatMap((value) => {
    if (typeof value !== "string") {
      return [];
    }

    const trimmedValue = value.trim();
    let url = "";
    if (/^https?:\/\//i.test(trimmedValue)) {
      try {
        const parsedUrl = new URL(trimmedValue);
        if (!/^https?:$/.test(parsedUrl.protocol)) {
          return [];
        }
        url = trimmedValue;
      } catch {
        return [];
      }
    } else {
      const isValidFilename =
        trimmedValue &&
        trimmedValue !== "." &&
        trimmedValue !== ".." &&
        !/[\u0000-\u001f\u007f\\/?#]/.test(trimmedValue);
      if (!baseUrl || !isValidFilename) {
        return [];
      }

      url = `${baseUrl}/${trimmedValue}`;
      try {
        if (!/^https?:$/.test(new URL(url).protocol)) {
          return [];
        }
      } catch {
        return [];
      }
    }

    if (seenUrls.has(url)) {
      return [];
    }
    seenUrls.add(url);
    return [url];
  });
};

const setGalleryPhoto = (url, alt) => {
  if (!galleryImage || !galleryPlaceholder) {
    return;
  }

  galleryImage.src = url;
  galleryImage.alt = alt;
  galleryImage.classList.remove("is-hidden");
  galleryPlaceholder.classList.add("is-hidden");
};

const openProductGallery = (product, opener) => {
  if (
    !productGallery ||
    !galleryTitle ||
    !galleryImage ||
    !galleryPlaceholder ||
    !galleryThumbnails
  ) {
    return;
  }

  const images = getProductImageUrls(product.image);
  const cover = images[0];

  galleryOpener = opener;
  galleryTitle.textContent = product.name;
  galleryPlaceholder.setAttribute(
    "aria-label",
    `Imagen de ${product.name} próximamente`,
  );
  galleryThumbnails.innerHTML =
    images.length > 1
      ? images
          .map(
            (url, position) => `
              <button
                class="product-gallery__thumbnail"
                type="button"
                data-gallery-url="${url}"
                data-gallery-alt="${product.name} en color ${product.color}, foto ${position + 1} de ${images.length}"
                aria-label="Ver foto ${position + 1} de ${images.length} de ${product.name}"
                aria-pressed="${position === 0}"
              >
                <img src="${url}" alt="" loading="lazy">
              </button>
            `,
          )
          .join("")
      : "";
  galleryThumbnails.classList.toggle("is-hidden", images.length <= 1);
  if (cover) {
    setGalleryPhoto(cover, `${product.name} en color ${product.color}`);
  } else {
    galleryImage.removeAttribute("src");
    galleryImage.alt = "";
    galleryImage.classList.add("is-hidden");
    galleryPlaceholder.classList.remove("is-hidden");
  }
  document.body.classList.add("has-open-dialog");
  productGallery.showModal();
};

productGrid?.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (
      !(image instanceof HTMLImageElement) ||
      !image.classList.contains("product-card__image")
    ) {
      return;
    }

    image.classList.add("is-hidden");
    image.nextElementSibling?.classList.remove("is-hidden");
  },
  true,
);

productGrid?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || target.closest(".product-card__whatsapp")) {
    return;
  }

  const opener = target.closest("[data-gallery-product-id]");
  if (!(opener instanceof HTMLButtonElement)) {
    return;
  }

  const product = products.find(
    (item) => item.id === opener.dataset.galleryProductId,
  );
  if (product) {
    openProductGallery(product, opener);
  }
});

galleryThumbnails?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const thumbnail = target.closest(".product-gallery__thumbnail");
  if (!(thumbnail instanceof HTMLButtonElement)) {
    return;
  }

  const url = thumbnail.dataset.galleryUrl;
  const alt = thumbnail.dataset.galleryAlt;
  if (!url || !alt) {
    return;
  }

  setGalleryPhoto(url, alt);
  galleryThumbnails.querySelectorAll(".product-gallery__thumbnail").forEach((item) => {
    item.setAttribute("aria-pressed", String(item === thumbnail));
  });
});

galleryClose?.addEventListener("click", () => {
  productGallery?.close();
});

productGallery?.addEventListener("click", (event) => {
  if (event.target === productGallery) {
    productGallery.close();
  }
});

productGallery?.addEventListener("close", () => {
  document.body.classList.remove("has-open-dialog");
  galleryOpener?.focus();
  galleryOpener = null;
});

productGallery?.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) {
      return;
    }

    if (image === galleryImage) {
      galleryImage.classList.add("is-hidden");
      galleryPlaceholder?.classList.remove("is-hidden");
      return;
    }

    const thumbnail = image.closest(".product-gallery__thumbnail");
    if (thumbnail) {
      thumbnail.classList.add("is-hidden");
      if (thumbnail.getAttribute("aria-pressed") === "true") {
        thumbnail.setAttribute("aria-pressed", "false");
        const nextThumbnail = [...galleryThumbnails.children].find(
          (item) => !item.classList.contains("is-hidden"),
        );
        if (nextThumbnail instanceof HTMLButtonElement) {
          nextThumbnail.setAttribute("aria-pressed", "true");
          setGalleryPhoto(
            nextThumbnail.dataset.galleryUrl,
            nextThumbnail.dataset.galleryAlt,
          );
        }
      }
    }
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
      const images = getProductImageUrls(product.image);
      const cover = images[0];
      const coverAlt = `${product.name} en color ${product.color}`;
      const visual = cover
        ? `
          <img class="product-card__visual product-card__image" src="${cover}" alt="${coverAlt}" loading="lazy">
          <span class="product-card__visual product-card__placeholder is-hidden" role="img" aria-label="Imagen de ${product.name} próximamente"></span>
        `
        : `<span class="product-card__visual product-card__placeholder" role="img" aria-label="Imagen de ${product.name} próximamente"></span>`;
      const photoCount =
        images.length > 1
          ? `<span class="product-card__photo-count">${images.length} fotos</span>`
          : "";
      const message = `Hola, me interesa el producto ${product.name} (${product.width} x ${product.height} x ${product.depth} cm). ¿Está disponible?`;
      const whatsappUrl = createWhatsAppUrl(message);

      return `
        <article class="product-card">
          <div class="product-card__cover">
            <button
              class="product-card__gallery-trigger"
              type="button"
              data-gallery-product-id="${product.id}"
              aria-label="Ver fotos de ${product.name}"
            >${visual}</button>
            ${photoCount}
          </div>
          <div class="product-card__content">
            <p class="product-card__category">${product.category}</p>
            <h2 class="product-card__name">
              <button
                class="product-card__name-trigger"
                type="button"
                data-gallery-product-id="${product.id}"
                aria-label="Ver fotos de ${product.name}"
              >${product.name}</button>
            </h2>
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
