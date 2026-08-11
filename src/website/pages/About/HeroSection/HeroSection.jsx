import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./HeroSection.scss";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();
  const title = t("about.hero.title", aboutData.hero.title);
  const subtitle = t("about.hero.subtitle", aboutData.hero.subtitle);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="about-hero" style={{ backgroundImage: `url(${getImage("aboutUsHeroBg")})` }}>
      {/* Immersive blur overlay backdrop and texture */}
      <div className="about-hero-overlay"></div>
      <div className="about-hero-texture"></div>

      <Container className="about-hero-container">
        <motion.div
          className="about-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Heading */}
          <motion.h1
            className="about-hero-title"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="about-hero-subtitle"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>

          {/* Contact Us CTA Button */}
          <motion.div
            className="about-hero-cta-wrap"
            variants={itemVariants}
          >
            <button
              type="button"
              className="about-hero-contact-btn"
              onClick={() => {
                navigate("/contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span>{t("common.contactUsBtn", "Contact Us")}</span>
              <span className="arrow-icon-circle">
                <i className="pi pi-arrow-right" />
              </span>
            </button>
          </motion.div>

          {/* Premium Scroll Down Indicator */}
          <motion.div
            className="about-hero-scroll-btn"
            variants={itemVariants}
            onClick={() => {
              const element = document.querySelector(".about-story");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <div className="mouse-wheel-wrap">
              <span className="wheel-dot"></span>
            </div>
            <span className="scroll-btn-label">{t("about.hero.scroll", "SCROLL TO DISCOVER")}</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HeroSection;
