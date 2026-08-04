import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import SectionTitle from "../../../components/shared/SectionTitle";
import "./JourneySection.scss";

const JourneySection = () => {
  const { t, getImage } = useLanguage();
  const { subtitle, title, description, imageKey } = aboutData.journey;

  const textVariants = {
    hidden: { opacity: 0, x: -35 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96, x: 35 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const bulletVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const rawDesc = t("about.journey.desc", description);
  const dropCap = rawDesc.charAt(0);
  const slicedDesc = rawDesc.slice(1);

  return (
    <section className="about-journey about-section-padding">
      <Container>
        <div className="journey-grid">
          
          {/* Left Text Column */}
          <motion.div 
            className="journey-text-col"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <SectionTitle subtitle={t("about.journey.subtitle", subtitle)} title={t("about.journey.title", title)} />
            
            {/* Paragraph with stylized drop-cap starting character */}
            <p className="journey-paragraph">
              <span className="drop-cap">{dropCap}</span>
              {slicedDesc}
            </p>

            {/* Heritage visual bullets */}
            <div className="journey-heritage-bullets">
              <motion.div className="bullet-item" variants={bulletVariants}>
                <div className="bullet-icon-box">🏺</div>
                <div className="bullet-text">
                  <h5>{t("about.journey.bullet1Title", "Lakdi Ghani Extraction")}</h5>
                  <p>{t("about.journey.bullet1Desc", "Keeping temperatures naturally low to lock in nutrition.")}</p>
                </div>
              </motion.div>
              <motion.div className="bullet-item" variants={bulletVariants}>
                <div className="bullet-icon-box">🌾</div>
                <div className="bullet-text">
                  <h5>{t("about.journey.bullet2Title", "Organic Sourcing")}</h5>
                  <p>{t("about.journey.bullet2Desc", "Selected groundnuts from farmers in Saurashtra.")}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Image Column with Legacy Overlay */}
          <motion.div 
            className="journey-image-col"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="journey-img-frame">
              {/* Outer decorative gold dashed border lines */}
              <div className="journey-frame-line"></div>
              
              <div className="journey-img-card">
                <img src={getImage(imageKey)} alt="Heritage Farming" className="journey-photo" />
                
                {/* Floating Luxury Legacy Seal Badge */}
                <div className="journey-legacy-badge">
                  <div className="badge-inner">
                    <span className="badge-highlight">{t("about.journey.sealPure", "100% Pure")}</span>
                    <span className="badge-text">{t("about.journey.sealLegacy", "Ancestor Legacy")}</span>
                  </div>
                  <div className="badge-glow-ring"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </Container>
    </section>
  );
};

export default JourneySection;
