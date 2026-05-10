import { lazy } from "react";
import { routeLoaders } from "./routeLoaders";

function lazyWithPreload(loader) {
  const Component = lazy(loader);

  Component.preload = loader;
  return Component;
}

export const Home = lazyWithPreload(routeLoaders.home);
export const ProductListingPage = lazyWithPreload(routeLoaders.products);
export const ProductDetail = lazyWithPreload(routeLoaders.productDetail);
export const Cart = lazyWithPreload(routeLoaders.cart);
export const Checkout = lazyWithPreload(routeLoaders.checkout);
export const PaymentFailed = lazyWithPreload(routeLoaders.paymentFailed);
export const PaymentSuccess = lazyWithPreload(routeLoaders.paymentSuccess);
export const Login = lazyWithPreload(routeLoaders.login);
export const Register = lazyWithPreload(routeLoaders.register);
export const WishlistPage = lazyWithPreload(routeLoaders.wishlist);
export const ProfileLayout = lazyWithPreload(routeLoaders.profileLayout);
export const ProfileOverview = lazyWithPreload(routeLoaders.profileOverview);
export const ProfileOrders = lazyWithPreload(routeLoaders.profileOrders);
export const ProfileOrderDetail = lazyWithPreload(routeLoaders.profileOrderDetail);
export const ProfileSettings = lazyWithPreload(routeLoaders.profileSettings);

export const AdminLayout = lazyWithPreload(routeLoaders.adminLayout);
export const AdminLogin = lazyWithPreload(routeLoaders.adminLogin);
export const Dashboard = lazyWithPreload(routeLoaders.dashboard);
export const Categories = lazyWithPreload(routeLoaders.categories);
export const Brands = lazyWithPreload(routeLoaders.brands);
export const AdminProducts = lazyWithPreload(routeLoaders.adminProducts);
export const Variants = lazyWithPreload(routeLoaders.variants);
export const Media = lazyWithPreload(routeLoaders.media);
export const Users = lazyWithPreload(routeLoaders.users);
export const Staff = lazyWithPreload(routeLoaders.staff);
export const Roles = lazyWithPreload(routeLoaders.roles);
export const Orders = lazyWithPreload(routeLoaders.orders);
export const Warehouse = lazyWithPreload(routeLoaders.warehouse);
export const Coupons = lazyWithPreload(routeLoaders.coupons);
export const Revenue = lazyWithPreload(routeLoaders.revenue);
export const BestSellers = lazyWithPreload(routeLoaders.bestSellers);
export const ActivityLog = lazyWithPreload(routeLoaders.activityLog);
