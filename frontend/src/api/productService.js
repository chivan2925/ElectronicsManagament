import { api } from "./client";
import {
  buildProductPayload,
  createProductDetail,
  normalizeAdminProductDetail,
  normalizeProduct,
  normalizeProductPage,
  normalizeReviewPage,
  normalizeSlug,
} from "./productMapper";
import { createResourceService } from "./resourceService";

const DEFAULT_RESOURCE_PATH = "/admin/products";
const RESOURCE_PATH = import.meta.env.VITE_PRODUCT_API_PATH || DEFAULT_RESOURCE_PATH;
const DEFAULT_CATALOG_SIZE = 48;
const ACTIVE_STATUS = "ACTIVE";
const adminProductService = createResourceService(RESOURCE_PATH);

const SORT_PARAM_MAP = {
  featured: "updatedAt,desc",
  newest: "createdAt,desc",
};

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

function getCatalogParams(params = {}) {
  const {
    keyword,
    page = 0,
    search,
    size = DEFAULT_CATALOG_SIZE,
    sort,
    status = ACTIVE_STATUS,
    ...rest
  } = params;
  const sortParam = SORT_PARAM_MAP[sort];

  return cleanParams({
    ...rest,
    keyword: keyword ?? search,
    page,
    size,
    sort: sortParam,
    status,
  });
}

export async function getAll(params = {}, config = {}) {
  const data = await adminProductService.getAll(cleanParams(params), config);
  return normalizeProductPage(data);
}

export async function getById(id, config = {}) {
  const data = await adminProductService.getById(id, config);
  return normalizeAdminProductDetail(data);
}

export async function create(payload, config = {}) {
  const data = await adminProductService.create(buildProductPayload(payload), config);
  return normalizeProduct(data);
}

export async function update(id, payload, config = {}) {
  const data = await adminProductService.update(id, buildProductPayload(payload), config);
  return normalizeProduct(data);
}

export async function remove(id, config = {}) {
  return adminProductService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeProduct(data);
}

export async function updateFeatured(id, featured, config = {}) {
  const nextFeatured = typeof featured === "boolean" ? featured : Boolean(featured?.featured);
  const data = await api.patch(`${RESOURCE_PATH}/${id}/featured`, { featured: nextFeatured }, config);

  return normalizeProduct(data);
}

export async function getCatalogProducts(params = {}, config = {}) {
  const data = await api.get(RESOURCE_PATH, {
    skipGlobalErrorHandler: true,
    ...config,
    params: getCatalogParams(params),
  });

  return normalizeProductPage(data);
}

export async function getCatalogProductById(id, config = {}) {
  const { includeReviews = false, reviewParams = {}, ...requestConfig } = config;
  const data = await api.get(`${RESOURCE_PATH}/${id}`, {
    skipGlobalErrorHandler: true,
    ...requestConfig,
  });

  if (!includeReviews) {
    return createProductDetail(data);
  }

  const reviewPage = await getCatalogProductReviews(id, reviewParams, requestConfig).catch(() => ({ items: [] }));

  return createProductDetail(data, { reviews: reviewPage.items });
}

export async function getCatalogProductReviews(id, params = {}, config = {}) {
  const data = await api.get(`${RESOURCE_PATH}/${id}/reviews`, {
    skipGlobalErrorHandler: true,
    ...config,
    params: cleanParams({
      page: 0,
      size: 5,
      ...params,
    }),
  });

  return normalizeReviewPage(data);
}

export async function getCatalogProductsWithDetails(params = {}, config = {}) {
  const page = await getCatalogProducts(params, config);
  const detailedItems = await Promise.all(
    page.items.map(async (product) => {
      try {
        const detail = await getCatalogProductById(product.apiId ?? product.id, config);
        return detail.product;
      } catch {
        return product;
      }
    }),
  );

  return {
    ...page,
    items: detailedItems,
  };
}

export async function getCatalogProductBySlug(slug, config = {}) {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  if (/^\d+$/.test(normalizedSlug)) {
    return getCatalogProductById(normalizedSlug, { includeReviews: true, ...config });
  }

  const page = await getCatalogProducts(
    {
      keyword: slug,
      size: 12,
      status: ACTIVE_STATUS,
    },
    config,
  );
  const product =
    page.items.find((item) => normalizeSlug(item.slug) === normalizedSlug) ??
    page.items.find((item) => normalizeSlug(item.name) === normalizedSlug) ??
    page.items[0];

  if (!product) {
    return null;
  }

  return getCatalogProductById(product.apiId ?? product.id, { includeReviews: true, ...config });
}

const productService = {
  ...adminProductService,
  create,
  getAll,
  getCatalogProductById,
  getCatalogProductBySlug,
  getCatalogProductReviews,
  getCatalogProducts,
  getCatalogProductsWithDetails,
  getById,
  remove,
  update,
  updateFeatured,
  updateStatus,
};

export default productService;
