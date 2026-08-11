import { motion } from "framer-motion";
import Container from "../../../components/shared/Container";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./HeroSection.scss";

export default function HeroSection() {
  const { t, getImage } = useLanguage();
  
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="products-hero-section" style={{ backgroundImage: `url(${getImage("farmBg")})` }}>
      <div className="hero-bg-overlay" />
      <Container>
        <div className="hero-text-wrap">
          <motion.h1 
            className="hero-headline"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            {t("common.products", "Products")}
          </motion.h1>
          <motion.p 
            className="hero-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t("productsPage.subtitle", "Janmotri: Confluence of purity and taste. Straight from the farm to your kitchen.")}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
