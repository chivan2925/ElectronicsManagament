import { useCallback, useEffect, useMemo, useState } from "react";
import productService from "../api/productService";

export const HOMEPAGE_FEATURED_LIMIT = 6;
const HOMEPAGE_PRODUCT_FETCH_SIZE = 24;

function getDiscountPercent(product) {
  if (product.oldPrice && product.oldPrice > product.price && product.price > 0) {
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }

  const discountMatch = String(product.discount ?? "").match(/\d+/);

  return discountMatch ? Number(discountMatch[0]) : 0;
}

function getProductRecency(product) {
  return Date.parse(product.updatedAt || product.createdAt || "") || 0;
}

function getFeaturedScore(product) {
  const featuredBoost = product.featured ? 400 : 0;
  const stockBoost = product.stock > 0 ? 80 : -160;
  const discountBoost = getDiscountPercent(product) * 4;
  const ratingBoost = (Number(product.rating) || 0) * 28;
  const reviewBoost = Math.min(Number(product.reviews) || 0, 500) * 0.5;
  const soldBoost = Math.min(Number(product.sold) || 0, 500) * 0.8;
  const recencyBoost = getProductRecency(product) / 1_000_000_000;

  return featuredBoost + stockBoost + discountBoost + ratingBoost + reviewBoost + soldBoost + recencyBoost;
}

function getFlashSaleScore(product) {
  return getDiscountPercent(product) * 120 + getFeaturedScore(product);
}

function getUniqueProducts(products) {
  const productMap = new Map();

  products.filter(Boolean).forEach((product) => {
    const key = product.slug || product.apiId || product.id;

    if (key && !productMap.has(String(key))) {
      productMap.set(String(key), product);
    }
  });

  return Array.from(productMap.values());
}

function getFeaturedProducts(products, limit) {
  return getUniqueProducts(products)
    .sort((first, second) => getFeaturedScore(second) - getFeaturedScore(first))
    .slice(0, limit);
}

function getFlashSaleProduct(products, featuredProducts) {
  const candidates = getUniqueProducts(products).filter((product) => product.stock > 0);
  const discountedProduct = candidates
    .filter((product) => getDiscountPercent(product) > 0)
    .sort((first, second) => getFlashSaleScore(second) - getFlashSaleScore(first))[0];

  return discountedProduct ?? featuredProducts.find((product) => product.stock > 0) ?? candidates[0] ?? null;
}

function useHomepageProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => {
    setRefreshIndex((currentIndex) => currentIndex + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null;
        }

        setIsLoading(true);
        setError(null);

        return productService.getCatalogProducts({
          page: 0,
          size: HOMEPAGE_PRODUCT_FETCH_SIZE,
          sort: "featured",
          status: "ACTIVE",
        });
      })
      .then((page) => {
        if (!isActive || !page) {
          return;
        }

        setProducts(page.items);
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        setError(loadError);
        setProducts([]);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [refreshIndex]);

  const featuredProducts = useMemo(
    () => getFeaturedProducts(products, HOMEPAGE_FEATURED_LIMIT),
    [products],
  );
  const flashSaleProduct = useMemo(
    () => getFlashSaleProduct(products, featuredProducts),
    [featuredProducts, products],
  );

  return {
    error,
    featuredProducts,
    flashSaleProduct,
    isLoading,
    products,
    refresh,
  };
}

export default useHomepageProducts;
