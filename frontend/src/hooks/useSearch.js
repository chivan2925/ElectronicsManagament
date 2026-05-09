import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, products } from "../data";

const RECENT_SEARCHES_STORAGE_KEY = "electronicsManagement:recentSearches";
const MAX_RECENT_SEARCHES = 6;
const DEFAULT_TRENDING_SEARCHES = [
  "RTX 4070",
  "tai nghe wireless",
  "bàn phím cơ",
  "PC Gaming",
  "iPhone 15",
  "chuột esports",
];

function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function readRecentSearches() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const values = Array.isArray(parsedValue) ? parsedValue : parsedValue.items;

    return Array.isArray(values) ? values.filter(Boolean).slice(0, MAX_RECENT_SEARCHES) : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENT_SEARCHES_STORAGE_KEY,
    JSON.stringify({
      items: items.slice(0, MAX_RECENT_SEARCHES),
      updatedAt: new Date().toISOString(),
    }),
  );
}

function getProductScore(product, normalizedQuery) {
  const normalizedName = normalizeSearchValue(product.name);
  const normalizedBrand = normalizeSearchValue(product.brand);
  const normalizedCategory = normalizeSearchValue(product.category);
  const normalizedTags = normalizeSearchValue((product.tags || []).join(" "));

  if (normalizedName.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedBrand.startsWith(normalizedQuery)) {
    return 68;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 56;
  }

  if (normalizedBrand.includes(normalizedQuery) || normalizedCategory.includes(normalizedQuery)) {
    return 44;
  }

  if (normalizedTags.includes(normalizedQuery)) {
    return 32;
  }

  return 0;
}

const searchableCategories = categories.filter((category) => category.slug !== "tat-ca");

const searchableBrands = Array.from(
  products.reduce((brandMap, product) => {
    brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1);
    return brandMap;
  }, new Map()),
  ([name, count]) => ({
    count,
    name,
  }),
).sort((a, b) => a.name.localeCompare(b.name));

function useSearch({ debounceMs = 220 } = {}) {
  const [query, setQueryValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setActiveIndex(0);
    }, debounceMs);

    return () => window.clearTimeout(debounceTimer);
  }, [debounceMs, query]);

  const setQuery = useCallback((nextQuery) => {
    setQueryValue(nextQuery);
    setActiveIndex(0);
  }, []);

  const normalizedQuery = normalizeSearchValue(debouncedQuery);
  const hasQuery = normalizedQuery.length > 0;

  const productResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return products
      .map((product) => ({
        ...product,
        href: `/products/${product.slug}`,
        matchScore: getProductScore(product, normalizedQuery),
        resultId: `product-${product.id}`,
        resultType: "product",
      }))
      .filter((product) => product.matchScore > 0)
      .sort((a, b) => b.matchScore + b.rating * 4 + b.sold / 50 - (a.matchScore + a.rating * 4 + a.sold / 50))
      .slice(0, 5);
  }, [hasQuery, normalizedQuery]);

  const categoryResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return searchableCategories
      .filter((category) => {
        const normalizedName = normalizeSearchValue(category.name);
        const normalizedSlug = normalizeSearchValue(category.slug);

        return normalizedName.includes(normalizedQuery) || normalizedSlug.includes(normalizedQuery);
      })
      .map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.name).length,
        href: `/products?category=${category.slug}`,
        resultId: `category-${category.id}`,
        resultType: "category",
      }))
      .slice(0, 4);
  }, [hasQuery, normalizedQuery]);

  const brandResults = useMemo(() => {
    if (!hasQuery) {
      return [];
    }

    return searchableBrands
      .filter((brand) => normalizeSearchValue(brand.name).includes(normalizedQuery))
      .map((brand) => ({
        ...brand,
        href: `/products?brand=${encodeURIComponent(brand.name)}`,
        resultId: `brand-${brand.name}`,
        resultType: "brand",
      }))
      .slice(0, 4);
  }, [hasQuery, normalizedQuery]);

  const flattenedResults = useMemo(
    () => [...productResults, ...categoryResults, ...brandResults],
    [brandResults, categoryResults, productResults],
  );

  const addRecentSearch = useCallback((term) => {
    const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      return;
    }

    setRecentSearches((currentItems) => {
      const nextItems = [
        trimmedTerm,
        ...currentItems.filter((item) => normalizeSearchValue(item) !== normalizeSearchValue(trimmedTerm)),
      ].slice(0, MAX_RECENT_SEARCHES);

      writeRecentSearches(nextItems);
      return nextItems;
    });
  }, []);

  const removeRecentSearch = useCallback((term) => {
    setRecentSearches((currentItems) => {
      const nextItems = currentItems.filter((item) => normalizeSearchValue(item) !== normalizeSearchValue(term));

      writeRecentSearches(nextItems);
      return nextItems;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    writeRecentSearches([]);
  }, []);

  const selectNext = useCallback(() => {
    if (!flattenedResults.length) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex + 1) % flattenedResults.length);
  }, [flattenedResults.length]);

  const selectPrevious = useCallback(() => {
    if (!flattenedResults.length) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex - 1 + flattenedResults.length) % flattenedResults.length);
  }, [flattenedResults.length]);

  return {
    activeIndex,
    activeResult: flattenedResults[activeIndex],
    addRecentSearch,
    brandResults,
    categoryResults,
    clearRecentSearches,
    debouncedQuery,
    flattenedResults,
    hasQuery,
    isDebouncing: query.trim() !== debouncedQuery,
    productResults,
    query,
    recentSearches,
    removeRecentSearch,
    searchResultCount: flattenedResults.length,
    selectNext,
    selectPrevious,
    setActiveIndex,
    setQuery,
    trendingSearches: DEFAULT_TRENDING_SEARCHES,
  };
}

export default useSearch;
