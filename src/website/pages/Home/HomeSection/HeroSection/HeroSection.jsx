import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../../shared/LanguageContext";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./HeroSection.scss";

// Senior animation enhancement - Hero Parallax and Tactile Tilts

const HeroSection = () => {
  const navigate = useNavigate();
  const { language, t, getImage } = useLanguage();

  const handleExploreClick = () => {
    navigate("/products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Coords for responsive hover parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-fidelity spring response
  const springX = useSpring(x, { stiffness: 90, damping: 22 });
  const springY = useSpring(y, { stiffness: 90, damping: 22 });

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);

    const checkMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    checkMotion();

    return () => {
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  const handleMouseMove = (e) => {
    // Skip if on mobile or reduced-motion is requested
    if (isMobile || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();

    // Normalize position relative to center of element
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Limit displacement to sub-pixel levels: max 12px for premium response
    x.set(normX * 24);
    y.set(normY * 24);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      className={`hero-section lang-${language}`}
      lang={language}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layer */}
      <div
        className="hero-bg-layer"
        style={{ backgroundImage: `url(${getImage("heroBg")})` }}
      />

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Main Content */}
      <div className="container">
        <div className="hero-content">

          {/* Welcome Text + Burst */}
          <div className="welcome-wrapper">
            <p className="welcome-text">
              {t("home.hero.welcome", "Welcome to")}
              <br />
              {t("home.hero.groundnut", "Janmotri Groundnut")}&nbsp;<span>{t("home.hero.oil", "Oil")}</span>
            </p>

            <img
              src={getImage("burst")}
              alt="Burst"
              className="burst-image"
            />
          </div>

          {/* Main Heading */}
          <h1>{t("home.hero.title", "Pure & Natural Groundnut Oil")}</h1>

          {/* CTA Button */}
          <div className="hero-btn-wrapper">
            <button className="hero-btn" onClick={handleExploreClick} type="button">
              <span>{t("common.exploreProducts", "Explore Products")}</span>

              <div className="arrow-circle">
                →
              </div>
            </button>
          </div>
        </div>

        {/* Product Image Bundle with Spring Parallax */}
        <motion.div
          className="hero-image"
          style={{ x: springX, y: springY, cursor: "pointer" }}
          onClick={handleExploreClick}
        >
          <img
            src={getImage("heroProducts")}
            alt="Janmotri Products"
          />
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="bottom-strip">
        <img
          src={getImage("divider")}
          alt="divider"
          className="divider-image"
        />

        <div className="bottom-text">
          <span>{t("home.hero.pure100", "100% Pure")}</span>
          <span>•</span>
          <span>{t("home.hero.healthyChoice", "Healthy Choice")}</span>
          <span>•</span>
          <span>{t("home.hero.traditionalOil", "Traditional Oil")}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;