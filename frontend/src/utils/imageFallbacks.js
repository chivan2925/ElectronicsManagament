const FALLBACK_THEMES = {
  avatar: {
    accent: "#38BDF8",
    background: "#0F172A",
    foreground: "#E0F2FE",
    subtitle: "Profile image",
    title: "Avatar",
  },
  brand: {
    accent: "#005BFF",
    background: "#F8FAFC",
    foreground: "#334155",
    subtitle: "Brand asset",
    title: "Logo",
  },
  category: {
    accent: "#38BDF8",
    background: "#07111F",
    foreground: "#E0F2FE",
    subtitle: "Category image",
    title: "Category",
  },
  media: {
    accent: "#005BFF",
    background: "#0F172A",
    foreground: "#F8FAFC",
    subtitle: "Media preview",
    title: "Image",
  },
  product: {
    accent: "#005BFF",
    background: "#07111F",
    foreground: "#FFFFFF",
    subtitle: "Product image",
    title: "No image",
  },
  review: {
    accent: "#60A5FA",
    background: "#0B1120",
    foreground: "#E2E8F0",
    subtitle: "Review photo",
    title: "Photo",
  },
};

const DEFAULT_KIND = "product";

function escapeSvgText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function encodeSvg(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getTheme(kind) {
  return FALLBACK_THEMES[kind] || FALLBACK_THEMES[DEFAULT_KIND];
}

export function createImageFallbackSvg({
  accent,
  background,
  foreground,
  height = 360,
  subtitle,
  title,
  width = 480,
} = {}) {
  const safeTitle = escapeSvgText(title || "Image");
  const safeSubtitle = escapeSvgText(subtitle || "Unavailable");
  const bg = background || FALLBACK_THEMES[DEFAULT_KIND].background;
  const fg = foreground || FALLBACK_THEMES[DEFAULT_KIND].foreground;
  const line = accent || FALLBACK_THEMES[DEFAULT_KIND].accent;

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="glow" cx="50%" cy="26%" r="66%">
          <stop offset="0%" stop-color="${line}" stop-opacity="0.34"/>
          <stop offset="48%" stop-color="${bg}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
          <stop offset="42%" stop-color="#FFFFFF" stop-opacity="0"/>
          <stop offset="100%" stop-color="${line}" stop-opacity="0.18"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <rect width="100%" height="100%" fill="url(#shine)"/>
      <rect x="42" y="42" width="${width - 84}" height="${height - 84}" rx="28" fill="none" stroke="${line}" stroke-opacity="0.28"/>
      <circle cx="${width / 2}" cy="${height / 2 - 34}" r="38" fill="${line}" fill-opacity="0.22"/>
      <path d="M${width / 2 - 28} ${height / 2 - 34}h56M${width / 2} ${height / 2 - 62}v56" stroke="${fg}" stroke-opacity="0.82" stroke-width="7" stroke-linecap="round"/>
      <text x="50%" y="${height / 2 + 46}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${fg}">${safeTitle}</text>
      <text x="50%" y="${height / 2 + 78}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="${fg}" opacity="0.68">${safeSubtitle}</text>
    </svg>
  `);
}

export function getImageFallbackSrc(kind = DEFAULT_KIND, label = "", options = {}) {
  const theme = getTheme(kind);
  const normalizedLabel = String(label || "").replace(/\s+/g, " ").trim();

  return createImageFallbackSvg({
    ...theme,
    ...options,
    subtitle: normalizedLabel ? normalizedLabel.slice(0, 44) : theme.subtitle,
  });
}

export function getImagePlaceholderDataUrl(kind = DEFAULT_KIND) {
  const theme = getTheme(kind);

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24">
      <defs>
        <linearGradient id="base" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.background}"/>
          <stop offset="48%" stop-color="${theme.accent}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="${theme.background}"/>
        </linearGradient>
      </defs>
      <rect width="32" height="24" fill="url(#base)"/>
    </svg>
  `);
}
