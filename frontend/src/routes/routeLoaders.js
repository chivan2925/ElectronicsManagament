export const routeLoaders = {
  activityLog: () => import("../pages/admin/ActivityLog"),
  adminLayout: () => import("../admin/layouts/AdminLayout"),
  adminLogin: () => import("../pages/admin/AdminLogin"),
  adminProducts: () => import("../pages/admin/Products"),
  bestSellers: () => import("../pages/admin/BestSellers"),
  brands: () => import("../pages/admin/Brands"),
  cart: () => import("../pages/client/Cart"),
  categories: () => import("../pages/admin/Categories"),
  checkout: () => import("../pages/client/Checkout"),
  coupons: () => import("../pages/admin/Coupons"),
  dashboard: () => import("../pages/admin/Dashboard"),
  home: () => import("../pages/client/Home"),
  login: () => import("../pages/client/Login"),
  media: () => import("../pages/admin/Media"),
  orders: () => import("../pages/admin/Orders"),
  paymentFailed: () => import("../pages/client/PaymentFailed"),
  paymentSuccess: () => import("../pages/client/PaymentSuccess"),
  productDetail: () => import("../pages/client/ProductDetail"),
  products: () => import("../pages/client/ProductListingPage"),
  profileLayout: () => import("../components/account/ProfileLayout"),
  profileOrderDetail: () => import("../pages/client/ProfileOrderDetail"),
  profileOrders: () => import("../pages/client/ProfileOrders"),
  profileOverview: () => import("../pages/client/ProfileOverview"),
  profileSettings: () => import("../pages/client/ProfileSettings"),
  register: () => import("../pages/client/Register"),
  revenue: () => import("../pages/admin/Revenue"),
  roles: () => import("../pages/admin/Roles"),
  staff: () => import("../pages/admin/Staff"),
  users: () => import("../pages/admin/Users"),
  variants: () => import("../pages/admin/Variants"),
  warehouse: () => import("../pages/admin/Warehouse"),
  wishlist: () => import("../pages/client/WishlistPage"),
};

export function preloadRoute(routeKey) {
  const loader = routeLoaders[routeKey];

  return loader ? loader() : Promise.resolve();
}
