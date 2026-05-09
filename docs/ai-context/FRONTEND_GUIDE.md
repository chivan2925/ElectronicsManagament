# FRONTEND_GUIDE

## Purpose

This guide describes the frontend direction for ElectronicsManagement.

Current phase:

```text
Ready for Phase 4 — Auth + Backend Integration
```

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- lucide-react
- Recharts

## Current Routes

Client:

- `/`
- `/products`
- `/products/:slug`
- `/cart`
- `/checkout`
- `/login`
- `/register`
- `/wishlist`

Admin:

- `/admin`
- `/admin/login`
- `/admin/dashboard`
- `/admin/categories`
- `/admin/brands`
- `/admin/products`
- `/admin/variants`
- `/admin/media`
- `/admin/users`
- `/admin/staff`
- `/admin/roles`
- `/admin/orders`
- `/admin/warehouse`
- `/admin/coupons`
- `/admin/reports/revenue`
- `/admin/reports/best-sellers`
- `/admin/reports/activity`

## Current Structure

```text
frontend/src/
├─ api/
│  ├─ apiConfig.js
│  ├─ apiErrorHandler.js
│  ├─ client.js
│  ├─ normalizeApiError.js
│  ├─ refreshTokenService.js
│  ├─ authService.js
│  ├─ categoryService.js
│  ├─ brandService.js
│  ├─ productService.js
│  ├─ userService.js
│  ├─ staffService.js
│  ├─ orderService.js
│  ├─ warehouseService.js
│  ├─ couponService.js
│  └─ mediaService.js
├─ auth/
│  ├─ AuthContext.jsx
│  ├─ AuthProvider.jsx
│  ├─ useAuth.js
│  ├─ usePermissions.js
│  ├─ authStorage.js
│  ├─ authHelpers.js
│  ├─ roleHelpers.js
│  └─ PermissionGate.jsx
├─ assets/
├─ components/
│  ├─ auth/
│  ├─ cart/
│  ├─ checkout/
│  ├─ common/
│  ├─ home/
│  ├─ layout/
│  │  └─ admin/
│  ├─ product/
│  ├─ search/
│  ├─ skeletons/
│  └─ ui/
│     ├─ Badge.jsx
│     ├─ Button.jsx
│     ├─ Card.jsx
│     ├─ Container.jsx
│     ├─ IconButton.jsx
│     ├─ Input.jsx
│     ├─ Price.jsx
│     ├─ Rating.jsx
│     ├─ SectionTitle.jsx
│     └─ admin/
├─ constants/
├─ data/
│  ├─ adminMock.js
│  ├─ cart.js
│  ├─ categories.js
│  ├─ index.js
│  ├─ products.js
│  ├─ promotions.js
│  └─ services.js
├─ guards/
│  ├─ ProtectedRoute.jsx
│  ├─ AdminRoute.jsx
│  ├─ StaffRoute.jsx
│  ├─ GuestRoute.jsx
│  ├─ RouteGuardState.jsx
│  ├─ routeGuardUtils.jsx
│  └─ index.js
├─ hooks/
├─ layouts/
│  └─ AdminLayout.jsx
├─ pages/
│  ├─ admin/
│  │  ├─ AdminLogin.jsx
│  │  └─ Dashboard.jsx
│  └─ client/
│     ├─ Cart.jsx
│     ├─ Checkout.jsx
│     ├─ Home.jsx
│     ├─ Login.jsx
│     ├─ ProductDetail.jsx
│     ├─ ProductListingPage.jsx
│     ├─ Register.jsx
│     └─ WishlistPage.jsx
├─ routes/
│  └─ AppRoutes.jsx
├─ services/
├─ store/
│  └─ auth/
├─ styles/
│  ├─ globals.css
│  ├─ animations.js
│  ├─ tokens.js
│  ├─ theme.js
│  ├─ utilities.css
│  └─ index.css
├─ utils/
│  └─ formatters.js
├─ App.jsx
└─ main.jsx
```

## Client UI Direction

- Dark gaming ecommerce.
- Premium product-focused feel.
- Blue accent.
- Strong product cards and CTA states.
- Existing homepage layout must be preserved.

## Design Tokens

Token sources:

