import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";

function ClientLayout({ children }) {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
