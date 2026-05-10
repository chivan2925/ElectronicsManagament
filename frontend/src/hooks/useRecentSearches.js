import { useCallback, useEffect, useState } from "react";

export const RECENT_SEARCHES_STORAGE_KEY = "electronicsManagement:recentSearches";
export const DEFAULT_MAX_RECENT_SEARCHES = 8;

export function normalizeRecentSearchTerm(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getUniqueSearches(values, maxItems) {
  const seen = new Set();
  const searches = [];

  values.forEach((value) => {
    const label = String(value || "").replace(/\s+/g, " ").trim();
    const normalizedLabel = normalizeRecentSearchTerm(label);

    if (!label || seen.has(normalizedLabel)) {
      return;
    }

    seen.add(normalizedLabel);
    searches.push(label);
  });

  return searches.slice(0, maxItems);
}

function parseStoredSearches(rawValue, maxItems) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const values = Array.isArray(parsedValue) ? parsedValue : parsedValue.items;

    return Array.isArray(values) ? getUniqueSearches(values, maxItems) : [];
  } catch {
    return [];
  }
}

function readRecentSearches(storageKey, maxItems) {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  return parseStoredSearches(storage.getItem(storageKey), maxItems);
}

function writeRecentSearches(storageKey, items, maxItems) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      storageKey,
      JSON.stringify({
        items: items.slice(0, maxItems),
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Ignore quota/private-mode write failures; search still works without persistence.
  }
}

function useRecentSearches({
  maxItems = DEFAULT_MAX_RECENT_SEARCHES,
  storageKey = RECENT_SEARCHES_STORAGE_KEY,
} = {}) {
  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches(storageKey, maxItems));

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== storageKey) {
        return;
      }

      setRecentSearches(parseStoredSearches(event.newValue, maxItems));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [maxItems, storageKey]);

  const persist = useCallback(
    (items) => {
      const nextItems = getUniqueSearches(items, maxItems);

      writeRecentSearches(storageKey, nextItems, maxItems);
      return nextItems;
    },
    [maxItems, storageKey],
  );

  const addRecentSearch = useCallback(
    (term) => {
      const label = String(term || "").replace(/\s+/g, " ").trim();

      if (!label) {
        return;
      }

      setRecentSearches((currentItems) =>
        persist([
          label,
          ...currentItems.filter((item) => normalizeRecentSearchTerm(item) !== normalizeRecentSearchTerm(label)),
        ]),
      );
    },
    [persist],
  );

  const removeRecentSearch = useCallback(
    (term) => {
      setRecentSearches((currentItems) =>
        persist(currentItems.filter((item) => normalizeRecentSearchTerm(item) !== normalizeRecentSearchTerm(term))),
      );
    },
    [persist],
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches(persist([]));
  }, [persist]);

  return {
    addRecentSearch,
    clearRecentSearches,
    recentSearches,
    removeRecentSearch,
  };
}

export default useRecentSearches;
