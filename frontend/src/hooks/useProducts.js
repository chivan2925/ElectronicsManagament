import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../api/productService";
import { normalizeSlug } from "../api/productMapper";

export const PRODUCTS_PER_PAGE = 9;
const CATALOG_FETCH_SIZE = 72;

export const SORT_OPTIONS = [
  { value: "featured", label: "nổi bật" },
  { value: "newest", label: "mới nhất" },
  { value: "price-asc", label: "giá tăng dần" },
  { value: "price-desc", label: "giá giảm dần" },
  { value: "best-seller", label: "bán chạy" },
];

export const PRICE_RANGES = [
  { id: "under-2m", label: "Dưới 2 triệu", min: 0, max: 2_000_000 },
  { id: "2m-5m", label: "2 - 5 triệu", min: 2_000_000, max: 5_000_000 },
  { id: "5m-15m", label: "5 - 15 triệu", min: 5_000_000, max: 15_000_000 },
  { id: "15m-30m", label: "15 - 30 triệu", min: 15_000_000, max: 30_000_000 },
  { id: "over-30m", label: "Trên 30 triệu", min: 30_000_000, max: Number.POSITIVE_INFINITY },
];

export const RATING_OPTIONS = [
  { value: "4.8", label: "Từ 4.8 sao" },
  { value: "4.6", label: "Từ 4.6 sao" },
  { value: "4.4", label: "Từ 4.4 sao" },
];

export const STOCK_LABELS = {
  inStock: "Còn hàng",
  lowStock: "Sắp hết",
  outOfStock: "Hết hàng",
};

function getStockStatus(product) {
  if (product.stock <= 0) {
    return "outOfStock";
  }

  if (product.stock <= 10) {
    return "lowStock";
  }

  return "inStock";
}

function getListParam(searchParams, key) {
  return searchParams.get(key)?.split(",").filter(Boolean) || [];
}

