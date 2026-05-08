import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import ActivityLog from "./pages/admin/ActivityLog";
import BestSellers from "./pages/admin/BestSellers";
import Brands from "./pages/admin/Brands";
import Categories from "./pages/admin/Categories";
import Coupons from "./pages/admin/Coupons";
import Dashboard from "./pages/admin/Dashboard";
import Media from "./pages/admin/Media";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Revenue from "./pages/admin/Revenue";
import Roles from "./pages/admin/Roles";
import Staff from "./pages/admin/Staff";
import Users from "./pages/admin/Users";
import Variants from "./pages/admin/Variants";
import Warehouse from "./pages/admin/Warehouse";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />

      <Route element={<AdminLayout />} path="/admin">
        <Route index element={<Dashboard />} />
        <Route element={<Categories />} path="categories" />
        <Route element={<Brands />} path="brands" />
        <Route element={<Products />} path="products" />
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

export default App;
