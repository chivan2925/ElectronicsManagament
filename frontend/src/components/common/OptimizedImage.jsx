import { createElement } from "react";
import useImageLoading from "../../hooks/useImageLoading";
import { cn } from "../../utils/classNames";
import { getImagePlaceholderDataUrl } from "../../utils/imageFallbacks";

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

function OptimizedImage({
  as: Component = "img",
  alt = "",
  blurDataUrl,
  className,
  cloudinaryQuality = "auto",
  fadeIn,
  fallbackKind = "product",
  fallbackSrc,
  fetchPriority,
  loading,
  onError,
  onLoad,
  onStatusChange,
  priority = false,
  placeholder = true,
  placeholderClassName,
  src,
  srcSet,
  sizes,
  style,
  wrapperClassName,
  widths = DEFAULT_WIDTHS,
  ...props
}) {
  const image = useImageLoading({
    alt,
    fallbackKind,
    fallbackSrc,
    onError,
    onLoad,
    onStatusChange,
    src,
  });
  const resolvedSrcSet = image.isFallback ? undefined : srcSet || getCloudinarySrcSet(image.currentSrc, widths, cloudinaryQuality);
  const placeholderDataUrl = blurDataUrl || getImagePlaceholderDataUrl(fallbackKind);
  const shouldFadeIn = fadeIn ?? Boolean(wrapperClassName);
  const showPlaceholder = placeholder !== false && Boolean(wrapperClassName);
  const imageStyle =
    placeholder !== false
      ? {
          backgroundImage: `url("${placeholderDataUrl}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          ...style,
        }
      : style;

  const imageElement = createElement(Component, {
    ...props,
    alt,
    className: cn(
      shouldFadeIn && "transition-opacity duration-500",
      shouldFadeIn && image.isLoading ? "opacity-0" : null,
      className,
    ),
    "data-image-fallback": image.isFallback ? "true" : undefined,
    "data-image-status": image.status,
    decoding: "async",
    fetchPriority: fetchPriority || (priority ? "high" : "auto"),
    loading: priority ? "eager" : loading || "lazy",
    onError: image.handleError,
    onLoad: image.handleLoad,
    sizes: sizes || "100vw",
    src: image.currentSrc,
    srcSet: resolvedSrcSet,
    style: imageStyle,
  });

  if (!wrapperClassName) {
    return imageElement;
  }

  return (
    <span className={cn("relative block overflow-hidden", wrapperClassName)} data-image-status={image.status}>
      {showPlaceholder ? (
        <span
          aria-hidden="true"
          className={cn(
            "skeleton-shimmer pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500",
            image.isLoading ? "opacity-100" : "opacity-0",
            placeholderClassName,
          )}
          style={{ backgroundImage: `url("${placeholderDataUrl}")` }}
        />
      ) : null}
      {imageElement}
    </span>
  );
}

export default OptimizedImage;
