import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../admin/layouts";
import {
  ActivityLog,
  AdminLogin,
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
} from "../admin/pages";
import { ADMIN_ROUTE_POLICIES, CLIENT_ROUTE_POLICIES } from "../auth/roleHelpers";
import AdminRoute from "../guards/AdminRoute";
import GuestRoute from "../guards/GuestRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import StaffRoute from "../guards/StaffRoute";
import ProfileLayout from "../components/account/ProfileLayout";
import Home from "../pages/client/Home";
import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import Login from "../pages/client/Login";
import ProfileOrders from "../pages/client/ProfileOrders";
import ProfileOverview from "../pages/client/ProfileOverview";
import ProfileSettings from "../pages/client/ProfileSettings";
import ProductDetail from "../pages/client/ProductDetail";
import ProductListingPage from "../pages/client/ProductListingPage";
import Register from "../pages/client/Register";
import WishlistPage from "../pages/client/WishlistPage";

const withStaffRoute = (element, policy) => <StaffRoute policy={policy}>{element}</StaffRoute>;
const withAdminRoute = (element, policy) => <AdminRoute policy={policy}>{element}</AdminRoute>;

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<ProductListingPage />} path="/products" />
      <Route element={<ProductDetail />} path="/products/:slug" />
      <Route element={<Cart />} path="/cart" />
      <Route
        element={
          <ProtectedRoute deniedTo="/admin/dashboard" policy={CLIENT_ROUTE_POLICIES.checkout}>
            <Checkout />
          </ProtectedRoute>
        }
        path="/checkout"
      />
      <Route
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
        path="/login"
      />
      <Route
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
        path="/register"
      />
      <Route element={<WishlistPage />} path="/wishlist" />
      <Route
        element={
          <ProtectedRoute deniedTo="/admin/dashboard" policy={CLIENT_ROUTE_POLICIES.account}>
            <ProfileLayout />
          </ProtectedRoute>
        }
        path="/profile"
      >
        <Route index element={<ProfileOverview />} />
        <Route element={<ProfileOrders />} path="orders" />
        <Route element={<ProfileSettings />} path="settings" />
      </Route>

      <Route
        element={
          <GuestRoute>
            <AdminLogin />
          </GuestRoute>
        }
        path="/admin/login"
      />
      <Route
        element={
          <StaffRoute policy={ADMIN_ROUTE_POLICIES.root}>
            <AdminLayout />
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
