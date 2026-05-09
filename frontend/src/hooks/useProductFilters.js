import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, products } from "../data";

export const PRODUCTS_PER_PAGE = 9;

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
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function getSearchHaystack(product) {
  return normalizeSearchValue(
    [product.name, product.brand, product.category, product.slug, ...(product.tags || [])].join(" "),
  );
}

function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.slug !== "tat-ca"),
    [],
  );

  const categoryBySlug = useMemo(
    () => new Map(categoryOptions.map((category) => [category.slug, category])),
    [categoryOptions],
  );

  const validSortValues = useMemo(() => new Set(SORT_OPTIONS.map((option) => option.value)), []);

  const filters = useMemo(() => {
    const sort = searchParams.get("sort");
    const rating = searchParams.get("rating");
    const categorySlugs = getListParam(searchParams, "category").filter((slug) => categoryBySlug.has(slug));
    const priceRangeIds = getListParam(searchParams, "price").filter((id) =>
      PRICE_RANGES.some((range) => range.id === id),
    );

    return {
      categories: categorySlugs,
      brands: getListParam(searchParams, "brand"),
      priceRanges: priceRangeIds,
      rating: RATING_OPTIONS.some((option) => option.value === rating) ? rating : null,
      stockStatuses: getListParam(searchParams, "stock").filter((status) => STOCK_LABELS[status]),
      search: searchParams.get("q") || "",
      sort: validSortValues.has(sort) ? sort : "featured",
      page: Math.max(Number(searchParams.get("page")) || 1, 1),
    };
  }, [categoryBySlug, searchParams, validSortValues]);

  const selectedCategories = useMemo(
    () => filters.categories.map((slug) => categoryBySlug.get(slug)).filter(Boolean),
    [categoryBySlug, filters.categories],
  );

  const brandOptions = useMemo(() => {
    const brandMap = products.reduce((map, product) => {
      map.set(product.brand, (map.get(product.brand) || 0) + 1);
      return map;
    }, new Map());

    return Array.from(brandMap, ([name, count]) => ({ name, count })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };

    categoryOptions.forEach((category) => {
      counts[category.slug] = products.filter((product) => product.category === category.name).length;
    });

    return counts;
  }, [categoryOptions]);

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
      value,
      label,
      count: counts[value],
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    const selectedCategoryNames = new Set(selectedCategories.map((category) => category.name));
    const selectedPriceRanges = PRICE_RANGES.filter((range) => filters.priceRanges.includes(range.id));
    const selectedRating = Number(filters.rating);
    const normalizedQuery = normalizeSearchValue(filters.search);

    return products.filter((product) => {
      if (selectedCategoryNames.size && !selectedCategoryNames.has(product.category)) {
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
    selectedCategories,
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
      items.push({ type: "search", value: filters.search, label: `Tìm: ${filters.search}` });
    }

    selectedCategories.forEach((category) => {
      items.push({ type: "category", value: category.slug, label: category.name });
    });

    filters.brands.forEach((brand) => {
      items.push({ type: "brand", value: brand, label: brand });
    });

    PRICE_RANGES.filter((range) => filters.priceRanges.includes(range.id)).forEach((range) => {
      items.push({ type: "price", value: range.id, label: range.label });
    });

    const rating = RATING_OPTIONS.find((option) => option.value === filters.rating);
    if (rating) {
      items.push({ type: "rating", value: rating.value, label: rating.label });
    }

    filters.stockStatuses.forEach((status) => {
      items.push({ type: "stock", value: status, label: STOCK_LABELS[status] });
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

  const toggleCategory = (categorySlug) => {
    updateSearchParams((nextParams) => {
      setListParam(nextParams, "category", toggleValue(filters.categories, categorySlug));
    });
  };

  const clearCategories = () => {
    updateSearchParams((nextParams) => nextParams.delete("category"));
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

  const clearPriceRanges = () => {
    updateSearchParams((nextParams) => nextParams.delete("price"));
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
    brandOptions,
    categoryCounts,
    categoryOptions,
    clearAllFilters,
    clearCategories,
    clearPriceRanges,
    currentPage,
    filteredProducts,
    filters,
    heroProducts,
    pageCount,
    paginatedProducts,
    priceRanges: PRICE_RANGES,
    products,
    ratingOptions: RATING_OPTIONS,
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

export default useProductFilters;
