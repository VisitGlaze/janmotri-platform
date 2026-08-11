import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./website/pages/Home";
import About from "./website/pages/About";
import Review from "./website/pages/Review";
import FAQ from "./website/pages/FAQ";
import Contact from "./website/pages/Contact";
import Products from "./website/pages/Products";
import ProductDetail from "./website/pages/ProductDetail";
import Checkout from "./website/pages/Checkout";
import Account from "./website/pages/Account";
import OrderTracking from "./website/pages/OrderTracking";
import AdminLayout from "./admin/AdminLayout";
import CursorEffects from "./website/components/shared/CursorEffects";
import CustomCursor from "./website/components/shared/CustomCursor";
import ScrollToTop from "./website/components/shared/ScrollToTop";
import FloatingWhatsapp from "./website/components/shared/FloatingWhatsapp";
import Login from "./website/pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions/TermsConditions";
import ReturnReplacementPolicy from "./pages/ReturnReplacementPolicy/ReturnReplacementPolicy";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";

// Disable browser scroll restoration. Without this, Chrome restores the
// previous body.scrollTop AFTER React mounts, conflicting with ScrollRestorer.
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

// Scrolls to top on every client-side route change.
// Must be inside <Router> to access useLocation.
const ScrollRestorer = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollRestorer />
      <CustomCursor />
      <CursorEffects />
      <ScrollToTop />
      <FloatingWhatsapp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/review" element={<Review />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/return-replacement-policy" element={<ReturnReplacementPolicy />} />
        <Route path="/refund-policy" element={<ReturnReplacementPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>

  );
}

export default App;