import { useCallback, useEffect, useMemo, useState } from "react";
import { categories as catalogCategories, products as catalogProducts } from "../data";
import useRecentSearches from "./useRecentSearches";

const DEFAULT_DEBOUNCE_MS = 220;
const DEFAULT_LIMITS = {
  brands: 4,
  categories: 4,
  products: 6,
};

const DEFAULT_TRENDING_SEARCHES = [
  "RTX 4070",
  "ASUS ROG laptop",
  "tai nghe wireless",
  "bàn phím cơ",
  "PC Gaming",
  "chuột esports",
  "iPhone 15",
  "Logitech G",
];

const PRODUCT_FIELD_WEIGHTS = {
  name: { exact: 120, startsWith: 96, includes: 72, token: 42 },
  brand: { exact: 92, startsWith: 78, includes: 58, token: 32 },
  category: { exact: 86, startsWith: 72, includes: 54, token: 30 },
  tags: { exact: 68, startsWith: 56, includes: 42, token: 24 },
  slug: { exact: 48, startsWith: 38, includes: 28, token: 16 },
};

export function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSlug(value) {
  return normalizeSearchValue(value).replace(/\s+/g, "-");
}

function getQueryTokens(normalizedQuery) {
  return normalizedQuery.split(/[\s-]+/).filter((token) => token.length > 1);
}

function getFieldScore(value, normalizedQuery, weights) {
  const normalizedValue = normalizeSearchValue(value);

  if (!normalizedValue || !normalizedQuery) {
    return 0;
  }

  if (normalizedValue === normalizedQuery) {
    return weights.exact;
  }

  if (normalizedValue.startsWith(normalizedQuery)) {
    return weights.startsWith;
  }

  if (normalizedValue.includes(normalizedQuery)) {
    return weights.includes;
  }

  const queryTokens = getQueryTokens(normalizedQuery);

  if (!queryTokens.length) {
    return 0;
  }

  const matchedTokens = queryTokens.filter((token) => normalizedValue.includes(token));

  return matchedTokens.length ? Math.round((matchedTokens.length / queryTokens.length) * weights.token) : 0;
}

function getMatchedEntityScore(entity, normalizedQuery) {
  const nameScore = getFieldScore(entity.name, normalizedQuery, {
    exact: 110,
    startsWith: 88,
    includes: 64,
    token: 42,
  });
  const slugScore = getFieldScore(entity.slug, normalizedQuery, {
    exact: 88,
    startsWith: 70,
    includes: 48,
    token: 30,
  });

  return Math.max(nameScore, slugScore);
}

function getDetectedEntities(entities, normalizedQuery) {
  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = getQueryTokens(normalizedQuery);

  return entities
    .map((entity) => {
      const normalizedName = normalizeSearchValue(entity.name);
      const normalizedSlug = normalizeSearchValue(entity.slug || entity.name);
      const isContained =
        normalizedQuery.includes(normalizedName) ||
        normalizedQuery.includes(normalizedSlug) ||
        queryTokens.includes(normalizedName) ||
        queryTokens.includes(normalizedSlug);

      return {
        ...entity,
        detectionScore: isContained ? 100 : getMatchedEntityScore(entity, normalizedQuery),
      };
    })
    .filter((entity) => entity.detectionScore >= 70)
    .sort((a, b) => b.detectionScore - a.detectionScore);
}

