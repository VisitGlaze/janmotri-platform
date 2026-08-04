import { HashRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
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