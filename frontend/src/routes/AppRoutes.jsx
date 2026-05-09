import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/client/Home";
import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import Login from "../pages/client/Login";
import ProductDetail from "../pages/client/ProductDetail";
import ProductListingPage from "../pages/client/ProductListingPage";
import Register from "../pages/client/Register";
import WishlistPage from "../pages/client/WishlistPage";
import ActivityLog from "../pages/admin/ActivityLog";
import AdminLogin from "../pages/admin/AdminLogin";
import BestSellers from "../pages/admin/BestSellers";
import Brands from "../pages/admin/Brands";
import Categories from "../pages/admin/Categories";
import Coupons from "../pages/admin/Coupons";
import Dashboard from "../pages/admin/Dashboard";
import Media from "../pages/admin/Media";
import Orders from "../pages/admin/Orders";
import AdminProducts from "../pages/admin/Products";
import Revenue from "../pages/admin/Revenue";
import Roles from "../pages/admin/Roles";
import Staff from "../pages/admin/Staff";
import Users from "../pages/admin/Users";
import Variants from "../pages/admin/Variants";
import Warehouse from "../pages/admin/Warehouse";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<ProductListingPage />} path="/products" />
      <Route element={<ProductDetail />} path="/products/:slug" />
      <Route element={<Cart />} path="/cart" />
      <Route element={<Checkout />} path="/checkout" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<WishlistPage />} path="/wishlist" />

      <Route element={<AdminLogin />} path="/admin/login" />
      <Route element={<AdminLayout />} path="/admin">
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route element={<Dashboard />} path="dashboard" />
        <Route element={<Categories />} path="categories" />
        <Route element={<Brands />} path="brands" />
        <Route element={<AdminProducts />} path="products" />
        <Route element={<Variants />} path="variants" />
        <Route element={<Media />} path="media" />
        <Route element={<Users />} path="users" />
        <Route element={<Staff />} path="staff" />
        <Route element={<Roles />} path="roles" />
        <Route element={<Orders />} path="orders" />
        <Route element={<Warehouse />} path="warehouse" />
        <Route element={<Coupons />} path="coupons" />
        <Route element={<Revenue />} path="reports/revenue" />
        <Route element={<BestSellers />} path="reports/best-sellers" />
        <Route element={<ActivityLog />} path="reports/activity" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default AppRoutes;
