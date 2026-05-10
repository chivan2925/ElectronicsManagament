import { useCallback, useEffect, useMemo, useState } from "react";
import { getImageFallbackSrc } from "../utils/imageFallbacks";

const EMPTY_NATURAL_SIZE = { height: 0, width: 0 };

function hasUsableSrc(value) {
  return Boolean(String(value ?? "").trim());
}

function resolveImageSource(src, fallbackSrc) {
  return hasUsableSrc(src) ? String(src).trim() : fallbackSrc;
}

export default function useImageLoading({
  alt = "",
  fallbackKind = "product",
  fallbackSrc,
  onError,
  onLoad,
  onStatusChange,
  src,
} = {}) {
  const resolvedFallbackSrc = useMemo(
    () => fallbackSrc || getImageFallbackSrc(fallbackKind, alt),
    [alt, fallbackKind, fallbackSrc],
  );
  const requestedSrc = useMemo(() => resolveImageSource(src, resolvedFallbackSrc), [resolvedFallbackSrc, src]);
  const [failedOriginalSrc, setFailedOriginalSrc] = useState("");
  const [failedFallbackSrc, setFailedFallbackSrc] = useState("");
  const [loadedImage, setLoadedImage] = useState({
    naturalSize: { height: 0, width: 0 },
    src: "",
  });
  const currentSrc = failedOriginalSrc === requestedSrc ? resolvedFallbackSrc : requestedSrc;
  const isFallback = currentSrc === resolvedFallbackSrc || !hasUsableSrc(src);
  const hasError = isFallback && failedFallbackSrc === currentSrc;
  const isLoaded = !hasError && loadedImage.src === currentSrc;
  const naturalSize = isLoaded ? loadedImage.naturalSize : EMPTY_NATURAL_SIZE;
  const status = hasError ? "error" : isLoaded ? (isFallback ? "fallback-loaded" : "loaded") : isFallback ? "fallback" : "loading";

  useEffect(() => {
    onStatusChange?.({
      currentSrc,
      isFallback,
      naturalSize,
      status,
    });
  }, [currentSrc, isFallback, naturalSize, onStatusChange, status]);

  const handleLoad = useCallback(
    (event) => {
      const image = event.currentTarget;

      setLoadedImage({
        naturalSize: {
          height: image.naturalHeight || 0,
          width: image.naturalWidth || 0,
        },
        src: currentSrc,
      });
      onLoad?.(event);
    },
    [currentSrc, onLoad],
  );

  const handleError = useCallback(
    (event) => {
      if (!isFallback) {
        setFailedOriginalSrc(requestedSrc);
      } else {
        setFailedFallbackSrc(currentSrc);
      }

      onError?.(event);
    },
    [currentSrc, isFallback, onError, requestedSrc],
  );

  return {
    currentSrc,
    handleError,
    handleLoad,
    hasError,
    isFallback,
    isLoaded,
    isLoading: status === "loading" || status === "fallback",
    naturalSize,
    status,
  };
}
