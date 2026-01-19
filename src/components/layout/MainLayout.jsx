import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="pt-0 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
