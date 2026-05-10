import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import App from "./App";
import { CartProvider } from "./cart";
import { GlobalErrorBoundary } from "./components/ui/feedback";
import { ToastProvider } from "./components/ui/toast";
import { installGlobalErrorTracking } from "./monitoring";
import { WishlistProvider } from "./wishlist";
import "./styles/index.css";

installGlobalErrorTracking();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  </StrictMode>,
);
