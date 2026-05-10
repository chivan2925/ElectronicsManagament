import { Navigate, Route, Routes } from "react-router-dom";
import {
  ActivityLog,
  AdminLogin,
  AdminLayout,
  AdminProducts,
  BestSellers,
  Brands,
  Categories,
  Coupons,
  Dashboard,
  Media,
  Orders,
  Revenue,
  Roles,
  Staff,
  Users,
  Variants,
  Warehouse,
  Cart,
  Checkout,
  Home,
  Login,
  PaymentFailed,
  PaymentSuccess,
  ProductDetail,
  ProductListingPage,
  ProfileLayout,
  ProfileOrderDetail,
  ProfileOrders,
  ProfileOverview,
  ProfileSettings,
  Register,
  WishlistPage,
} from "./lazyRoutes";
import { ADMIN_ROUTE_POLICIES, CLIENT_ROUTE_POLICIES } from "../auth/roleHelpers";
import AdminRoute from "../guards/AdminRoute";
import GuestRoute from "../guards/GuestRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import StaffRoute from "../guards/StaffRoute";
import RouteLoadingBoundary from "./RouteLoadingBoundary";

const storeRoute = (element) => <RouteLoadingBoundary surface="store">{element}</RouteLoadingBoundary>;
const adminRoute = (element) => <RouteLoadingBoundary surface="admin">{element}</RouteLoadingBoundary>;
const withStaffRoute = (element, policy) => <StaffRoute policy={policy}>{adminRoute(element)}</StaffRoute>;
const withAdminRoute = (element, policy) => <AdminRoute policy={policy}>{adminRoute(element)}</AdminRoute>;

function AppRoutes() {
  return (
    <Routes>
      <Route element={storeRoute(<Home />)} path="/" />
      <Route element={storeRoute(<ProductListingPage />)} path="/products" />
      <Route element={storeRoute(<ProductDetail />)} path="/products/:slug" />
      <Route element={storeRoute(<Cart />)} path="/cart" />
      <Route
        element={
          <ProtectedRoute deniedTo="/admin/dashboard" policy={CLIENT_ROUTE_POLICIES.checkout}>
            {storeRoute(<Checkout />)}
          </ProtectedRoute>
        }
        path="/checkout"
      />
      <Route element={storeRoute(<PaymentSuccess />)} path="/payment/success" />
      <Route element={storeRoute(<PaymentFailed />)} path="/payment/failed" />
      <Route
        element={
          <GuestRoute>
            {storeRoute(<Login />)}
          </GuestRoute>
        }
        path="/login"
      />
      <Route
        element={
          <GuestRoute>
            {storeRoute(<Register />)}
          </GuestRoute>
        }
        path="/register"
      />
      <Route element={storeRoute(<WishlistPage />)} path="/wishlist" />
      <Route
        element={
          <ProtectedRoute deniedTo="/admin/dashboard" policy={CLIENT_ROUTE_POLICIES.account}>
            {storeRoute(<ProfileLayout />)}
          </ProtectedRoute>
        }
        path="/profile"
      >
        <Route index element={storeRoute(<ProfileOverview />)} />
        <Route element={storeRoute(<ProfileOrders />)} path="orders" />
        <Route element={storeRoute(<ProfileOrderDetail />)} path="orders/:id" />
        <Route element={storeRoute(<ProfileSettings />)} path="settings" />
      </Route>

      <Route
        element={
          <GuestRoute>
            {adminRoute(<AdminLogin />)}
          </GuestRoute>
        }
        path="/admin/login"
      />
      <Route
        element={
          <StaffRoute policy={ADMIN_ROUTE_POLICIES.root}>
            {adminRoute(<AdminLayout />)}
          </StaffRoute>
        }
        path="/admin"
      >
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route element={withStaffRoute(<Dashboard />, ADMIN_ROUTE_POLICIES.dashboard)} path="dashboard" />
        <Route element={withStaffRoute(<Categories />, ADMIN_ROUTE_POLICIES.categories)} path="categories" />
        <Route element={withStaffRoute(<Brands />, ADMIN_ROUTE_POLICIES.brands)} path="brands" />
        <Route element={withStaffRoute(<AdminProducts />, ADMIN_ROUTE_POLICIES.products)} path="products" />
        <Route element={withStaffRoute(<Variants />, ADMIN_ROUTE_POLICIES.variants)} path="variants" />
        <Route element={withStaffRoute(<Media />, ADMIN_ROUTE_POLICIES.media)} path="media" />
        <Route element={withAdminRoute(<Users />, ADMIN_ROUTE_POLICIES.users)} path="users" />
        <Route element={withAdminRoute(<Staff />, ADMIN_ROUTE_POLICIES.staff)} path="staff" />
        <Route element={withAdminRoute(<Roles />, ADMIN_ROUTE_POLICIES.roles)} path="roles" />
        <Route element={withStaffRoute(<Orders />, ADMIN_ROUTE_POLICIES.orders)} path="orders" />
        <Route element={withStaffRoute(<Warehouse />, ADMIN_ROUTE_POLICIES.warehouse)} path="warehouse" />
        <Route element={withStaffRoute(<Coupons />, ADMIN_ROUTE_POLICIES.coupons)} path="coupons" />
        <Route element={withStaffRoute(<Revenue />, ADMIN_ROUTE_POLICIES.revenue)} path="reports/revenue" />
        <Route element={withStaffRoute(<BestSellers />, ADMIN_ROUTE_POLICIES.bestSellers)} path="reports/best-sellers" />
        <Route element={withStaffRoute(<ActivityLog />, ADMIN_ROUTE_POLICIES.activityLogs)} path="reports/activity" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default AppRoutes;