- `src/styles/theme.js`: primary JavaScript theme for ecommerce colors, radius, shadows, and transitions.
- `src/styles/tokens.js`: Tailwind-facing design tokens derived from the theme.
- `src/styles/globals.css`: CSS custom properties and global defaults.
- `src/styles/utilities.css`: reusable utilities such as `card-dark`, `card-hover`, `blue-glow`, `section-spacing`, `container-default`, and `transition-default`.
- `src/styles/animations.js`: reusable Framer Motion presets for subtle storefront interactions.
- `src/styles/index.css`: style entrypoint imported by `src/main.jsx`.

Token groups:

- colors, including `primary`, `primaryHover`, `background`, `surface`, `surfaceSecondary`, `border`, `textPrimary`, `textSecondary`, `success`, `danger`, and `warning`
- spacing
- radius
- shadows
- typography
- zIndex
- transitions

Use tokens for new shared UI work. Avoid broad rewrites of stable components when token adoption would not improve maintainability.

## Admin UI Direction

- Modern dashboard.
- Dark navy sidebar.
- Light content area.
- KPI cards, charts, CRUD tables, badges, and action icons.

## Component Rules

- Pages compose layout and data flow.
- Components should be focused and reusable.
- Use props instead of importing data inside small reusable components.
- Keep mock data grouped by domain under `src/data`.
- Keep API calls out of presentational components.
- Keep API calls centralized through service modules under `src/api`.
- Prefer shared primitives in `src/components/ui` before duplicating button, card, badge, input, price, rating, or section-title markup.

## Routing Rules

- Keep route definitions centralized in `src/routes/AppRoutes.jsx`.
- `/` must continue to render the existing homepage.
- `/admin` should redirect to `/admin/dashboard`.
- `/admin/login` stays outside `AdminLayout`.
- Placeholder pages are acceptable while API and page-specific workflows are not ready, but they should be styled and informative.

## Auth Architecture

Centralized auth lives in `src/auth`, route guards live in `src/guards`, and auth reducer exports live in `src/store/auth`.

Centralized role and permission policy logic lives in `src/auth/roleHelpers.js`. Components and pages should use `src/auth/usePermissions.js` or `src/auth/PermissionGate.jsx` instead of inline role checks.

Current auth state supports:

- `user`
- `roles`
- `permissions`
- `accessToken`
- `refreshToken`
- `isAuthenticated`
- `loading`

`refreshTokenService` owns app-start session validation, single-flight token refresh, retry coordination after `401`, and logout-on-refresh-failure behavior. It uses `VITE_AUTH_REFRESH_ENDPOINT`, defaulting to `/admin/auth/refresh`.

`AuthProvider` is mounted at the app root. `StaffRoute` protects the `/admin/*` shell, `AdminRoute` protects admin-only pages, and `GuestRoute` wraps guest-only auth routes.

Current protected routing behavior:

- `ProtectedRoute` protects authenticated client routes such as `/checkout`.
- `StaffRoute` protects the `/admin/*` layout for admin/staff sessions.
- `AdminRoute` protects admin-only management pages such as users, staff, and roles.
- Admin route policies are centralized and reused by route guards and the admin sidebar.
- ADMIN has full access, STAFF is limited to staff-allowed admin areas, and USER cannot enter admin routes.
- Shared admin CRUD controls use resource action policies for create/update/delete visibility.
- `GuestRoute` blocks authenticated users from `/login`, `/register`, and `/admin/login`.
- Unauthenticated redirects preserve the original route in `location.state.from`.
- Guard loading states prevent unauthorized content flashing while sessions restore.

`/login` and `/admin/login` submit through `frontend/src/api/authService.js`, store the backend JWT session through auth storage, and redirect by role:

- user-shaped session: `/`
- admin/staff session: `/admin/dashboard`

Reusable toast notifications live in `src/components/ui/toast`.

## Reusable UI Primitives

Shared frontend primitives live in `src/components/ui`:

- `Button.jsx`: primary, outline, and ghost variants with sm, md, and lg sizes.
- `Card.jsx`: shared card shell variants for store, glass, product, flash, and admin surfaces.
- `Badge.jsx`: compact label/status badges for ecommerce UI.
- `Input.jsx`: dark and light input shells.
- `SectionTitle.jsx`: repeated storefront section heading/action pattern.
- `IconButton.jsx`: icon-only action buttons.
- `Container.jsx`: page-width container helper.
- `Price.jsx`: currency display with optional old price.
- `Rating.jsx`: star rating with optional review count.

