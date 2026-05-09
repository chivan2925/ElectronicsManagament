import { useCallback, useEffect, useState } from "react";
import { normalizeApiError } from "../api/errorUtils";
import productService from "../api/productService";

function getRelatedProducts(products, product, limit = 4) {
  if (!product) {
    return [];
  }

  const sameCategory = products.filter((item) => item.slug !== product.slug && item.category === product.category);
  const sameBrand = products.filter((item) => item.slug !== product.slug && item.brand === product.brand);
  const fallback = products.filter((item) => item.slug !== product.slug);
  const merged = [...sameCategory, ...sameBrand, ...fallback];

  return Array.from(new Map(merged.map((item) => [item.slug, item])).values()).slice(0, limit);
}

function useProductDetail(slug) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => {
    setRefreshIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return undefined;
        }

        setIsLoading(true);
        setError(null);
        setIsNotFound(false);

        return productService.getCatalogProductBySlug(slug);
      })
      .then(async (productDetail) => {
        if (!isActive) {
          return;
        }

        if (productDetail === undefined) {
          return;
        }

        if (!productDetail) {
          setDetail(null);
          setRelatedProducts([]);
          setIsNotFound(true);
          return;
        }

        setDetail(productDetail);

        const relatedPage = await productService
          .getCatalogProductsWithDetails({
            page: 0,
            size: 24,
            status: "ACTIVE",
          })
          .catch(() => ({ items: [] }));

        if (isActive) {
          setRelatedProducts(getRelatedProducts(relatedPage.items, productDetail.product));
        }
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        const apiError = normalizeApiError(loadError);

        setDetail(null);
        setRelatedProducts([]);

        if (apiError.status === 404) {
          setIsNotFound(true);
          return;
        }

        setError(loadError);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [refreshIndex, slug]);

  return {
    detail,
    error,
    isLoading,
    isNotFound,
    refresh,
    relatedProducts,
  };
}

export default useProductDetail;
