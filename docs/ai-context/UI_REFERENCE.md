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
- Product image hover zoom is allowed.

Design token source:

- JavaScript tokens: `frontend/src/styles/tokens.js`.
- CSS variables and shared UI utilities: `frontend/src/styles/index.css`.
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

- Colors: primary, primary hover, dark backgrounds, dark surface, dark border, text, admin canvas, panel, and semantic status colors.
- Spacing: xs through 6xl plus page/section spacing helpers.
- Radius: sm, md, lg, xl, and full.
- Shadows: admin card, store card, store hover, neon blue, strong neon blue, and inner highlight.
- Typography: sans font family, font sizes, weights, and line heights.
- zIndex: base, raised, dropdown, sticky, modal, and toast.
- Transitions: fast, base, premium, and slow timing values.

Use tokens for new shared UI work. Existing layout and visual structure should not be rewritten just to replace every Tailwind utility.

## Category Labels

Use these labels for storefront/product taxonomy:

- điện thoại
- laptop
- tai nghe
- chuột
- bàn phím
- lót chuột
- PC Gaming
- máy bộ
- linh kiện PC
- ghế gaming
- phụ kiện gaming

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
