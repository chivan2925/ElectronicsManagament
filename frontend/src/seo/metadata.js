import { compactCurrency } from "../utils/formatters";

export const SITE_NAME = "ElectronicsManagement";
export const SITE_BRAND = "ElectroStore";
export const DEFAULT_LOCALE = "vi_VN";
export const DEFAULT_LANGUAGE = "vi";
export const DEFAULT_TITLE = "ElectronicsManagement | Electronics & Gaming Store";
export const DEFAULT_DESCRIPTION =
  "ElectronicsManagement là cửa hàng ecommerce cho laptop, PC Gaming, điện thoại, linh kiện PC và phụ kiện gaming chính hãng.";
export const DEFAULT_OG_IMAGE =
  import.meta.env.VITE_OG_IMAGE_URL || "https://placehold.co/1200x630/07111F/FFFFFF?text=ElectronicsManagement";

const TITLE_SUFFIX = `| ${SITE_NAME}`;
const MAX_TITLE_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 158;

function stripText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  const text = stripText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function getSiteOrigin() {
  const configuredOrigin = import.meta.env.VITE_SITE_URL;

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/g, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "https://electronicsmanagement.local";
}

export function getAbsoluteUrl(path = "/") {
  if (!path) {
    return getSiteOrigin();
  }

  try {
    return new URL(path, `${getSiteOrigin()}/`).toString();
  } catch {
    return `${getSiteOrigin()}/`;
  }
}

function normalizePath(path = "/") {
  if (!path) {
    return "/";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function buildTitle(title) {
  const cleanTitle = stripText(title || DEFAULT_TITLE);

  if (!cleanTitle || cleanTitle.includes(SITE_NAME)) {
    return truncate(cleanTitle || DEFAULT_TITLE, MAX_TITLE_LENGTH + TITLE_SUFFIX.length);
  }

  return truncate(`${cleanTitle} ${TITLE_SUFFIX}`, MAX_TITLE_LENGTH + TITLE_SUFFIX.length);
}

function buildDescription(description) {
  return truncate(description || DEFAULT_DESCRIPTION, MAX_DESCRIPTION_LENGTH);
}

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: DEFAULT_OG_IMAGE,
    name: SITE_NAME,
    sameAs: [],
    url: getAbsoluteUrl("/"),
  };
}

function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    potentialAction: {
      "@type": "SearchAction",
      "query-input": "required name=search_term_string",
      target: `${getAbsoluteUrl("/products")}?q={search_term_string}`,
    },
    url: getAbsoluteUrl("/"),
  };
}

export function buildBreadcrumbSchema(items = []) {
  const normalizedItems = items.filter(Boolean);

  if (!normalizedItems.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalizedItems.map((item, index) => ({
      "@type": "ListItem",
      item: getAbsoluteUrl(item.url || "/"),
      name: stripText(item.name),
      position: index + 1,
    })),
  };
}

function buildItemListSchema(products = [], canonicalPath = "/products") {
  const items = products.slice(0, 12).map((product, index) => ({
    "@type": "ListItem",
    item: {
      "@type": "Product",
      image: getAbsoluteUrl(product.image),
      name: stripText(product.name),
      offers: product.price
        ? {
            "@type": "Offer",
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            price: product.price,
            priceCurrency: "VND",
            url: getAbsoluteUrl(`/products/${product.slug}`),
          }
        : undefined,
      url: getAbsoluteUrl(`/products/${product.slug}`),
    },
    position: index + 1,
  }));

  if (!items.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items,
    url: getAbsoluteUrl(canonicalPath),
  };
}

function buildProductSchema(product, detail) {
  if (!product) {
    return null;
  }

  const ratingValue = Number(product.rating || 0);
  const reviewCount = Number(product.reviews || 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    aggregateRating:
      ratingValue > 0 && reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue,
            reviewCount,
          }
        : undefined,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE_NAME,
    },
    category: product.category,
    description: buildDescription(detail?.description?.lead || product.description || `${product.name} tại ${SITE_NAME}.`),
    image: [getAbsoluteUrl(product.image)],
    name: stripText(product.name),
    offers: {
      "@type": "Offer",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: product.price || 0,
      priceCurrency: "VND",
      url: getAbsoluteUrl(`/products/${product.slug}`),
    },
    sku: String(product.apiId || product.id || product.slug),
    url: getAbsoluteUrl(`/products/${product.slug}`),
  };
}

function removeUndefinedValues(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedValues).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefinedValues(entryValue)]),
    );
  }

  return value;
}

export function normalizeMetadata(metadata = {}) {
  const title = buildTitle(metadata.title);
  const description = buildDescription(metadata.description);
  const canonicalPath = normalizePath(metadata.canonicalPath || metadata.path || "/");
  const canonicalUrl = metadata.canonicalUrl || getAbsoluteUrl(canonicalPath);
  const image = metadata.image ? getAbsoluteUrl(metadata.image) : DEFAULT_OG_IMAGE;

  return removeUndefinedValues({
    canonicalUrl,
    description,
    image,
    imageAlt: metadata.imageAlt || title,
    language: metadata.language || DEFAULT_LANGUAGE,
    locale: metadata.locale || DEFAULT_LOCALE,
    meta: metadata.meta || [],
    openGraph: metadata.openGraph || {},
    product: metadata.product || null,
    robots: metadata.robots || "index,follow",
    siteName: metadata.siteName || SITE_NAME,
    structuredData: metadata.structuredData || [],
    title,
    twitter: metadata.twitter || {},
    type: metadata.type || "website",
  });
}

