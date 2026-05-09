# DESIGN_SYSTEM

## Purpose

This document defines the shared design language for the electronics and gaming e-commerce project.

The project has two visual surfaces:

- Admin console: light, dense, operational.
- Client storefront: dark, product-focused, commerce-oriented.

## Brand Direction

The UI should feel:

- Modern.
- Technical.
- Reliable.
- Fast to scan.
- Suitable for electronics and gaming products.

## Core Colors

| Token | Value | Usage |
| --- | --- | --- |
| Primary blue | `#005BFF` | Main actions, active states, links, highlights. |
| Admin sidebar | `#07111F` | Admin navigation background. |
| Admin background | `#F6F8FB` | Admin content background. |
| Storefront background | `#050B14` | Client storefront base background. |
| Storefront surface | `#07111F` | Dark panels and header surfaces. |
| Dark border | `#1E293B` | Client card borders. |
| Text strong | `#111827` | Admin headings and primary text. |
| Text muted | `#6B7280` | Admin secondary text. |
| White text | `#FFFFFF` | Client primary text on dark backgrounds. |

## Status Colors

Use consistent semantic colors:

| State | Suggested style |
| --- | --- |
| Success / active | Green text on soft green background. |
| Warning / pending | Amber text on soft amber background. |
| Error / failed | Red text on soft red background. |
| Neutral / inactive | Gray text on soft gray background. |
| Info / processing | Blue text on soft blue background. |

Status badges should be short and scannable.

## Typography

Use a modern sans-serif stack.

Rules:

- Do not use negative letter spacing.
- Do not scale font sizes directly with viewport width.
- Reserve hero-scale text for storefront hero sections only.
- Use compact headings in admin cards, tables, and panels.

Suggested hierarchy:

| Use | Size |
| --- | --- |
| Storefront hero title | 44-64px desktop, smaller on mobile. |
| Page title | 24-32px. |
| Section title | 18-24px. |
| Card title | 14-18px. |
| Table text | 13-14px. |
| Helper text | 12-14px. |

## Radius

| Element | Radius |
| --- | --- |
| Admin cards | 12-16px. |
| Client cards | 12-16px. |
| Buttons | 8-12px. |
| Badges | Full or 999px when pill-shaped. |
| Tables | 12-16px outer container. |

Do not nest cards inside cards unless the inner element is a modal, table row detail, or genuinely framed tool.

## Shadows And Borders

Admin:

- Use light borders and soft shadows.
- Avoid heavy floating effects.
- Prefer calm, practical depth.

Client:

- Use dark gradients and `#1E293B` borders.
- Use glow effects sparingly.
- Keep product images clear.

## Icons

Use lucide-react icons when available.

Rules:

- Icon-only buttons need accessible labels or tooltips.
- Use familiar icons for common actions such as search, cart, edit, delete, view, upload, and logout.
- Avoid manual SVGs when a matching icon exists.

## Buttons

Primary button:

- Background: `#005BFF`.
- Text: white.
- Use for the main action on a page or section.

Secondary button:

- Admin: white or light background with border.
- Client: transparent or dark surface with light border.

Danger button:

- Use red styling only for destructive actions.
- Require confirmation for irreversible actions.

## Inputs

Rules:

- Inputs should have clear labels or accessible labels.
- Placeholder text is not a replacement for labels in complex forms.
- Focus state should be visible.
- Error text should appear near the affected field.

## Tables

Admin tables should include:

- Search/filter area.
- Clear column headers.
- Status badges.
- Right-aligned actions.
- Empty state.
- Loading state.
- Pagination when backed by API pages.

## Accessibility Baseline

- Maintain strong color contrast.
- Preserve keyboard focus styles.
- Use semantic buttons and links.
- Avoid placing important text over busy or low-contrast imagery.
- Ensure mobile text does not overlap or overflow.
