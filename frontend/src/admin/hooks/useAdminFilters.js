import { useCallback, useMemo, useState } from "react";

function isEmptyFilterValue(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function getPathValue(item, path) {
  return String(path)
    .split(".")
    .reduce((current, key) => current?.[key], item);
}

function normalizeSearchValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(normalizeSearchValue).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(normalizeSearchValue).join(" ");
  }

  return String(value).toLowerCase();
}

function matchesQuery(item, query, searchKeys) {
  const keyword = String(query ?? "").trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  const values = searchKeys.length > 0 ? searchKeys.map((key) => getPathValue(item, key)) : Object.values(item ?? {});

  return normalizeSearchValue(values).includes(keyword);
}

function matchesFilters(item, filters, filterFns) {
  return Object.entries(filters ?? {}).every(([key, value]) => {
    if (isEmptyFilterValue(value)) {
      return true;
    }

    if (typeof filterFns?.[key] === "function") {
      return filterFns[key](item, value);
    }

    const itemValue = getPathValue(item, key);

    if (Array.isArray(value)) {
      return value.map(String).includes(String(itemValue));
    }

    return String(itemValue) === String(value);
  });
}

export function filterAdminItems(items = [], options = {}) {
  const {
    filterFns = {},
    filters = {},
    query = "",
    searchKeys = [],
  } = options;

  return items.filter((item) => matchesQuery(item, query, searchKeys) && matchesFilters(item, filters, filterFns));
}

function useAdminFilters({ filterFns = {}, initialFilters = {}, initialQuery = "", items = [], searchKeys = [] } = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState(initialQuery);

  const filteredItems = useMemo(
    () => filterAdminItems(items, { filterFns, filters, query, searchKeys }),
    [filterFns, filters, items, query, searchKeys],
  );

  const setFilter = useCallback((key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };
      delete nextFilters[key];
      return nextFilters;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setQuery(initialQuery);
  }, [initialFilters, initialQuery]);

  return {
    clearFilter,
    filteredItems,
    filters,
    query,
    resetFilters,
    setFilter,
    setFilters,
    setQuery,
  };
}

export default useAdminFilters;
