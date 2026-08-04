import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../../../../../shared/productData";
import { useLanguage } from "../../../../../shared/LanguageContext";
import "./ProductsSection.scss";

export default function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState(2);
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();

  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef(null);

  // Setup intersection observer and reduced motion detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const motionHandler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", motionHandler);
    };
  }, []);

  const marqueeItems = [
    t("home.productsSec.marquee.0", "Janmotri Groundnut Oil"),
    t("home.productsSec.marquee.1", "Pure Groundnut Oil"),
    t("home.productsSec.marquee.2", "Chemical-Free"),
    t("home.productsSec.marquee.3", "Traditional Oil"),
    t("home.productsSec.marquee.4", "Healthy Choice"),
  ];

  // Incremental staggered delays mapping (0ms, 120ms, 270ms, 450ms...)
  const delayMap = [0, 120, 270, 450, 660, 900];

  const handleCardMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Soft tilt: max 6deg rotation relative to center coordinates
    const rotateX = ((centerY - y) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * -6; // opposite direction for intuitive tilt

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    card.style.boxShadow = "0 20px 40px rgba(239, 32, 39, 0.08), 0 6px 15px rgba(0, 0, 0, 0.03)";
    card.style.borderColor = "rgba(239, 32, 39, 0.15)";
    card.style.transition = "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  const handleCardMouseLeave = (e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    card.style.transform = "";
    card.style.boxShadow = "";
    card.style.borderColor = "";
    card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  const getCardAnimStyle = (index) => {
    // If accessibility option wants reduced motion, bypass movement offsets
    if (prefersReducedMotion) {
      return {
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease",
      };
    }

    if (!inView) {
      // Rotate -1.5deg or 1.5deg for organic settling feel
      const rot = index % 2 === 0 ? 1.5 : -1.5;
      return {
        opacity: 0,
        transform: `translateY(45px) scale(0.95) rotate(${rot}deg)`,
      };
    }

    const delay = delayMap[index] || index * 200;
    return {
      opacity: 1,
      transform: "translateY(0px) scale(1) rotate(0deg)",
      transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    };
  };

  return (
    <section className="product-section" ref={sectionRef}>

      {/* Section Header */}
      <div className="section-header">
        <h3 className="section-title">
          {t("home.productsSec.title", "Just One Order Can Change\n Your Experience For The Better...")}
        </h3>
        <div className="title-divider"></div>
      </div>

      {/* Products Zig-Zag Grid */}
      <div className="products-grid">
        {productsData.map((product, index) => {
          const isActive = activeProduct === product.id;
          const positionClass = product.id % 2 === 0 ? "down-card" : "up-card";

          return (
            <div
              key={product.id}
              onClick={() => {
                setActiveProduct(product.id);
                navigate(`/product/${product.id}`);
              }}
              style={getCardAnimStyle(index)}
              className={`product-card-wrapper ${isActive ? "active" : ""} ${positionClass}`}
            >
              {/* Vertical Rounded Card with tactile magnetic tilt */}
              <div
                className="product-card-container"
                style={{ transformStyle: "preserve-3d" }}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="product-image-wrap">
                  <img
                    src={getImage(product.imageKey)}
                    alt={t(`productsPage.productsList.p${product.id}.name`, product.name)}
                    className="product-img"
                  />
                </div>
              </div>

              {/* Product Name Caption (Placed below the card) */}
              <h4 className="product-name">
                {t(`productsPage.productsList.p${product.id}.shortName`, product.shortName)}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Bottom Marquee Strip */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={index} className="marquee-item">
              <img src={getImage("peanut")} alt="Peanut" className="peanut-img" width={70} />
              {item}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}