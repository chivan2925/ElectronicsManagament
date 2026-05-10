# FRONTEND_GUIDE

## Purpose

This guide describes the frontend direction for ElectronicsManagement.

Current phase:

```text
Ready for Phase 6 — Ecommerce Core Features
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
- `/profile`
- `/profile/orders`
- `/profile/settings`

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
│  ├─ apiErrorEvents.js
│  ├─ apiErrorFeedback.js
│  ├─ apiErrorHandler.js
│  ├─ client.js
│  ├─ normalizeApiError.js
│  ├─ resourceService.js
│  ├─ checkoutMapper.js
│  ├─ accountMapper.js
│  ├─ productMapper.js
│  ├─ wishlistMapper.js
│  ├─ refreshTokenService.js
│  ├─ authService.js
│  ├─ categoryService.js
│  ├─ brandService.js
│  ├─ productService.js
│  ├─ variantService.js
│  ├─ userService.js
│  ├─ staffService.js
│  ├─ roleService.js
│  ├─ permissionService.js
│  ├─ orderService.js
│  ├─ warehouseService.js
│  ├─ couponService.js
│  ├─ wishlistService.js
│  └─ mediaService.js
├─ admin/
│  ├─ analytics/
│  ├─ components/
│  ├─ forms/
│  ├─ hooks/
│  │  ├─ useAdminFilters.js
│  │  ├─ useAdminModal.js
│  │  ├─ useAdminPagination.js
│  │  └─ useAdminTable.js
│  ├─ layouts/
│  ├─ modals/
│  ├─ pages/
│  ├─ services/
│  │  ├─ adminCrudService.js
│  │  └─ adminModuleRegistry.js
│  └─ tables/
├─ auth/
│  ├─ AuthContext.jsx
│  ├─ AuthProvider.jsx
│  ├─ useAuth.js
│  ├─ usePermissions.js
│  ├─ authStorage.js
│  ├─ authHelpers.js
│  ├─ roleHelpers.js
│  └─ PermissionGate.jsx
├─ cart/
│  ├─ CartContext.js
│  ├─ CartProvider.jsx
│  ├─ cartUtils.js
│  ├─ index.js
│  └─ useCart.js
├─ wishlist/
│  ├─ WishlistContext.js
│  ├─ WishlistProvider.jsx
│  └─ index.js
├─ assets/
├─ components/
│  ├─ auth/
│  ├─ account/
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
│     ├─ feedback/
│     ├─ toast/
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
│  ├─ useProductDetail.js
│  ├─ useProducts.js
│  ├─ useCheckoutCoupon.js
│  ├─ useCheckoutOrder.js
│  ├─ useCheckoutProfile.js
│  ├─ useAccountProfile.js
│  ├─ useRecentlyViewed.js
│  ├─ useRecentSearches.js
│  ├─ useSearch.js
│  └─ useWishlist.js
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
│     ├─ ProfileOrders.jsx
│     ├─ ProfileOverview.jsx
│     ├─ ProfileSettings.jsx
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

## Admin Architecture

The Phase 5 admin dashboard namespace lives in `frontend/src/admin`.

- `admin/components` bridges reusable admin UI primitives.
- `admin/layouts` and `admin/pages` are the route-facing admin entrypoints.
- `admin/hooks` owns reusable table, filter, pagination, and modal state.
- `admin/services` owns admin module registry metadata and generic CRUD wrappers.
- `admin/tables`, `admin/forms`, `admin/modals`, and `admin/analytics` hold reusable admin-specific patterns.
- Admin modules currently tracked by the registry: categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, and coupons.

Use `useAdminTable`, `useAdminFilters`, `useAdminPagination`, and `useAdminModal` before adding local duplicated state to admin pages. Use the admin module registry and CRUD wrappers before wiring a page directly to a resource service.

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

- `ProtectedRoute` protects customer-only client routes such as `/checkout`.
- `ProtectedRoute` protects customer-only client account routes under `/profile`.
- `StaffRoute` protects the `/admin/*` layout for admin/staff sessions.
- `AdminRoute` protects admin-only management pages such as users, staff, and roles.
- Admin route policies are centralized and reused by route guards and the admin sidebar.
- ADMIN has full access, STAFF module access requires matching resource view permissions, and USER cannot enter admin routes.
- Shared admin CRUD controls use resource action policies for view/create/update/delete visibility.
- `GuestRoute` blocks authenticated users from `/login`, `/register`, and `/admin/login`.
- Unauthenticated redirects preserve the original route in `location.state.from`.
- Guard loading states prevent unauthorized content flashing while sessions restore.

`/login` and `/admin/login` submit through `frontend/src/api/authService.js`, store the backend JWT session through auth storage, and redirect by role:

- user-shaped session: `/`
- admin/staff session: `/admin/dashboard`

Reusable toast notifications live in `src/components/ui/toast`.
Reusable feedback states live in `src/components/ui/feedback`.

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
- `feedback/`: `GlobalErrorBoundary`, `ApiErrorAlert`, `EmptyState`, and `PermissionDenied`.
- `toast/`: `ToastProvider` and `useToast` for success, error, warning, info, loading, API-error, and promise-style feedback.

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

Reusable listing API, filter, sort, and pagination state logic lives in `frontend/src/hooks/useProducts.js`.

The listing page fetches Product API data through `frontend/src/api/productService.js`, normalizes flexible backend response shapes through `frontend/src/api/productMapper.js`, derives category and brand filter options from API data, and renders loading, API error, empty, and pagination foundation states without changing the existing PLP layout.

## Product Detail Components

The `/products/:slug` page lives at `frontend/src/pages/client/ProductDetail.jsx`.

Reusable product detail components live in `frontend/src/components/product/`:

- `ProductGallery.jsx`
- `ProductInfo.jsx`
- `VariantSelector.jsx`
- `QuantitySelector.jsx`
- `ProductSpecs.jsx`
- `ProductReviews.jsx`
- `RatingSummary.jsx`
- `ReviewCard.jsx`
- `ReviewForm.jsx`
- `RelatedProducts.jsx`

Reusable product detail API state logic lives in `frontend/src/hooks/useProductDetail.js`.

The detail page fetches Product API data through `frontend/src/api/productService.js`, normalizes detail, variants, media, reviews, specs, and stock state through `frontend/src/api/productMapper.js`, and renders loading, API error, not-found, reviews, and related-product states without changing the existing PDP layout.

The reviews system uses Product API review pages for the list and authenticated frontend state for the write-review UI until a dedicated public customer review create endpoint is available. Keep review UI dark, readable, filterable, and reusable.

## Cart State And Drawer

Shared storefront cart state lives in `frontend/src/cart/` and is mounted through `CartProvider` at the app root. Use `useCart()` for cart item count, subtotal, add, quantity update, remove, and clear actions.

The cart drawer is opened from `frontend/src/components/layout/Header.jsx`.

Reusable cart components live in `frontend/src/components/cart/`:

- `CartDrawer.jsx`
- `CartItem.jsx`
- `CartSummary.jsx`

The full cart page lives at `frontend/src/pages/client/Cart.jsx` and reuses `CartItem` and `CartSummary`.

The cart drawer, cart page, product-card quick add, product-detail add-to-cart, product-detail buy-now, and checkout page all use `frontend/src/cart`. `frontend/src/data/cart.js` is legacy mock setup and should not be used by active cart/checkout flows.

## Checkout Components

The `/checkout` page lives at `frontend/src/pages/client/Checkout.jsx`.

Reusable checkout components live in `frontend/src/components/checkout/`:

- `CheckoutForm.jsx`
- `ShippingMethodSelector.jsx`
- `PaymentMethodSelector.jsx`
- `CheckoutSummary.jsx`

Checkout API state logic lives in `frontend/src/hooks/`:

- `useCheckoutCoupon.js`
- `useCheckoutOrder.js`
- `useCheckoutProfile.js`

Checkout API response and payload mapping lives in `frontend/src/api/checkoutMapper.js`.

The checkout page uses shared cart state, local form validation, backend Coupon API validation, backend User API profile prefill when available, and backend Order API creation through `orderService.createOrder()`. COD creates the order only; VNPay and MoMo remain disabled placeholders until the real payment gateway task starts.

## Customer Auth Components

The `/login` and `/register` pages live at `frontend/src/pages/client/Login.jsx` and `frontend/src/pages/client/Register.jsx`.

Reusable customer auth components live in `frontend/src/components/auth/`:

- `AuthLayout.jsx`
- `LoginForm.jsx`
- `RegisterForm.jsx`

The login form uses local form state, local validation, `authService.login()`, AuthProvider session updates, role-based redirect, and toast notifications. `/register`, social login, and forgot-password remain placeholders until public customer auth APIs are ready.

## Account Components

The protected account area lives under `/profile`.

Reusable account components live in `frontend/src/components/account/`:

- `ProfileLayout.jsx`
- `AccountSidebar.jsx`
- `OrdersTable.jsx`

Account pages live in `frontend/src/pages/client/`:

- `ProfileOverview.jsx`
- `ProfileOrders.jsx`
- `ProfileSettings.jsx`

Account API normalization lives in `frontend/src/api/accountMapper.js`. Profile fetch/update uses `userService.getCurrentUserProfile()` and `userService.updateCurrentUserProfile()`. Order history/detail uses `orderService.getUserOrders()` and `orderService.getUserOrderById()`.

## Wishlist And Recently Viewed

The `/wishlist` page lives at `frontend/src/pages/client/WishlistPage.jsx`.

Shared storefront wishlist state lives in `frontend/src/wishlist/` and is mounted through `WishlistProvider` at the app root. `frontend/src/hooks/useWishlist.js` reads that provider and exposes wishlist count, product snapshots, optimistic add/remove/clear/toggle actions, item pending state, loading/error state, sync mode, and refresh.

Reusable wishlist/recently viewed state hooks live in `frontend/src/hooks/`:

- `useWishlist.js`
- `useRecentlyViewed.js`

Wishlist API sync lives in `frontend/src/api/wishlistService.js` and `wishlistMapper.js`. The current frontend is local-first and uses `VITE_WISHLIST_API_PATH` only when a compatible backend wishlist API exists; missing or unauthorized APIs fall back to local persistence. Recently viewed remains localStorage-backed until product history APIs are ready.

## Search Overlay

Reusable storefront search components live in `frontend/src/components/search/`:

- `SearchOverlay.jsx`
- `SearchSuggestions.jsx`
- `SearchResultItem.jsx`

Reusable search state logic lives in:

- `frontend/src/hooks/useSearch.js`
- `frontend/src/hooks/useRecentSearches.js`

The storefront header opens the search overlay on desktop and mobile. The overlay uses mock products, categories, and brands with debounced local suggestions, recent searches, trending searches, category-aware and brand-aware scoring, result previews, search highlighting, loading/empty states, and keyboard navigation behavior until a real storefront search API is ready.

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
