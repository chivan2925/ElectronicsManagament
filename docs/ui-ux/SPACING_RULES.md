# SPACING_RULES

## Purpose

This document defines spacing rules for consistent layouts across admin and storefront UI.

The project uses Tailwind CSS, so spacing should map to Tailwind's spacing scale whenever possible.

## Base Scale

Use these common values:

| Token | Tailwind | Pixels | Usage |
| --- | --- | --- | --- |
| `xs` | `2` | 8px | Tight gaps, icon/text gap. |
| `sm` | `3` | 12px | Compact controls. |
| `md` | `4` | 16px | Default component padding and gaps. |
| `lg` | `6` | 24px | Card padding, section gaps. |
| `xl` | `8` | 32px | Page section separation. |
| `2xl` | `10` | 40px | Storefront section spacing. |
| `3xl` | `12` | 48px | Large hero spacing. |

## Page Padding

Admin:

```text
Desktop: 24-32px
Tablet: 20-24px
Mobile: 16px
```

Storefront:

```text
Desktop: 24-40px inside max-width container
Tablet: 20-24px
Mobile: 16px
```

## Section Spacing

Admin:

- Keep sections tight and scannable.
- Use 16-24px between related panels.
- Use 24-32px between major page regions.

Storefront:

- Use 32-48px between major sections.
- Keep product grids tight enough for comparison.
- Avoid excessive landing-page whitespace on commerce pages.

## Cards

Admin cards:

- Padding: 16-24px.
- Gap inside card: 12-16px.
- Radius: 12-16px.

Client cards:

- Padding: 16-24px.
- Image gap: 12-16px.
- Radius: 12-16px.

Do not put UI cards inside other cards unless the inner element is a modal or row detail.

## Tables

Recommended table spacing:

- Header cell padding: 12-16px.
- Body cell padding: 12-16px.
- Row action gap: 8px.
- Search/filter bar gap: 12-16px.

Dense tables can use smaller vertical padding, but text must remain readable.

## Forms

Recommended form spacing:

- Label to input: 6-8px.
- Input to helper/error: 4-6px.
- Field to field: 16px.
- Form section to section: 24px.
- Footer actions: 16px gap.

## Buttons

Button padding:

- Small: `px-3 py-2`.
- Medium: `px-4 py-2.5`.
- Large CTA: `px-5 py-3`.

Icon gap:

```text
8px
```

Icon-only buttons:

- Minimum size: 36x36px for admin.
- Minimum size: 40x40px for touch-heavy client UI.

## Grids

Admin dashboard:

- KPI grid gap: 16-24px.
- Chart/table grid gap: 24px.

Storefront product grid:

- Desktop gap: 20-24px.
- Tablet gap: 16-20px.
- Mobile gap: 12-16px.

## Responsive Stability

Rules:

- Define stable image aspect ratios for product cards.
- Define stable table action button sizes.
- Avoid dynamic content that changes card height unexpectedly.
- Use wrapping text instead of overflow.
- Never let labels overlap icons or controls.

## Anti-Patterns

- Random one-off spacing values without a clear reason.
- Huge spacing in admin forms and tables.
- Storefront product grids with uneven card image heights.
- Controls that shift when hover, loading, or error states appear.
