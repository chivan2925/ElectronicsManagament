# UI_REFERENCE

## Purpose

This file is the quick UI reference for ElectronicsManagement.

## Client Storefront Direction

Style:

- Dark gaming ecommerce.
- Premium electronics store feel.
- Blue accent `#005BFF`.
- Dark backgrounds `#050B14` and `#07111F`.
- Glassmorphism, soft glow, subtle radial gradients.
- Layered dark gradients and subtle grid/lighting texture to avoid a flat black feel.
- Product image hover zoom is allowed.

Design token source:

- Primary JavaScript theme: `frontend/src/styles/theme.js`.
- Tailwind-facing tokens: `frontend/src/styles/tokens.js`.
- CSS variables and global defaults: `frontend/src/styles/globals.css`.
- Shared utility classes: `frontend/src/styles/utilities.css`.
- Shared motion presets: `frontend/src/styles/animations.js`.
- Styles entrypoint: `frontend/src/styles/index.css`.
- Tailwind theme extension reads from `frontend/src/styles/tokens.js`.

Homepage sections to preserve:

- Announcement bar.
- Header.
- Category sidebar.
- Hero banner.
- Promo cards.
- Service bar.
- Featured categories.
- Featured products.
- Flash sale card.

Do not break the homepage layout.

## Admin Dashboard Direction

Style:

- Modern SaaS dashboard.
- Dark navy sidebar.
- Light content background `#F6F8FB`.
- White cards.
- Blue primary actions.
- Clean tables and badges.

Admin pages should prioritize:

- Clarity.
- Fast scanning.
- Repeated operations.
- Search, filters, and actions.

## Design Tokens

The frontend token system includes:

- Colors: `primary`, `primaryHover`, `background`, `surface`, `surfaceSecondary`, `border`, `textPrimary`, `textSecondary`, `success`, `danger`, and `warning`.
- Spacing: xs through 6xl plus page/section spacing helpers.
- Radius: sm, md, lg, xl, and full.
- Shadows: admin card, store card, store hover, neon blue, strong neon blue, and inner highlight.
- Typography: display, heading, title, body, caption, price, card title, and muted text scales.
- zIndex: base, raised, dropdown, sticky, modal, and toast.
- Transitions: fast, base, premium, and slow timing values.
- Motion presets: fade, stagger, hover lift, hover glow, and image zoom interactions.

Use tokens for new shared UI work. Existing layout and visual structure should not be rewritten just to replace every Tailwind utility.

Reusable storefront utility classes:

- `card-dark`
- `card-hover`
- `blue-glow`
- `skeleton-shimmer`
- `skeleton-card`
- `section-spacing`
- `page-container`
- `container-default`
- `section-wrapper`
- `grid-products`
- `grid-categories`
- `flex-between`
- `flex-center`
- `transition-default`

Legacy utility aliases such as `store-page-shell`, `store-glass`, `store-glass-soft`, `neon-blue-glow`, and `premium-transition` remain available for existing components.

## Typography

Storefront typography should keep a clear ecommerce hierarchy with a premium gaming feel:

- `display`: hero/product campaign titles.
- `heading`: major page headings.
- `title`: section titles and high-emphasis module headers.
- `body`: readable paragraph/supporting copy.
- `caption`: compact metadata and helper text.
- `muted`: secondary text with relaxed line height.

Reusable typography utility classes:

- `text-display`
- `text-heading`
- `text-section`
- `text-card-title`
- `text-price`
- `text-muted`

Use relaxed line height for supporting copy so text remains readable on the dark navy background.

## Spacing And Layout

Storefront spacing uses an 8-point scale:

- `8`
- `12`
- `16`
- `20`
- `24`
- `32`
- `40`
- `48`
- `64`

Use `page-container` for max-width and horizontal padding, `section-wrapper` for homepage-style vertical rhythm, `grid-products` for product cards, and `grid-categories` for category cards. Use `flex-between` and `flex-center` for common alignment patterns.

## Homepage Visual Quality

The homepage should feel production-level and product-focused without changing the required layout:

- Use layered radial gradients, subtle grid texture, and dark navy surfaces for depth.
- Hero banner should keep strong CTA focus, directional lighting, radial glow, and product image spotlighting.
- Promo cards should use richer gradients, neon accents, concise typography, and framed product imagery.
- Section separation should be subtle: thin glow dividers, glass surfaces, and consistent shadows.
- Avoid flat black backgrounds, oversized decorative elements, and layout-changing visual effects.

## Motion

Storefront motion uses `framer-motion` through shared presets in `frontend/src/styles/animations.js`:

- `fadeIn`
- `fadeUp`
- `staggerContainer`
- `hoverLift`
- `hoverGlow`
- `imageZoom`

Use motion sparingly for premium ecommerce feedback: product cards, category cards, promo cards, flash sale cards, service cards, and primary CTAs. Keep hover movement subtle, avoid layout shifts, and prefer image zoom on product media instead of animating whole sections heavily.

## Skeleton Loading

Storefront skeleton states should use dark shimmer placeholders that match the final layout dimensions. Reusable components live in `frontend/src/components/skeletons/` and include header, banner, category, and product card skeletons. Use skeletons for mock loading demos and future API loading states instead of blank screens or spinners.

## Category Labels

Use these labels for storefront/product taxonomy:

- Điện thoại
- Laptop
- Tai nghe
- Chuột
- Bàn phím
- Lót chuột
- PC Gaming
- Máy bộ
- Linh kiện PC
- Ghế gaming
- Phụ kiện gaming

## Interaction Rules

Good:

- Smooth hover states.
- Clear focus states.
- Stable card dimensions.
- CTA buttons that stand out.
- Product imagery that remains readable.

Avoid:

- Admin styling inside client storefront.
- Storefront dark gradients inside admin tables.
- Layout shifts on hover.
- Text overlap on mobile.
- Low contrast text.
