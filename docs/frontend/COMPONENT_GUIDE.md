# COMPONENT_GUIDE

## Purpose

This guide defines how frontend components should be organized and written in the React application.

The frontend has two distinct surfaces:

- Client storefront for shoppers.
- Admin console for staff.

Keep the two surfaces visually and structurally separate.

## Component Categories

| Category | Location | Responsibility |
| --- | --- | --- |
| Pages | `src/pages/`, `src/pages/admin/` | Route-level composition, data loading, page state. |
| Layouts | `src/layouts/` | Shared page shell, navigation frame, nested route outlet. |
| Admin components | `src/components/admin/` | Reusable admin UI: tables, headers, badges, sidebar, topbar. |
| Client components | Currently `src/components/`, later `src/components/client/` | Storefront UI: header, hero, categories, products, promo cards. |
| API modules | `src/api/` | HTTP client and future domain API wrappers. |
| Data mocks | `src/data/` | Temporary mock data while APIs are not connected. |
| Utilities | `src/utils/` | Formatting and pure helper functions. |

## Component Rules

- Use PascalCase file names for components.
- Keep components focused on one visual or workflow responsibility.
- Pass data through props rather than importing mock data inside small reusable components.
- Keep page-level data access in pages or API service modules.
- Use Tailwind CSS for styling.
- Prefer lucide-react icons.
- Avoid large UI components that contain unrelated workflows.

## Page Pattern

Pages should compose data and components:

```jsx
import { products } from "../data/mockData";
import ProductCard from "../components/ProductCard";

function ProductListPage() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
```

When APIs are connected, move HTTP calls into API modules:

```text
pages/admin/Categories.jsx
  -> api/admin/categoriesApi.js
  -> api/client.js
```

## Admin Component Pattern

Admin pages should use consistent building blocks:

- `PageHeader` for title, subtitle, and primary action.
- Search input near the table.
- `DataTable` for tabular records.
- `StatusBadge` for status fields.
- Icon buttons for view, edit, delete, media, and variant actions.

Admin pages should feel dense, clear, and work-focused.

Avoid:

- Marketing hero sections.
- Large decorative panels.
- Client dark storefront styling inside admin content.

## Client Component Pattern

Client components should support shopping behavior:

- Product discovery.
- Category browsing.
- Strong product imagery.
- Clear price and promotion display.
- Cart and checkout CTAs.

Client pages may be more visual than admin pages, but should remain readable and fast to scan.

## Props Guidelines

Good props:

```jsx
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
/>
```

Avoid passing loosely related values:

```jsx
<ProductCard
  name={name}
  price={price}
  oldPrice={oldPrice}
  rating={rating}
  reviewCount={reviewCount}
  image={image}
  badge={badge}
/>
```

Object props are better when the component represents one domain item.

## State Guidelines

Use local state for:

- Input values.
- Toggle state.
- Active tabs.
- Modal visibility.
- Temporary UI filters.

Use API/server state later for:

- Paginated tables.
- Product lists.
- Order data.
- Authenticated staff profile.

Do not put server state into global state until there is a repeated cross-page need.

## Styling Guidelines

- Use Tailwind utility classes.
- Use project colors consistently:
  - Primary blue: `#005BFF`.
  - Admin sidebar: `#07111F`.
  - Admin background: `#F6F8FB`.
  - Storefront background: `#050B14` / `#07111F`.
- Keep card radius between 12px and 16px unless a component has an existing local convention.
- Avoid unnecessary inline styles.

## Accessibility Baseline

- Buttons should be real `button` elements.
- Links should be real route links when navigating.
- Icon-only buttons need accessible labels or tooltips.
- Inputs need visible labels or clear accessible labels.
- Tables should preserve header cells and readable column alignment.

## Adding A New Component

Checklist:

1. Choose the correct surface: admin or client.
2. Put the component in the right folder.
3. Define clear props.
4. Keep data fetching outside small UI components.
5. Add loading, empty, and error states if the component displays remote data.
6. Use existing colors, spacing, and typography.
7. Run frontend validation when code changes are made.
