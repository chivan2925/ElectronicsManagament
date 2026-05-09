const DEFAULT_PRODUCT_STATUS = "ACTIVE";
const PRODUCT_PLACEHOLDER_IMAGE = "https://placehold.co/480x360/F1F5F9/64748B?text=Product+Image";

const PLACEHOLDER_TONES = {
  "PC Gaming": "0B1730",
  laptop: "0D182B",
  "bàn phím": "111827",
  "chuột": "081322",
  "ghế gaming": "101827",
  "linh kiện PC": "0D182B",
  "lót chuột": "0F172A",
  "máy bộ": "0A1324",
  "phụ kiện gaming": "081322",
  "tai nghe": "101827",
  "điện thoại": "0A1324",
};

const CATEGORY_DESCRIPTIONS = {
  "PC Gaming": "Cấu hình gaming cân bằng, linh kiện đồng bộ và sẵn sàng nâng cấp cho các tựa game mới.",
  laptop: "Màn hình đẹp, cấu hình mạnh và hệ thống tản nhiệt tối ưu cho học tập, sáng tạo nội dung và chơi game.",
  "bàn phím": "Layout gọn, switch mượt, kết nối linh hoạt và đèn RGB giúp góc setup nổi bật hơn.",
  "chuột": "Form cầm tối ưu, cảm biến chính xác và độ trễ thấp cho các trận đấu cần phản xạ nhanh.",
  "ghế gaming": "Form ngồi chắc, đệm êm và hỗ trợ tư thế tốt cho phiên chơi game hoặc làm việc dài.",
  "linh kiện PC": "Linh kiện chính hãng, hiệu năng cao và tương thích tốt cho các cấu hình PC hiện đại.",
  "lót chuột": "Bề mặt kiểm soát tốt, mép may chắc và kích thước rộng cho thao tác chuột thoải mái.",
  "máy bộ": "Máy tính đồng bộ gọn gàng, vận hành ổn định và phù hợp cho văn phòng, học tập, giải trí.",
  "phụ kiện gaming": "Phụ kiện hoàn thiện setup, tăng trải nghiệm chơi game và làm việc với thao tác tiện hơn.",
  "tai nghe": "Âm trường rõ, micro sạch và kết nối ổn định để chơi game, họp online và nghe nhạc lâu dài.",
  "điện thoại": "Thiết kế cao cấp, hiệu năng ổn định và camera sắc nét cho nhu cầu làm việc, giải trí, quay chụp hằng ngày.",
};

export function unwrapApiPayload(data) {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data.data ?? data.result ?? data.payload ?? data.body ?? data;
  }

  return data;
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  return [];
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function maybeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function toDateValue(value) {
  return value ? String(value) : new Date().toISOString();
}

export function normalizeSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function encodeImageText(value) {
  return encodeURIComponent(String(value ?? "Product").replace(/\s+/g, " ").trim());
}

export function createProductPlaceholderImage(product, width = 460, height = 360) {
  const tone = PLACEHOLDER_TONES[product?.category] ?? "0A1324";
  const label = product?.name ?? "ElectronicsManagement";

  return `https://placehold.co/${width}x${height}/${tone}/FFFFFF?text=${encodeImageText(label)}`;
}

function getPageItems(payload) {
  const data = unwrapApiPayload(payload);

  if (Array.isArray(data)) {
    return data;
  }

  if (!isPlainObject(data)) {
    return [];
  }

  return toArray(
    data.content ??
      data.items ??
      data.products ??
      data.records ??
      data.results ??
      data.list ??
      data.rows ??
      data.data,
  );
}

function getPageMeta(payload, items) {
  const data = unwrapApiPayload(payload);
  const source = isPlainObject(data) ? data : {};
  const page = source.page ?? source.pagination ?? {};
  const pageNumber = firstDefined(source.number, source.pageNumber, source.currentPage, page.number, page.page, page.currentPage, 0);
  const pageSize = firstDefined(source.size, source.pageSize, page.size, page.pageSize, items.length);
  const totalItems = firstDefined(source.totalElements, source.totalItems, source.total, page.totalElements, page.totalItems, page.total, items.length);
  const totalPages = firstDefined(source.totalPages, page.totalPages, Math.max(1, Math.ceil(toNumber(totalItems, items.length) / Math.max(toNumber(pageSize, items.length), 1))));

  return {
    page: toNumber(pageNumber, 0),
    size: toNumber(pageSize, items.length),
    totalItems: toNumber(totalItems, items.length),
    totalPages: Math.max(1, toNumber(totalPages, 1)),
  };
}