export function buildHomeMetadata({ categories = [], products = [] } = {}) {
  const categoryItems = categories
    .filter((category) => category.slug !== "tat-ca")
    .slice(0, 10)
    .map((category, index) => ({
      "@type": "ListItem",
      item: getAbsoluteUrl(`/categories/${category.slug}`),
      name: category.name,
      position: index + 1,
    }));

  return normalizeMetadata({
    canonicalPath: "/",
    description:
      "Mua laptop gaming, PC Gaming, điện thoại, tai nghe, chuột, bàn phím, linh kiện PC và phụ kiện gaming tại ElectronicsManagement.",
    image: products[0]?.image || DEFAULT_OG_IMAGE,
    imageAlt: "ElectronicsManagement gaming electronics storefront",
    structuredData: [
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildBreadcrumbSchema([{ name: "Trang chủ", url: "/" }]),
      categoryItems.length
        ? {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: categoryItems,
            name: "Danh mục sản phẩm ElectronicsManagement",
          }
        : null,
    ].filter(Boolean),
    title: "Electronics & gaming gear chính hãng",
    type: "website",
  });
}

export function buildProductListingMetadata({
  filters = {},
  productCount = 0,
  products = [],
  selectedCategories = [],
} = {}) {
  const hasSearch = Boolean(filters.search?.trim());
  const selectedCategoryNames = selectedCategories.map((category) => category.name).filter(Boolean);
  const title = hasSearch
    ? `Tìm "${filters.search}" trong catalog`
    : selectedCategoryNames.length
      ? `Sản phẩm ${selectedCategoryNames.join(", ")}`
      : "Tất cả sản phẩm electronics & gaming";
  const description = hasSearch
    ? `Kết quả tìm kiếm "${filters.search}" trong catalog ElectronicsManagement với laptop, PC, điện thoại và gear gaming.`
    : `Khám phá ${productCount || "nhiều"} sản phẩm electronics và gaming: laptop, PC Gaming, điện thoại, tai nghe, chuột, bàn phím và phụ kiện.`;

  return normalizeMetadata({
    canonicalPath: "/products",
    description,
    image: products[0]?.image || DEFAULT_OG_IMAGE,
    structuredData: [
      buildWebsiteSchema(),
      buildBreadcrumbSchema([
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/products" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        description: buildDescription(description),
        name: stripText(title),
        url: getAbsoluteUrl("/products"),
      },
      buildItemListSchema(products, "/products"),
    ].filter(Boolean),
    title,
    type: "website",
  });
}

export function buildCategoryMetadata({ category, productCount = 0, products = [] } = {}) {
  const categoryName = category?.name || "Danh mục sản phẩm";
  const categorySlug = category?.slug || slugify(categoryName);
  const canonicalPath = categorySlug === "tat-ca" ? "/products" : `/categories/${categorySlug}`;
  const description = `Mua ${categoryName} chính hãng tại ElectronicsManagement với ${productCount || "nhiều"} lựa chọn phù hợp gaming, học tập, làm việc và giải trí.`;

  return normalizeMetadata({
    canonicalPath,
    description,
    image: products[0]?.image || DEFAULT_OG_IMAGE,
    structuredData: [
      buildWebsiteSchema(),
      buildBreadcrumbSchema([
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/products" },
        { name: categoryName, url: canonicalPath },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        about: categoryName,
        description: buildDescription(description),
        name: `Danh mục ${categoryName}`,
        url: getAbsoluteUrl(canonicalPath),
      },
      buildItemListSchema(products, canonicalPath),
    ].filter(Boolean),
    title: `Mua ${categoryName} chính hãng`,
    type: "website",
  });
}

export function buildProductDetailMetadata({ detail } = {}) {
  const product = detail?.product;

  if (!product) {
    return normalizeMetadata({
      canonicalPath: "/products",
      description: "Sản phẩm đang được tải trong catalog ElectronicsManagement.",
      robots: "noindex,follow",
      title: "Đang tải sản phẩm",
    });
  }

  const canonicalPath = `/products/${product.slug}`;
  const categorySlug = slugify(product.category);
  const priceLabel = product.price ? compactCurrency(product.price) : "giá đang cập nhật";
  const description =
    detail?.description?.lead ||
    `${product.name} thuộc danh mục ${product.category}, thương hiệu ${product.brand}, ${priceLabel} tại ElectronicsManagement.`;

  return normalizeMetadata({
    canonicalPath,
    description,
    image: product.image,
    imageAlt: product.name,
    product: {
      availability: product.stock > 0 ? "in stock" : "out of stock",
      brand: product.brand,
      category: product.category,
      currency: "VND",
      price: product.price || 0,
    },
    structuredData: [
      buildWebsiteSchema(),
      buildBreadcrumbSchema([
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/products" },
        { name: product.category, url: `/categories/${categorySlug}` },
        { name: product.name, url: canonicalPath },
      ]),
      buildProductSchema(product, detail),
    ].filter(Boolean),
    title: `${product.name} chính hãng`,
    type: "product",
  });
}

export function buildNoIndexMetadata({ canonicalPath = "/", description, title }) {
  return normalizeMetadata({
    canonicalPath,
    description: description || DEFAULT_DESCRIPTION,
    robots: "noindex,follow",
    title,
  });
}