function createBrandOptions(products) {
  const brandMap = products.reduce((map, product) => {
    const brand = product.brand || "ElectronicsManagement";
    const current = map.get(brand) || {
      count: 0,
      name: brand,
      sold: 0,
    };

    current.count += 1;
    current.sold += Number(product.sold) || 0;
    map.set(brand, current);

    return map;
  }, new Map());

  return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getTopBrandsInCategory(products, categoryName) {
  const categoryKey = normalizeSearchValue(categoryName);
  const brands = createBrandOptions(products.filter((product) => normalizeSearchValue(product.category) === categoryKey));

  return brands
    .sort((a, b) => b.count - a.count || b.sold - a.sold)
    .slice(0, 3)
    .map((brand) => brand.name);
}

function buildProductsHref({ brand, category, query } = {}) {
  const params = new URLSearchParams();
  const trimmedQuery = String(query || "").trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (category) {
    params.set("category", category);
  }

  if (brand) {
    params.set("brand", brand);
  }

  const queryString = params.toString();

  return queryString ? `/products?${queryString}` : "/products";
}

function getProductSearchScore(product, normalizedQuery, detectedContext) {
  const nameScore = getFieldScore(product.name, normalizedQuery, PRODUCT_FIELD_WEIGHTS.name);
  const brandScore = getFieldScore(product.brand, normalizedQuery, PRODUCT_FIELD_WEIGHTS.brand);
  const categoryScore = getFieldScore(product.category, normalizedQuery, PRODUCT_FIELD_WEIGHTS.category);
  const tagScore = getFieldScore((product.tags || []).join(" "), normalizedQuery, PRODUCT_FIELD_WEIGHTS.tags);
  const slugScore = getFieldScore(product.slug, normalizedQuery, PRODUCT_FIELD_WEIGHTS.slug);
  const productCategorySlug = normalizeSlug(product.category);
  const productBrandKey = normalizeSearchValue(product.brand);
  const categoryContextBoost = detectedContext.categorySlugs.has(productCategorySlug) ? 36 : 0;
  const brandContextBoost = detectedContext.brandNames.has(productBrandKey) ? 34 : 0;
  const stockBoost = Number(product.stock) > 0 ? 8 : -10;
  const salesBoost = Math.min((Number(product.sold) || 0) / 40, 18);
  const ratingBoost = Math.min((Number(product.rating) || 0) * 4, 20);
  const matchScore = Math.max(nameScore, brandScore, categoryScore, tagScore, slugScore);

  if (!matchScore && !categoryContextBoost && !brandContextBoost) {
    return 0;
  }

  return Math.round(matchScore + categoryContextBoost + brandContextBoost + stockBoost + salesBoost + ratingBoost);
}

function getProductMatchLabels(product, detectedContext) {
  const labels = [];
  const productCategorySlug = normalizeSlug(product.category);
  const productBrandKey = normalizeSearchValue(product.brand);

  if (detectedContext.brandNames.has(productBrandKey)) {
    labels.push(product.brand);
  }

  if (detectedContext.categorySlugs.has(productCategorySlug)) {
    labels.push(product.category);
  }

  return labels.slice(0, 2);
}

function getTrendingSearches(products, providedTrendingSearches) {
  const popularBrands = createBrandOptions(products)
    .sort((a, b) => b.sold - a.sold || b.count - a.count)
    .slice(0, 2)
    .map((brand) => brand.name);
  const popularProductTerms = [...products]
    .sort((a, b) => (Number(b.sold) || 0) - (Number(a.sold) || 0))
    .slice(0, 2)
    .flatMap((product) => [product.category, product.tags?.[0]])
    .filter(Boolean);

  return Array.from(new Set([...providedTrendingSearches, ...popularBrands, ...popularProductTerms])).slice(0, 10);
}

function useSearch({
  categories = catalogCategories,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  limits = DEFAULT_LIMITS,
  minQueryLength = 1,
  products = catalogProducts,
  recentSearchesOptions,
  trendingSearches = DEFAULT_TRENDING_SEARCHES,
} = {}) {
  const [query, setQueryValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    addRecentSearch,
    clearRecentSearches,
    recentSearches,
    removeRecentSearch,
  } = useRecentSearches(recentSearchesOptions);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedQuery(query.replace(/\s+/g, " ").trim());
      setActiveIndex(0);
    }, debounceMs);

    return () => window.clearTimeout(debounceTimer);
  }, [debounceMs, query]);

  const setQuery = useCallback((nextQuery) => {
    setQueryValue(nextQuery);
    if (!String(nextQuery || "").trim()) {
      setDebouncedQuery("");
    }
    setActiveIndex(0);
  }, []);

  const searchableCategories = useMemo(
    () =>
      categories
        .filter((category) => category.slug !== "tat-ca")
        .map((category) => ({
          ...category,
          slug: category.slug || normalizeSlug(category.name),
        })),
    [categories],
  );
  const searchableBrands = useMemo(() => createBrandOptions(products), [products]);
  const normalizedQuery = normalizeSearchValue(debouncedQuery);
  const rawNormalizedQuery = normalizeSearchValue(query);
  const hasQuery = normalizedQuery.length >= minQueryLength;
  const isDebouncing = rawNormalizedQuery !== normalizedQuery;
  const isLoading = rawNormalizedQuery.length >= minQueryLength && isDebouncing;

  const detectedCategories = useMemo(
    () => getDetectedEntities(searchableCategories, normalizedQuery),
    [normalizedQuery, searchableCategories],
  );
  const detectedBrands = useMemo(
    () => getDetectedEntities(searchableBrands, normalizedQuery),
    [normalizedQuery, searchableBrands],
  );
  const detectedContext = useMemo(
    () => ({
      brandNames: new Set(detectedBrands.map((brand) => normalizeSearchValue(brand.name))),
      categorySlugs: new Set(detectedCategories.map((category) => normalizeSlug(category.slug || category.name))),
    }),
    [detectedBrands, detectedCategories],
  );

  const productResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return products
      .map((product) => {
        const matchScore = getProductSearchScore(product, normalizedQuery, detectedContext);

        return {
          ...product,
          href: `/products/${product.slug}`,
          highlightQuery: debouncedQuery,
          matchLabels: getProductMatchLabels(product, detectedContext),
          matchScore,
          resultId: `product-${product.id}`,
          resultType: "product",
        };
      })
      .filter((product) => product.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limits.products ?? DEFAULT_LIMITS.products);
  }, [debouncedQuery, detectedContext, hasQuery, limits.products, normalizedQuery, products]);

  const categoryResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return searchableCategories
      .map((category) => {
        const matchScore = getMatchedEntityScore(category, normalizedQuery);
        const productsInCategory = products.filter(
          (product) => normalizeSlug(product.category) === normalizeSlug(category.name),
        );
        const topBrands = getTopBrandsInCategory(products, category.name);

        return {
          ...category,
          count: productsInCategory.length,
          highlightQuery: debouncedQuery,
          href: buildProductsHref({ category: category.slug, query: debouncedQuery }),
          matchScore,
          meta: topBrands.length ? topBrands.join(" · ") : "Danh mục sản phẩm",
          resultId: `category-${category.id}`,
          resultType: "category",
        };
      })
      .filter((category) => category.matchScore > 0 || detectedContext.categorySlugs.has(normalizeSlug(category.slug)))
      .sort((a, b) => b.matchScore - a.matchScore || b.count - a.count)
      .slice(0, limits.categories ?? DEFAULT_LIMITS.categories);
  }, [
    debouncedQuery,
    detectedContext.categorySlugs,
    hasQuery,
    limits.categories,
    normalizedQuery,
    products,
    searchableCategories,
  ]);

  const brandResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return searchableBrands
      .map((brand) => ({
        ...brand,
        highlightQuery: debouncedQuery,
        href: buildProductsHref({ brand: brand.name, query: debouncedQuery }),
        matchScore: getMatchedEntityScore(brand, normalizedQuery),
        meta: "Thương hiệu trong catalog",
        resultId: `brand-${normalizeSlug(brand.name)}`,
        resultType: "brand",
      }))
      .filter((brand) => brand.matchScore > 0 || detectedContext.brandNames.has(normalizeSearchValue(brand.name)))
      .sort((a, b) => b.matchScore - a.matchScore || b.count - a.count || b.sold - a.sold)
      .slice(0, limits.brands ?? DEFAULT_LIMITS.brands);
  }, [debouncedQuery, detectedContext.brandNames, hasQuery, limits.brands, normalizedQuery, searchableBrands]);

  const flattenedResults = useMemo(
    () => [...productResults, ...categoryResults, ...brandResults],
    [brandResults, categoryResults, productResults],
  );
  const resolvedActiveIndex = flattenedResults.length
    ? Math.min(Math.max(activeIndex, 0), flattenedResults.length - 1)
    : -1;

  const selectNext = useCallback(() => {
    if (!flattenedResults.length) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex + 1 + flattenedResults.length) % flattenedResults.length);
  }, [flattenedResults.length]);

  const selectPrevious = useCallback(() => {
    if (!flattenedResults.length) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex - 1 + flattenedResults.length) % flattenedResults.length);
  }, [flattenedResults.length]);

  const createSearchHref = useCallback(
    (nextQuery = query) => buildProductsHref({ query: String(nextQuery || "").trim() }),
    [query],
  );

  return {
    activeIndex: resolvedActiveIndex,
    activeResult: flattenedResults[resolvedActiveIndex] || null,
    addRecentSearch,
    brandResults,
    categoryResults,
    clearRecentSearches,
    createSearchHref,
    debouncedQuery,
    detectedBrands,
    detectedCategories,
    flattenedResults,
    hasQuery,
    isDebouncing,
    isLoading,
    productResults,
    query,
    recentSearches,
    removeRecentSearch,
    searchResultCount: flattenedResults.length,
    selectNext,
    selectPrevious,
    setActiveIndex,
    setQuery,
    trendingSearches: getTrendingSearches(products, trendingSearches),
  };
}

export default useSearch;
