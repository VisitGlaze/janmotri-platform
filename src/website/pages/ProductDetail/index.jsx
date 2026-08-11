import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Container from "../../components/shared/Container";
import ProductMainSection from "./ProductMainSection/ProductMainSection";
import ProductSpecsSection from "./ProductSpecsSection/ProductSpecsSection";
import ProductTestimonialsSection from "./ProductTestimonialsSection/ProductTestimonialsSection";
import { productsData } from "../../../shared/productData";
import { useLanguage } from "../../../shared/LanguageContext";
import { motion } from "framer-motion";
import "./ProductDetail.scss";

const instaPostsKeys = ["insta1", "insta2", "insta3", "insta4", "insta5", "insta6"];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();

  // Fetch active product from data array
  const product = productsData.find((p) => p.id === parseInt(id, 10));

  // Reset scroll position on product load/change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle case where product is not found
  useEffect(() => {
    if (!product && productsData.length > 0) {
      navigate("/products");
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="product-not-found">
        <Navbar />
        <Container>
          <div className="error-card">
            <h2>{t("productDetail.notFound", "Product Not Found")}</h2>
            <button onClick={() => navigate("/products")}>{t("productDetail.backProducts", "Back to Products")}</button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div className="product-detail-page-root">
      <Navbar />

      <main className="product-detail-main-content">

        {/* Main Product Showcase Section */}
        <ProductMainSection product={product} />

        {/* Specifications & Dates Section */}
        <ProductSpecsSection product={product} />

        {/* Testimonials Carousel Section */}
        <ProductTestimonialsSection />

        {/* ── INSTAGRAM FEEDS ── */}
        {/* <section className="product-instagram-section">
          <Container>
            <div className="insta-header-bar">
              <div>
                <span className="insta-sec-eyebrow">{t("productDetail.connectUs", "Connect With Us")}</span>
                <h2 className="insta-heading">{t("footer.followInstagram", "Follow us on Instagram")}</h2>
              </div>
              <a
                href="https://www.instagram.com/janmotri_oil/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-handle-badge"
              >
                @janmotri_oil
                <span className="verify-badge pi pi-verified"></span>
              </a>
            </div>

            <motion.div
              className="insta-posts-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {instaPostsKeys.map((key, idx) => (
                <motion.a
                  key={key}
                  href="https://www.instagram.com/janmotri_oil/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-post-card"
                  variants={fadeUpVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="post-image-container">
                    <img
                      src={getImage(key)}
                      alt={`Instagram Post ${idx + 1}`}
                      className="post-img"
                    />
                    <div className="post-overlay-glow" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </Container>
        </section> */}

      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
