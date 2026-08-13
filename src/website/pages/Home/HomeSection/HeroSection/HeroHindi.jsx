import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../../shared/LanguageContext";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./HeroSection.scss";

const TRUST_POINTS = ["100% शुद्ध", "स्वस्थ विकल्प", "पारंपरिक तेल"];

const HeroHindi = () => {
  const navigate = useNavigate();
  const { getImage } = useLanguage();

  const handleExploreClick = () => {
    navigate("/products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 90, damping: 22 });
  const springY = useSpring(y, { stiffness: 90, damping: 22 });

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setPrefersReducedMotion(mediaQuery.matches);

    checkViewport();
    checkMotion();

    window.addEventListener("resize", checkViewport);
    mediaQuery.addEventListener("change", checkMotion);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mediaQuery.removeEventListener("change", checkMotion);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normX * 24);
    y.set(normY * 24);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section
      className="hero-section lang-hi"
      lang="hi"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layer */}
      <div
        className="hero-bg-layer"
        style={{ backgroundImage: `url(${getImage("heroBg")})` }}
      />

      {/* Readability scrim */}
      <div className="overlay" />

      <div className="container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="hero-eyebrow">
            जन्मोत्री में आपका स्वागत है
            <img
              src={getImage("burst")}
              alt=""
              aria-hidden="true"
              className="eyebrow-icon"
            />
          </span>

          <h1 className="welcome-text">
            G-20 मूंगफली का <span className="highlight">तेल</span>
          </h1>

          <h2 className="hero-subheading_h2">100% शुद्ध मूंगफली का तेल</h2>

          <div className="hero-btn-wrapper">
            <button className="hero-btn" onClick={handleExploreClick} type="button">
              <span>उत्पाद देखें</span>
              <span className="arrow-circle">→</span>
            </button>
          </div>

          <ul className="trust-row" aria-label="विशेषताएँ">
            {TRUST_POINTS.map((point) => (
              <li className="trust-chip" key={point}>
                <span className="trust-tick" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          style={{ x: springX, y: springY, cursor: "pointer" }}
          onClick={handleExploreClick}
        >
          <div className="hero-image-glow" aria-hidden="true" />
          <img src={getImage("heroProducts")} alt="जन्मोत्री मूंगफली तेल उत्पाद" />
        </motion.div>
      </div>

      {/* Bottom Divider — decorative only */}
      <div className="bottom-strip">
        <img src={getImage("divider")} alt="" aria-hidden="true" className="divider-image" />
      </div>
    </section>
  );
};

export default HeroHindi;
