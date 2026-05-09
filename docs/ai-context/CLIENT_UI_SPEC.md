# CLIENT_UI_SPEC

## Purpose

The client storefront is the e-commerce experience for customers buying electronics and gaming products. It should feel modern, technical, dark-themed, product-focused, and conversion-oriented.

## Shared Style

- Background: `#050B14` / `#07111F`.
- Accent: blue `#005BFF`.
- Dark card border: `#1E293B`.
- Text: white and light gray.
- Cards: dark gradient, subtle border, 12-16px radius.
- Icons: lucide-react.

## Required Homepage Sections

- Top announcement bar.
- Main header with logo, category dropdown, search, order tracking, auth links, and cart badge.
- Three-column hero layout:
  - Category sidebar on the left.
  - Main hero banner in the center.
  - Promo cards on the right.
- Service bar.
- Featured categories.
- Featured products.
- Flash sale card.

## Category List

Default categories:

- All categories
- Phones
- Laptops
- Headphones
- Mice
- Keyboards
- Mouse pads
- Gaming PCs
- Prebuilt desktops
- PC components
- Gaming chairs
- Gaming accessories

## Product Card

Each product card should include:

- Discount badge when available.
- Product image.
- Product name.
- Rating and review count.
- Current price.
- Struck-through old price when available.
- Cart icon button.

## Responsive

- Desktop 1440px is the priority viewport.
- Tablet: hero and promo areas may compress but must remain readable.
- Mobile: category sidebar should hide or become a horizontal list/menu, and the product grid should use two columns when space allows.

## Avoid

- Do not use the light admin style for the client homepage.
- Do not make text too small to read on a dark background.
- Do not let purchase CTAs disappear into the background.
- Do not use images that are too dark or blurred when the product must be clearly visible.