Use these primitives for new frontend work unless a feature needs a clearly different interaction pattern.

## Product Listing Components

The `/products` page lives at `frontend/src/pages/client/ProductListingPage.jsx`.

Reusable listing components live in `frontend/src/components/product/`:

- `ProductCard.jsx`
- `FilterSidebar.jsx`
- `SearchProductsInput.jsx`
- `SortDropdown.jsx`
- `ActiveFilters.jsx`
- `Pagination.jsx`
- `EmptyProductsState.jsx`

Reusable listing state logic lives in `frontend/src/hooks/useProductFilters.js`.

The listing page uses mock data from `frontend/src/data/products.js` and must not call real APIs until storefront API integration is explicitly started.

## Product Detail Components

The `/products/:slug` page lives at `frontend/src/pages/client/ProductDetail.jsx`.

Reusable product detail components live in `frontend/src/components/product/`:

- `ProductGallery.jsx`
- `ProductInfo.jsx`
- `VariantSelector.jsx`
- `QuantitySelector.jsx`
- `ProductSpecs.jsx`
- `ProductReviews.jsx`
- `RelatedProducts.jsx`

Mock product detail enrichment lives in `frontend/src/data/productDetails.js`.

## Cart Drawer Components

The mock cart drawer is opened from `frontend/src/components/layout/Header.jsx`.

Reusable cart components live in `frontend/src/components/cart/`:

- `CartDrawer.jsx`
- `CartItem.jsx`
- `CartSummary.jsx`

The full cart page lives at `frontend/src/pages/client/Cart.jsx` and reuses `CartItem` and `CartSummary`.

Mock cart item setup lives in `frontend/src/data/cart.js`.

The cart drawer and cart page use local mock state until a shared cart state or real storefront cart API is implemented.

## Checkout Components

The `/checkout` page lives at `frontend/src/pages/client/Checkout.jsx`.

Reusable checkout components live in `frontend/src/components/checkout/`:

- `CheckoutForm.jsx`
- `ShippingMethodSelector.jsx`
- `PaymentMethodSelector.jsx`
- `CheckoutSummary.jsx`

The checkout page uses mock cart data, local form validation, and placeholder payment options for COD, VNPay, and MoMo until real checkout/payment APIs are ready.

## Customer Auth Components

The `/login` and `/register` pages live at `frontend/src/pages/client/Login.jsx` and `frontend/src/pages/client/Register.jsx`.

Reusable customer auth components live in `frontend/src/components/auth/`:

- `AuthLayout.jsx`
- `LoginForm.jsx`
- `RegisterForm.jsx`

The login form uses local form state, local validation, `authService.login()`, AuthProvider session updates, role-based redirect, and toast notifications. `/register`, social login, and forgot-password remain placeholders until public customer auth APIs are ready.

## Wishlist And Recently Viewed

The `/wishlist` page lives at `frontend/src/pages/client/WishlistPage.jsx`.

Reusable wishlist/recently viewed state hooks live in `frontend/src/hooks/`:

- `useWishlist.js`
- `useRecentlyViewed.js`

The wishlist and recently viewed flows use localStorage persistence placeholders and shared product card UI until customer account/product history APIs are ready.

## Search Overlay

Reusable storefront search components live in `frontend/src/components/search/`:

- `SearchOverlay.jsx`
- `SearchSuggestions.jsx`

Reusable search state logic lives in `frontend/src/hooks/useSearch.js`.

The storefront header opens the search overlay on desktop and mobile. The overlay uses mock products, categories, and brands with debounced local suggestions, recent searches, trending searches, result previews, and keyboard navigation behavior until a real storefront search API is ready.

## Skeleton Loading

Shared storefront skeleton components live in `src/components/skeletons`:

- `HeaderSkeleton.jsx`
- `BannerSkeleton.jsx`
- `CategorySkeleton.jsx`
- `ProductCardSkeleton.jsx`
- `SkeletonBlock.jsx`

Use these components for dark ecommerce loading states before connecting real API data.

## Future Structure

When the client storefront grows, keep the current structure and add files inside the existing domain folders:

```text
src/components/home/
src/components/product/
src/pages/client/
src/routes/
src/services/
```

Do not move files just for neatness. Move them when it reduces confusion.

## Commands

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```
