import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../../shared/useCartStore";
import { productsData } from "../../../../shared/productData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./ProductsGridSection.scss";

export default function ProductsGridSection() {
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (idx) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: idx * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section className="products-grid-section">
      <Container>
        {/* <h2 className="grid-heading-eyebrow">{t("productsPage.eyebrow", "Pure Lakdi Ghani Wood-Pressed Oils")}</h2> */}

        <div className="products-main-grid">
          {productsData.map((product, idx) => (
            <motion.div
              key={product.id}
              className="product-grid-card-wrap"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={idx}
            >
              {/* Product Card Container */}
              <div
                className="product-card-body-click"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Discount Badge */}
                <div className="product-sale-badge">
                  {product.discount.replace("OFF", t("common.off", "OFF"))}
                </div>

                {/* Elevated Image Container */}
                <div className="product-image-container-wrap">
                  <img
                    src={getImage(product.imageKey)}
                    alt={t("productsPage.productsList.p" + product.id + ".name", product.name)}
                    className="product-grid-img"
                  />
                </div>

                {/* Product Name */}
                <h3 className="product-grid-name">
                  {t("productsPage.productsList.p" + product.id + ".name", product.name)}
                </h3>

                {/* Price Display */}
                <div className="product-grid-price-row">
                  <span className="price-original">₹ {product.originalPrice}/-</span>
                  <span className="price-active">₹ {product.price}/-</span>
                </div>
              </div>

              {/* Quick Action Buttons: Inquiry & Call */}
              <div className="product-card-actions-grid" onClick={(e) => e.stopPropagation()}>
                <a
                  href="https://wa.me/919081619797"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-action-btn btn-inquiry"
                  title="Inquire via WhatsApp"
                >
                  <i className="pi pi-whatsapp mr-1" />
                  <span>{t("common.inquiry", "Inquiry")}</span>
                </a>

                <a
                  href="tel:+919099908309"
                  className="card-action-btn btn-call"
                  title="Call Us"
                >
                  <i className="pi pi-phone mr-1" />
                  <span>{t("common.call", "Call")}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
