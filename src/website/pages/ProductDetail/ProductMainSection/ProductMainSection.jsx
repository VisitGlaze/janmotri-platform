import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../../shared/useCartStore";
import { productsData } from "../../../../shared/productData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./ProductMainSection.scss";

export default function ProductMainSection({ product }) {
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = cart.find(item => item.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const [quantity, setQuantity] = useState(qtyInCart || 1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Sync details page counter state when item in cart changes
  useEffect(() => {
    if (qtyInCart > 0) {
      setQuantity(qtyInCart);
    }
  }, [qtyInCart]);

  const incrementQty = () => {
    if (quantity < product.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      if (qtyInCart > 0) {
        updateQuantity(product.id, newQty);
      }
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (qtyInCart > 0) {
        updateQuantity(product.id, newQty);
      }
    }
  };

  const handleAddToCart = () => {
    if (qtyInCart === 0) {
      addToCart(product, quantity);
    }
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3500);
  };

  const handleBuyNow = () => {
    if (qtyInCart === 0) {
      addToCart(product, quantity);
    }
    navigate("/checkout");
  };

  // Badges array with corresponding PrimeIcons and colors
  const purityBadges = [
    { label: t("home.hero.pure100", "100% Pure"), icon: "pi-verified", colorClass: "badge-green" },
    { label: t("productDetail.badges.filtered", "Filtered Natural Oil"), icon: "pi-filter", colorClass: "badge-blue" },
    { label: t("productDetail.badges.cholesterol", "Cholesterol Free"), icon: "pi-heart", colorClass: "badge-red" },
    { label: t("productDetail.badges.noConfusion", "Without Confusion"), icon: "pi-shield", colorClass: "badge-purple" },
    { label: t("productDetail.badges.noFlavors", "Without Artificial Flavors"), icon: "pi-star", colorClass: "badge-gold" },
    { label: t("productDetail.badges.chemicalFree", "Chemical Free"), icon: "pi-ban", colorClass: "badge-teal" },
  ];

  return (
    <section className="product-main-section">
      <Container>
        <div className="product-main-layout">

          {/* LEFT: Image Gallery & Thumbnails */}
          <div className="product-media-column">
            {/* Main Image View */}
            <div className="main-image-display-card">
              <span className="instock-badge">
                <i className="pi pi-check mr-1" />
                {t("productDetail.inStock", "In Stock")}
              </span>
              <img
                src={getImage(product.imageKey)}
                alt={t("productsPage.productsList.p" + product.id + ".name", product.name)}
                className="main-display-img"
              />
            </div>

            {/* Thumbnails List */}
            <div className="product-thumbnails-grid">
              {productsData.map((otherProd) => {
                const isSelected = otherProd.id === product.id;
                return (
                  <button
                    key={otherProd.id}
                    className={`thumbnail-btn-card ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setQuantity(1);
                      navigate(`/product/${otherProd.id}`);
                    }}
                    aria-label={`View ${t("productsPage.productsList.p" + otherProd.id + ".shortName", otherProd.shortName)}`}
                  >
                    <img
                      src={getImage(otherProd.imageKey)}
                      alt={t("productsPage.productsList.p" + otherProd.id + ".shortName", otherProd.shortName)}
                      className="thumbnail-img"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Product Buy Details */}
          <div className="product-info-column">

            {/* Title */}
            <h1 className="product-details-title">
              {t("productsPage.productsList.p" + product.id + ".name", product.name)}
            </h1>

            {/* Price Row */}
            <div className="price-details-container">
              <span className="price-val-active">₹ {product.price}/-</span>
              {/* <span className="price-val-original">₹ {product.originalPrice}.00</span> */}
              {/* <span className="price-val-discount">
                {product.discount.replace("OFF", t("common.off", "OFF"))}
              </span> */}
            </div>

            {/* Stock status indicator */}
            {/* <div className="stock-status-row">
              <span className="pi pi-check-circle stock-check-symbol" />
              <span className="stock-text-status">
                {t("productDetail.stockAvailable", "Stock available:")} <strong className="units-count">{product.stock} {t("productDetail.units", "units")}</strong>
              </span>
            </div> */}

            {/* Quantity Selector Counter */}
            {/* <div className="qty-selector-group">
              <span className="qty-label">{t("productDetail.quantity", "Quantity")}</span>
              <div className="qty-counter-input-wrap">
                <button
                  className="counter-btn minus"
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <i className="pi pi-minus" />
                </button>
                <span className="counter-val">{quantity}</span>
                <button
                  className="counter-btn plus"
                  onClick={incrementQty}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <i className="pi pi-plus" />
                </button>
              </div>
            </div> */}

            {/* Action Buttons Group (Inquiry & Call) */}
            <div className="product-quick-actions-group">
              <a
                href="https://wa.me/919081619797"
                target="_blank"
                rel="noopener noreferrer"
                className="product-action-btn btn-inquiry"
              >
                <i className="pi pi-whatsapp mr-2" />
                <span>{t("common.inquiry", "Inquiry")}</span>
              </a>

              <a
                href="tel:+919099908309"
                className="product-action-btn btn-call"
              >
                <i className="pi pi-phone mr-2" />
                <span>{t("common.call", "Call")}</span>
              </a>
            </div>

            {/* Succesful Cart Adding Alert */}
            <AnimatePresence>
              {addedMessage && (
                <motion.div
                  className="cart-success-badge-alert"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <i className="pi pi-shopping-cart mr-2" />
                  {t("productDetail.addedMessage", "Successfully added {quantity} unit(s) of {shortName} to your Cart!")
                    .replace("{quantity}", quantity)
                    .replace("{shortName}", t("productsPage.productsList.p" + product.id + ".shortName", product.shortName))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="details-sec-divider" />

            {/* Purity Badges Grid Showcase */}
            <div className="purity-badges-showcase">
              {purityBadges.map((badge, index) => (
                <div key={index} className={`purity-badge-card ${badge.colorClass}`}>
                  <span className={`badge-symbol pi ${badge.icon}`} />
                  <span className="badge-text-title">{badge.label}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
