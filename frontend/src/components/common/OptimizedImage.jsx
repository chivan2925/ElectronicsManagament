import { createElement, forwardRef } from "react";

const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280];

function isCloudinaryImage(src = "") {
  return src.includes("res.cloudinary.com") && src.includes("/image/upload/");
}

function getCloudinaryImageUrl(src, width, quality = "auto") {
  if (!isCloudinaryImage(src) || !width) {
    return src;
  }

  const transform = `f_auto,q_${quality},w_${width}`;

  return src.replace("/image/upload/", `/image/upload/${transform}/`);
}

function getCloudinarySrcSet(src, widths = DEFAULT_WIDTHS, quality) {
  if (!isCloudinaryImage(src)) {
    return undefined;
  }

  return widths.map((width) => `${getCloudinaryImageUrl(src, width, quality)} ${width}w`).join(", ");
}

const OptimizedImage = forwardRef(function OptimizedImage(
  {
    as: Component = "img",
    cloudinaryQuality = "auto",
    fallbackSrc,
    fetchPriority,
    loading,
    onError,
    priority = false,
    src,
    srcSet,
    widths = DEFAULT_WIDTHS,
    ...props
  },
  ref,
) {
  const resolvedSrcSet = srcSet || getCloudinarySrcSet(src, widths, cloudinaryQuality);

  const handleError = (event) => {
    if (fallbackSrc && event.currentTarget.src !== fallbackSrc) {
      event.currentTarget.src = fallbackSrc;
    }

    onError?.(event);
  };

  return createElement(Component, {
    decoding: "async",
    fetchPriority: fetchPriority || (priority ? "high" : "auto"),
    loading: priority ? "eager" : loading || "lazy",
    onError: handleError,
    ref,
    sizes: props.sizes || "100vw",
    src,
    srcSet: resolvedSrcSet,
    ...props,
  });
});

export default OptimizedImage;