function getMediaList(raw) {
  return toArray(raw?.media ?? raw?.images ?? raw?.photos ?? raw?.productImages).sort((a, b) => {
    const primarySort = Number(Boolean(b?.isPrimary)) - Number(Boolean(a?.isPrimary));

    if (primarySort !== 0) {
      return primarySort;
    }

    return toNumber(a?.displayOrder, 0) - toNumber(b?.displayOrder, 0);
  });
}

function getMediaUrl(media) {
  return firstDefined(media?.imageUrl, media?.url, media?.secureUrl, media?.src, media?.path);
}

function getPrimaryImage(raw, productFallback = null) {
  const mediaImage = getMediaList(raw).map(getMediaUrl).find(Boolean);
  const variantImage = toArray(raw?.variants ?? raw?.productVariants)
    .map((variant) => firstDefined(variant?.primaryImageUrl, variant?.imageUrl, getMediaList(variant).map(getMediaUrl).find(Boolean)))
    .find(Boolean);

  return firstDefined(raw?.primaryImageUrl, raw?.imageUrl, raw?.thumbnailUrl, raw?.image, mediaImage, variantImage, productFallback);
}

export function parseProductSpecsText(value = "") {
  const text = String(value ?? "").trim();

  if (!text) {
    return {};
  }

  if (text.startsWith("{")) {
    const parsed = JSON.parse(text);

    if (!isPlainObject(parsed)) {
      throw new Error("Product specs must be a JSON object.");
    }

    return parsed;
  }

  return text.split(/\r?\n/).reduce((specs, line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return specs;
    }

    const separatorIndex = trimmedLine.search(/[:=]/);

    if (separatorIndex <= 0) {
      throw new Error(`Invalid specs line ${index + 1}. Use "key: value".`);
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const specValue = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || !specValue) {
      throw new Error(`Invalid specs line ${index + 1}. Use "key: value".`);
    }

    return {
      ...specs,
      [key]: specValue,
    };
  }, {});
}

export function formatProductSpecsText(value = {}) {
  if (!isPlainObject(value)) {
    return "";
  }

  return Object.entries(value)
    .map(([key, specValue]) => `${key}: ${Array.isArray(specValue) ? specValue.join(", ") : specValue}`)
    .join("\n");
}

function normalizeVariant(raw, fallbackStock = null) {
  const id = firstDefined(raw?.id, raw?.variantId, raw?.sku, raw?.slug, raw?.name);
  const name = firstDefined(raw?.name, raw?.variantName, raw?.title, raw?.color, "Phiên bản tiêu chuẩn");
  const price = toNumber(firstDefined(raw?.price, raw?.salePrice, raw?.finalPrice, raw?.basePrice), 0);
  const stock = maybeNumber(firstDefined(raw?.totalStock, raw?.stock, raw?.quantity, raw?.availableStock, raw?.inventory));
  const status = firstDefined(raw?.status, raw?.productStatus, DEFAULT_PRODUCT_STATUS);

  return {
    color: raw?.color ?? null,
    id: String(id),
    image: getPrimaryImage(raw),
    name,
    price,
    slug: firstDefined(raw?.slug, normalizeSlug(`${name}-${id}`)),
    status,
    stock: stock ?? fallbackStock ?? (String(status).toUpperCase() === DEFAULT_PRODUCT_STATUS ? 1 : 0),
  };
}

function getVariantList(raw) {
  return toArray(raw?.variants ?? raw?.productVariants ?? raw?.variantResponses).map((variant) => normalizeVariant(variant));
}

