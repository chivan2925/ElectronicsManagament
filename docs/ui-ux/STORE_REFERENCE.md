# STORE_REFERENCE

## Purpose

This document is the design reference for the client storefront.

The storefront should feel like a modern electronics and gaming shop with a dark, technical, product-first interface.

## Visual Direction

| Token | Value |
| --- | --- |
| Background | `#050B14` |
| Surface | `#07111F` |
| Primary | `#005BFF` |
| Border | `#1E293B` |
| Text | White and light gray |
| Radius | 12-16px |

## Homepage Structure

Required homepage sections:

1. Announcement bar.
2. Header with logo, category dropdown, search, auth, order tracking, and cart.
3. Three-column hero:
   - Category sidebar.
   - Main hero banner.
   - Promo cards.
4. Service bar.
5. Featured categories.
6. Featured products.
7. Flash sale card or section.

## Header Rules

Header should support:

- Logo and subtitle.
- Category selector.
- Search.
- Order tracking link.
- Login/register link.
- Cart badge.

Search should be visually prominent because product discovery is central to the storefront.

## Category Rules

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

Category items should include:

- Icon.
- Label.
- Direction arrow or active indicator.

## Hero Rules

Hero banner should include:

- Product or campaign badge.
- Strong product title.
- Short supporting copy.
- Feature bullets.
- Primary CTA.
- Secondary CTA.
- Product image or product-like visual.
- Carousel controls if multiple campaigns exist.

Do not use a purely abstract hero when a product needs to be inspected.

## Product Card Rules

Each product card should include:

- Discount badge when available.
- Product image.
- Product name.
- Rating and review count.
- Current price.
- Old price when available.
- Cart action.

Product cards should keep image areas stable to avoid layout jumps.

## Flash Sale Rules

Flash sale should include:

- Clear title.
- Countdown.
- Featured product.
- Discount badge.
- Rating.
- Current and old price.
- Purchase CTA.

The countdown should not push surrounding content when numbers change.

## Service Bar

Recommended services:

- Fast delivery.
- Official warranty.
- Easy returns.
- Secure payment.
- 24/7 support.

Keep service items short and icon-led.

## Responsive Rules

Desktop:

- Preserve the three-column hero layout when space allows.
- Product grid should show multiple columns.

Tablet:

- Compress hero and promo areas without hiding key CTAs.
- Keep category navigation accessible.

Mobile:

- Hide or collapse sidebar category navigation.
- Use two-column product grid when possible.
- Keep header actions reachable.

## Avoid

- Admin-style white dashboard cards.
- Low-contrast gray text on dark backgrounds.
- Overly blurred or dark product images.
- CTA buttons that blend into the background.
- Decorative gradients that compete with product content.
