import { motion } from "framer-motion";
import Container from "../../../components/shared/Container";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./HeroSection.scss";

export default function HeroSection() {
  const { t } = useLanguage();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const heroLeafVariants = {
    hidden: { opacity: 0, scale: 0.85, rotate: -8 },
    visible: {
      opacity: 0.85,
      scale: 1,
      rotate: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="review-hero-section">
      {/* Leaf Background Illustration Elements */}
      <motion.div
        className="hero-leaf-vector vector-left"
        variants={heroLeafVariants}
        initial="hidden"
        animate="visible"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80 C 40 100, 70 80, 100 120 C 120 140, 150 120, 180 150" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 90 C 20 60, 60 40, 70 80 C 80 120, 50 140, 40 90 Z" fill="rgba(212, 175, 55, 0.08)" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="2" />
          <path d="M100 120 C 80 90, 110 70, 130 100 C 150 130, 120 150, 100 120 Z" fill="rgba(212, 175, 55, 0.08)" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="2" />
          <path d="M140 130 C 130 110, 160 90, 170 120 C 180 140, 150 150, 140 130 Z" fill="rgba(212, 175, 55, 0.05)" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      <Container>
        <div className="hero-text-wrap">
          <motion.span
            className="hero-tagline"
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{ duration: 1 }}
          >
            {t("reviewPage.heroTagline", "Tradition and Purity")}
          </motion.span>
          <motion.h1
            className="hero-headline"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            {t("reviewPage.heroTitle", "Your Feedback To Us Is Precious...")}
          </motion.h1>
          <motion.p
            className="hero-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t("reviewPage.heroSubtitle", "Your experience in our journey of purity enriches our legacy.")}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