function setListParam(nextParams, key, values) {
  const cleanedValues = Array.from(new Set(values)).filter(Boolean);

  if (cleanedValues.length) {
    nextParams.set(key, cleanedValues.join(","));
  } else {
    nextParams.delete(key);
  }
}

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getFeaturedScore(product) {
  const discountBoost = product.discount ? 48 : 0;
  const stockBoost = product.stock > 0 ? 18 : 0;

  return product.rating * 100 + product.reviews + discountBoost + stockBoost;
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchHaystack(product) {
  return normalizeSearchValue(
    [product.name, product.brand, product.category, product.slug, ...(product.tags || [])].join(" "),
  );
}

function getCategoryOptions(products) {
  const categories = products.reduce((map, product) => {
    const name = product.category || "Sản phẩm";
    const slug = normalizeSlug(name);
    const current = map.get(slug) ?? {
      id: product.categoryId ?? slug,
      name,
      slug,
    };

    map.set(slug, current);
    return map;
  }, new Map());

  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getFallbackCategory(slug) {
  const normalizedSlug = String(slug || "").trim();

  if (!normalizedSlug) {
    return null;
  }

  return {
    id: normalizedSlug,
    name: normalizedSlug
      .split("-")
      .filter(Boolean)
      .join(" "),
    slug: normalizedSlug,
  };
}

function useProducts({ routeCategorySlug = null } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [apiMeta, setApiMeta] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const validSortValues = useMemo(() => new Set(SORT_OPTIONS.map((option) => option.value)), []);

  const filters = useMemo(() => {
    const sort = searchParams.get("sort");
    const rating = searchParams.get("rating");
    const categoryParams = getListParam(searchParams, "category");
    const routeCategoryFilter = routeCategorySlug && routeCategorySlug !== "tat-ca" ? [routeCategorySlug] : [];
    const priceRangeIds = getListParam(searchParams, "price").filter((id) =>
      PRICE_RANGES.some((range) => range.id === id),
    );

    return {
      brands: getListParam(searchParams, "brand"),
      categories: routeCategoryFilter.length ? routeCategoryFilter : categoryParams,
      page: Math.max(Number(searchParams.get("page")) || 1, 1),
      priceRanges: priceRangeIds,
      rating: RATING_OPTIONS.some((option) => option.value === rating) ? rating : null,
      search: searchParams.get("q") || "",
      sort: validSortValues.has(sort) ? sort : "featured",
      stockStatuses: getListParam(searchParams, "stock").filter((status) => STOCK_LABELS[status]),
    };
  }, [routeCategorySlug, searchParams, validSortValues]);

  const loadProducts = useCallback(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null;
        }

        setIsLoading(true);
        setError(null);

        return productService.getCatalogProducts({
          keyword: filters.search || undefined,
          page: 0,
          size: CATALOG_FETCH_SIZE,
          sort: filters.sort,
          status: "ACTIVE",
        });
      })
      .then((page) => {
        if (!isActive || !page) {
          return;
        }

        setProducts(page.items);
        setApiMeta(page.meta);
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        setError(loadError);
        setProducts([]);
        setApiMeta(null);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [filters.search, filters.sort]);

  useEffect(() => loadProducts(), [loadProducts, refreshIndex]);

  const refresh = useCallback(() => {
    setRefreshIndex((current) => current + 1);
  }, []);

  const categoryOptions = useMemo(() => getCategoryOptions(products), [products]);
  const categoryBySlug = useMemo(
    () => new Map(categoryOptions.map((category) => [category.slug, category])),
    [categoryOptions],
  );
  const selectedCategories = useMemo(
    () => filters.categories.map((slug) => categoryBySlug.get(slug) ?? getFallbackCategory(slug)).filter(Boolean),
    [categoryBySlug, filters.categories],
  );

  const brandOptions = useMemo(() => {
    const brandMap = products.reduce((map, product) => {
      const brand = product.brand || "ElectronicsManagement";
      map.set(brand, (map.get(brand) || 0) + 1);
      return map;
    }, new Map());

    return Array.from(brandMap, ([name, count]) => ({ count, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = products.reduce(
      (currentCounts, product) => {
        const categorySlug = normalizeSlug(product.category);

        currentCounts[categorySlug] = (currentCounts[categorySlug] || 0) + 1;
        return currentCounts;
      },
      { all: products.length },
    );

    categoryOptions.forEach((category) => {
      counts[category.slug] = counts[category.slug] || 0;
    });

    return counts;
  }, [categoryOptions, products]);

  const stockOptions = useMemo(() => {
    const counts = products.reduce(
      (map, product) => {
        const status = getStockStatus(product);
        map[status] += 1;
        return map;
      },
      { inStock: 0, lowStock: 0, outOfStock: 0 },
    );

    return Object.entries(STOCK_LABELS).map(([value, label]) => ({
      count: counts[value],
      label,
      value,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const selectedCategorySlugs = new Set(filters.categories);
    const selectedPriceRanges = PRICE_RANGES.filter((range) => filters.priceRanges.includes(range.id));
    const selectedRating = Number(filters.rating);
    const normalizedQuery = normalizeSearchValue(filters.search);

    return products.filter((product) => {
      if (selectedCategorySlugs.size && !selectedCategorySlugs.has(normalizeSlug(product.category))) {
        return false;
      }

      if (filters.brands.length && !filters.brands.includes(product.brand)) {
        return false;
      }

      if (
        selectedPriceRanges.length &&
        !selectedPriceRanges.some((range) => product.price >= range.min && product.price <= range.max)
      ) {
        return false;
      }

      if (selectedRating && product.rating < selectedRating) {
        return false;
      }

      if (filters.stockStatuses.length && !filters.stockStatuses.includes(getStockStatus(product))) {
        return false;
      }

      if (normalizedQuery && !getSearchHaystack(product).includes(normalizedQuery)) {
        return false;
      }

      return true;
    });
  }, [
    filters.brands,
    filters.priceRanges,
    filters.rating,
    filters.search,
    filters.stockStatuses,
    filters.categories,
    products,
  ]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    if (filters.sort === "newest") {
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filters.sort === "price-asc") {
      return sorted.sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "price-desc") {
      return sorted.sort((a, b) => b.price - a.price);
    }

    if (filters.sort === "best-seller") {
      return sorted.sort((a, b) => b.sold - a.sold);
    }

    return sorted.sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a));
  }, [filteredProducts, filters.sort]);

  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(filters.page, pageCount);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const heroProducts = sortedProducts.length ? sortedProducts.slice(0, 3) : products.slice(0, 3);

  const activeFilters = useMemo(() => {
    const items = [];

    if (filters.search.trim()) {
      items.push({ label: `Tìm: ${filters.search}`, type: "search", value: filters.search });
    }

    selectedCategories.forEach((category) => {
      items.push({ label: category.name, type: "category", value: category.slug });
    });

    filters.brands.forEach((brand) => {
      items.push({ label: brand, type: "brand", value: brand });
    });

    PRICE_RANGES.filter((range) => filters.priceRanges.includes(range.id)).forEach((range) => {
      items.push({ label: range.label, type: "price", value: range.id });
    });

    const rating = RATING_OPTIONS.find((option) => option.value === filters.rating);
    if (rating) {
      items.push({ label: rating.label, type: "rating", value: rating.value });
    }

    filters.stockStatuses.forEach((status) => {
      items.push({ label: STOCK_LABELS[status], type: "stock", value: status });
    });

    return items;
  }, [
    filters.brands,
    filters.priceRanges,
    filters.rating,
    filters.search,
    filters.stockStatuses,
    selectedCategories,
  ]);

  const updateSearchParams = (updater, { resetPage = true } = {}) => {
    const nextParams = new URLSearchParams(searchParams);
    updater(nextParams);

    if (resetPage) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const clearCategories = () => {
    updateSearchParams((nextParams) => nextParams.delete("category"));
  };

  const clearPriceRanges = () => {
    updateSearchParams((nextParams) => nextParams.delete("price"));
  };

  const toggleCategory = (categorySlug) => {
    updateSearchParams((nextParams) => {
      setListParam(nextParams, "category", toggleValue(filters.categories, categorySlug));
    });
  };

  const toggleBrand = (brand) => {
    updateSearchParams((nextParams) => {
      setListParam(nextParams, "brand", toggleValue(filters.brands, brand));
    });
  };

  const togglePriceRange = (rangeId) => {
    updateSearchParams((nextParams) => {
      setListParam(nextParams, "price", toggleValue(filters.priceRanges, rangeId));
    });
  };

  const setRating = (rating) => {
    updateSearchParams((nextParams) => {
      if (rating) {
        nextParams.set("rating", rating);
      } else {
        nextParams.delete("rating");
      }
    });
  };

  const toggleStock = (stockStatus) => {
    updateSearchParams((nextParams) => {
      setListParam(nextParams, "stock", toggleValue(filters.stockStatuses, stockStatus));
    });
  };

  const setSearch = (query) => {
    updateSearchParams((nextParams) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        nextParams.set("q", trimmedQuery);
      } else {
        nextParams.delete("q");
      }
    });
  };

  const setSort = (sort) => {
    updateSearchParams((nextParams) => {
      if (sort === "featured") {
        nextParams.delete("sort");
      } else {
        nextParams.set("sort", sort);
      }
    });
  };

  const setPage = (page) => {
    updateSearchParams(
      (nextParams) => {
        if (page === 1) {
          nextParams.delete("page");
        } else {
          nextParams.set("page", String(page));
        }
      },
      { resetPage: false },
    );
  };

  const clearAllFilters = () => {
    updateSearchParams((nextParams) => {
      ["category", "brand", "price", "rating", "stock", "q", "sort", "page"].forEach((key) => nextParams.delete(key));
    });
  };

  const removeActiveFilter = (item) => {
    if (item.type === "search") {
      setSearch("");
      return;
    }

    if (item.type === "category") {
      toggleCategory(item.value);
      return;
    }

    if (item.type === "brand") {
      toggleBrand(item.value);
      return;
    }

    if (item.type === "price") {
      togglePriceRange(item.value);
      return;
    }

    if (item.type === "rating") {
      setRating(null);
      return;
    }

    toggleStock(item.value);
  };

  return {
    activeFilters,
    apiMeta,
    brandOptions,
    categoryCounts,
    categoryOptions,
    clearAllFilters,
    clearCategories,
    clearPriceRanges,
    currentPage,
    error,
    filteredProducts,
    filters,
    heroProducts,
    isLoading,
    pageCount,
    paginatedProducts,
    priceRanges: PRICE_RANGES,
    products,
    ratingOptions: RATING_OPTIONS,
    refresh,
    removeActiveFilter,
    selectedCategories,
    setPage,
    setRating,
    setSearch,
    setSort,
    sortOptions: SORT_OPTIONS,
    sortedProducts,
    stockOptions,
    toggleBrand,
    toggleCategory,
    togglePriceRange,
    toggleStock,
  };
}

export default useProducts;
