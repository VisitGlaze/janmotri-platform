import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import ProductsGridSection from "./ProductsGridSection/ProductsGridSection";
import "./Products.scss";

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="products-page-root">
      <Navbar />

      <main className="products-main-content">
        <HeroSection />

        <ProductsGridSection />

      </main>

      <Footer />
    </div>
  );
};

export default Products;
