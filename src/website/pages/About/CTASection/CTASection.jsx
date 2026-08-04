import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import PrimaryButton from "../../../components/shared/PrimaryButton";
import "./CTASection.scss";

const CTASection = () => {
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();
  const { heading, btnLabel, bgImageKey } = aboutData.cta;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="about-cta">
      <Container className="cta-container">
        <motion.div 
          className="cta-glass-card"
          style={{ backgroundImage: `url(${getImage(bgImageKey)})` }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="cta-card-overlay"></div>
          <div className="cta-card-content">
            <span className="cta-badge">{t("about.cta.badge", "🌟 Pure Experience")}</span>
            <h2 className="cta-heading">{t("about.cta.heading", heading)}</h2>
            
            <div className="cta-btn-wrap">
              <PrimaryButton 
                label={t("common.contactUsBtn", btnLabel)} 
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;