function getProductPrice(raw, variants) {
  const directPrice = maybeNumber(firstDefined(raw?.price, raw?.salePrice, raw?.finalPrice, raw?.minPrice, raw?.basePrice));

  if (directPrice !== null) {
    return directPrice;
  }

  const prices = variants.map((variant) => variant.price).filter((price) => price > 0);

  return prices.length ? Math.min(...prices) : 0;
}

function getProductOldPrice(raw, price) {
  const oldPrice = maybeNumber(firstDefined(raw?.oldPrice, raw?.compareAtPrice, raw?.listPrice, raw?.originalPrice));

  return oldPrice && oldPrice > price ? oldPrice : null;
}

function getProductStock(raw, variants) {
  const directStock = maybeNumber(firstDefined(raw?.totalStock, raw?.stock, raw?.quantity, raw?.availableStock, raw?.inventory));

  if (directStock !== null) {
    return directStock;
  }

  return variants.reduce((sum, variant) => sum + toNumber(variant.stock, 0), 0);
}

function getDiscountLabel(price, oldPrice) {
  if (!oldPrice || oldPrice <= price || price <= 0) {
    return null;
  }

  return `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
}

function getTags(raw, product) {
  const rawTags = toArray(raw?.tags ?? raw?.tagNames ?? raw?.labels).map(String);
  const specTags = isPlainObject(raw?.specsJson ?? raw?.specs)
    ? Object.values(raw?.specsJson ?? raw?.specs)
        .slice(0, 3)
        .map(String)
    : [];

  return Array.from(new Set([...rawTags, ...specTags, product.category, product.brand].filter(Boolean))).slice(0, 4);
}

export function normalizeProduct(raw = {}) {
  const data = unwrapApiPayload(raw) ?? {};
  const variants = getVariantList(data);
  const id = firstDefined(data.id, data.productId, data.code, data.slug, data.name);
  const name = firstDefined(data.name, data.productName, data.title, "Sản phẩm ElectronicsManagement");
  const category = firstDefined(data.categoryName, data.category?.name, data.category, "Sản phẩm");
  const brand = firstDefined(data.brandName, data.brand?.name, data.brand, "ElectronicsManagement");
  const price = getProductPrice(data, variants);
  const oldPrice = getProductOldPrice(data, price);
  const primaryImageUrl = getPrimaryImage(data, null);
  const product = {
    apiId: firstDefined(data.id, data.productId, id),
    brand,
    brandId: firstDefined(data.brandId, data.brand?.id, null),
    category,
    categoryId: firstDefined(data.categoryId, data.category?.id, null),
    createdAt: toDateValue(firstDefined(data.createdAt, data.created_at, data.updatedAt, data.updated_at)),
    description: firstDefined(data.description, ""),
    discount: firstDefined(data.discount, data.discountLabel, getDiscountLabel(price, oldPrice)),
    featured: Boolean(data.featured),
    id: String(id),
    image: null,
    media: getMediaList(data),
    name,
    oldPrice,
    price,
    primaryImageUrl,
    rating: toNumber(firstDefined(data.ratingStar, data.rating, data.averageRating, data.ratingAverage), 0),
    reviews: toNumber(firstDefined(data.ratingCount, data.reviews, data.reviewCount, data.totalReviews), 0),
    slug: firstDefined(data.slug, normalizeSlug(`${name}-${id}`)),
    sold: toNumber(firstDefined(data.sold, data.soldQuantity, data.totalSold), 0),
    specsJson: isPlainObject(data.specsJson ?? data.specs) ? data.specsJson ?? data.specs : {},
    specsText: formatProductSpecsText(data.specsJson ?? data.specs),
    status: firstDefined(data.status, DEFAULT_PRODUCT_STATUS),
    stock: getProductStock(data, variants),
    tags: [],
    updatedAt: toDateValue(firstDefined(data.updatedAt, data.updated_at, data.createdAt, data.created_at)),
    variants,
    warrantyMonths: toNumber(firstDefined(data.warrantyMonths, data.warranty, 0), 0),
  };

  product.image = primaryImageUrl ?? createProductPlaceholderImage(product);
  product.tags = getTags(data, product);

  return product;
}

function buildProductMedia(values = {}) {
  const imageUrl = values.thumbnailUrl?.trim() || values.primaryImageUrl?.trim() || "";
  const originalImageUrl = values.originalThumbnailUrl?.trim() || "";

  if (!imageUrl || imageUrl === originalImageUrl || imageUrl === PRODUCT_PLACEHOLDER_IMAGE) {
    return undefined;
  }

  const publicIdBase = normalizeSlug(values.slug || values.name || "product-image") || "product-image";

  return [
    {
      displayOrder: 0,
      imageUrl,
      isPrimary: true,
      publicId: `${publicIdBase}-${Date.now()}`,
    },
  ];
}

export function buildProductPayload(values = {}) {
  const media = buildProductMedia(values);
  const payload = {
    brandId: values.brandId ? Number(values.brandId) : null,
    categoryId: values.categoryId ? Number(values.categoryId) : null,
    description: values.description?.trim() || null,
    featured: Boolean(values.featured),
    name: values.name?.trim() ?? "",
    slug: values.slug?.trim() ?? "",
    specsJson: parseProductSpecsText(values.specsText),
    status: values.status || DEFAULT_PRODUCT_STATUS,
    warrantyMonths:
      values.warrantyMonths !== "" && values.warrantyMonths !== null && values.warrantyMonths !== undefined
        ? Number(values.warrantyMonths)
        : 0,
  };

  if (media) {
    payload.media = media;
  }

  return payload;
}

export function normalizeAdminProductDetail(raw = {}) {
  return normalizeProduct(raw);
}

function normalizeSpecRows(specs) {
  if (Array.isArray(specs)) {
    return specs
      .map((spec, index) => {
        if (Array.isArray(spec)) {
          return { label: String(spec[0] ?? `Thông số ${index + 1}`), value: String(spec[1] ?? "") };
        }

        if (isPlainObject(spec)) {
          return {
            label: String(firstDefined(spec.label, spec.name, spec.key, `Thông số ${index + 1}`)),
            value: String(firstDefined(spec.value, spec.description, spec.text, "")),
          };
        }

        return null;
      })
      .filter((spec) => spec?.value);
  }

  if (isPlainObject(specs)) {
    return Object.entries(specs).map(([label, value]) => ({
      label,
      value: Array.isArray(value) ? value.join(", ") : String(value),
    }));
  }

  return [];
}

function getSpecs(raw, product) {
  const specRows = normalizeSpecRows(firstDefined(raw?.specsJson, raw?.specs, raw?.specifications));

  return [
    { label: "Thương hiệu", value: product.brand },
    { label: "Danh mục", value: product.category },
    ...specRows,
    { label: "Bảo hành", value: `${toNumber(raw?.warrantyMonths, 0)} tháng` },
    { label: "Mã sản phẩm", value: product.id },
  ].filter((spec) => spec.value !== "0 tháng" || raw?.warrantyMonths);
}

function getDescription(raw, product) {
  const descriptionText = String(raw?.description ?? "").trim();
  const paragraphs = descriptionText
    ? descriptionText
        .split(/\n{2,}|(?:\r?\n)/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];
  const lead = paragraphs[0] ?? CATEGORY_DESCRIPTIONS[product.category] ?? CATEGORY_DESCRIPTIONS["phụ kiện gaming"];

  return {
    bullets: [
      `${product.brand} chính hãng, thông tin sản phẩm rõ ràng.`,
      product.stock > 0 ? "Có thể đặt mua khi còn tồn kho." : "Tạm hết hàng hoặc đang chờ cập nhật tồn kho.",
      "Bảo hành theo chính sách sản phẩm.",
    ],
    lead,
    paragraphs:
      paragraphs.length > 1
        ? paragraphs.slice(1)
        : [
            `${product.name} thuộc nhóm ${product.category}, phù hợp cho nhu cầu gaming, làm việc và giải trí hằng ngày.`,
          ],
  };
}

function getGallery(raw, product) {
  const mediaImages = getMediaList(raw).map((media, index) => ({
    id: firstDefined(media?.id, `media-${index}`),
    image: getMediaUrl(media),
    label: media?.isPrimary ? "Ảnh chính" : `Ảnh ${index + 1}`,
  }));
  const variantImages = product.variants.map((variant, index) => ({
    id: `variant-${variant.id ?? index}`,
    image: variant.image,
    label: variant.name,
  }));
  const images = [
    { id: "main", image: product.image, label: "Ảnh chính" },
    ...mediaImages,
    ...variantImages,
  ].filter((image) => image.image);

  return Array.from(new Map(images.map((image) => [image.image, image])).values());
}

function getVariantGroups(product) {
  const activeVariants = product.variants.filter((variant) => String(variant.status).toUpperCase() !== "DELETED");

  if (activeVariants.length <= 1) {
    return [];
  }

  return [
    {
      id: "variant",
      label: "Phiên bản",
      options: activeVariants.map((variant) => ({
        id: variant.id,
        label: variant.color ? `${variant.name} - ${variant.color}` : variant.name,
        priceDelta: Math.max(0, variant.price - product.price),
        stock: variant.stock,
      })),
    },
  ];
}

export function normalizeReview(raw = {}) {
  const id = firstDefined(raw.id, raw.reviewId, raw.createdAt, raw.date, raw.content, "review");
  const rating = toNumber(firstDefined(raw.ratingStar, raw.rating, raw.stars), 5);
  const createdAt = String(firstDefined(raw.createdAt, raw.created_at, raw.date, "")).slice(0, 10);

  return {
    author: firstDefined(raw.userName, raw.author, raw.customerName, raw.userId ? `Khách hàng #${raw.userId}` : "Khách hàng"),
    content: firstDefined(raw.content, raw.comment, "Khách hàng đã để lại đánh giá cho sản phẩm này."),
    date: createdAt || "Đang cập nhật",
    id: String(id),
    rating,
    title: firstDefined(raw.title, rating >= 5 ? "Rất hài lòng" : rating >= 4 ? "Trải nghiệm tốt" : "Đã đánh giá"),
    variant: firstDefined(raw.variantName, raw.variant, "Đơn hàng đã mua"),
  };
}

