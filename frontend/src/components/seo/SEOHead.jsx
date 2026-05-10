import { useEffect } from "react";
import { normalizeMetadata } from "../../seo/metadata";

const MANAGED_ATTRIBUTE = "data-seo-managed";
const STATIC_SEO_SELECTOR = [
  'link[rel="canonical"]',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name^="twitter:"]',
  'meta[property^="og:"]',
  'meta[property^="product:"]',
].join(",");

function removeManagedTags() {
  document.head.querySelectorAll(`[${MANAGED_ATTRIBUTE}="true"]`).forEach((element) => element.remove());
}

function removeSeoTags() {
  document.head.querySelectorAll(`${STATIC_SEO_SELECTOR}, [${MANAGED_ATTRIBUTE}="true"]`).forEach((element) => element.remove());
}

function appendMeta(attributes) {
  const content = attributes.content;

  if (content === null || content === undefined || content === "") {
    return;
  }

  const element = document.createElement("meta");

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      element.setAttribute(key, String(value));
    }
  });

  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  document.head.appendChild(element);
}

function appendCanonical(href) {
  if (!href) {
    return;
  }

  const element = document.createElement("link");
  element.setAttribute("rel", "canonical");
  element.setAttribute("href", href);
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  document.head.appendChild(element);
}

function appendStructuredData(structuredData) {
  structuredData.filter(Boolean).forEach((item) => {
    const element = document.createElement("script");
    element.setAttribute("type", "application/ld+json");
    element.setAttribute(MANAGED_ATTRIBUTE, "true");
    element.textContent = JSON.stringify(item);
    document.head.appendChild(element);
  });
}

function SEOHead({ metadata = {}, ...overrides }) {
  const serializedMetadata = JSON.stringify(normalizeMetadata({ ...metadata, ...overrides }));

  useEffect(() => {
    const resolvedMetadata = JSON.parse(serializedMetadata);
    const {
      canonicalUrl,
      description,
      image,
      imageAlt,
      language,
      locale,
      meta = [],
      openGraph = {},
      product = null,
      robots,
      siteName,
      structuredData = [],
      title,
      twitter = {},
      type,
    } = resolvedMetadata;

    removeSeoTags();

    document.documentElement.setAttribute("lang", language);
    document.title = title;

    appendMeta({ name: "description", content: description });
    appendMeta({ name: "robots", content: robots });
    appendCanonical(canonicalUrl);

    appendMeta({ property: "og:site_name", content: siteName });
    appendMeta({ property: "og:locale", content: locale });
    appendMeta({ property: "og:type", content: openGraph.type || type });
    appendMeta({ property: "og:title", content: openGraph.title || title });
    appendMeta({ property: "og:description", content: openGraph.description || description });
    appendMeta({ property: "og:url", content: openGraph.url || canonicalUrl });
    appendMeta({ property: "og:image", content: openGraph.image || image });
    appendMeta({ property: "og:image:alt", content: openGraph.imageAlt || imageAlt || title });

    appendMeta({ name: "twitter:card", content: twitter.card || (image ? "summary_large_image" : "summary") });
    appendMeta({ name: "twitter:title", content: twitter.title || title });
    appendMeta({ name: "twitter:description", content: twitter.description || description });
    appendMeta({ name: "twitter:image", content: twitter.image || image });
    appendMeta({ name: "twitter:image:alt", content: twitter.imageAlt || imageAlt || title });

    if (product) {
      appendMeta({ property: "product:brand", content: product.brand });
      appendMeta({ property: "product:category", content: product.category });
      appendMeta({ property: "product:availability", content: product.availability });
      appendMeta({ property: "product:price:amount", content: product.price });
      appendMeta({ property: "product:price:currency", content: product.currency || "VND" });
    }

    meta.forEach((tag) => appendMeta(tag));
    appendStructuredData(structuredData);

    return removeManagedTags;
  }, [serializedMetadata]);

  return null;
}

export default SEOHead;