export function normalizeReviewPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeReview);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function getRatingBreakdown(product, reviews = []) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    const rating = Math.min(5, Math.max(1, Math.round(toNumber(review.rating, 5))));
    counts[rating] += 1;
  });

  if (!reviews.length && product.reviews > 0) {
    counts[5] = Math.round(product.reviews * 0.72);
    counts[4] = Math.round(product.reviews * 0.2);
    counts[3] = Math.max(product.reviews - counts[5] - counts[4], 0);
  }

  return [5, 4, 3, 2, 1].map((star) => ({ count: counts[star], star }));
}

export function createProductDetail(raw = {}, options = {}) {
  const data = unwrapApiPayload(raw) ?? {};
  const product = normalizeProduct(data);
  const reviews = toArray(options.reviews).map(normalizeReview);

  return {
    description: getDescription(data, product),
    gallery: getGallery(data, product),
    installment: "Trả góp từ 0% qua thẻ tín dụng hoặc công ty tài chính.",
    product,
    ratingBreakdown: getRatingBreakdown(product, reviews),
    raw: data,
    reviews,
    shippingInfo: [
      "Giao nhanh nội thành khi còn hàng tại kho gần nhất.",
      "Miễn phí giao hàng theo chính sách khuyến mãi hiện hành.",
      "Đổi trả trong 7 ngày với sản phẩm lỗi do nhà sản xuất.",
    ],
    specs: getSpecs(data, product),
    stockInfo: {
      label: product.stock <= 0 ? "Hết hàng" : product.stock <= 10 ? `Chỉ còn ${product.stock} sản phẩm` : "Còn hàng",
      status: product.stock <= 0 ? "out" : product.stock <= 10 ? "low" : "ready",
      warehouse: product.stock > 0 ? "Tồn kho đang được đồng bộ từ hệ thống" : "Tồn kho đang chờ cập nhật",
    },
    variantGroups: getVariantGroups(product),
  };
}

export function normalizeProductPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeProduct);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}
