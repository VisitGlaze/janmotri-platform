import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import SectionTitle from "../../../components/shared/SectionTitle";
import { Tag } from "primereact/tag";
import "./PromiseSection.scss";

const PromiseSection = () => {
  const { t } = useLanguage();
  const { subtitle, title, cards } = aboutData.promise;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="about-promise about-section-padding">
      <Container>
        <SectionTitle subtitle={t("about.promise.subtitle", subtitle)} title={t("about.promise.title", title)} centered />
        
        <motion.div 
          className="promise-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              className="promise-card-wrapper"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="promise-card">
                <div className="promise-card-header">
                  <div className="promise-card-icon-container">
                    <span className="promise-card-icon">{card.icon}</span>
                  </div>
                  <Tag value={t(`about.promise.cards.${index}.tag`, card.tag)} severity={card.severity} className="promise-card-tag" />
                </div>
                <h3 className="promise-card-title">{t(`about.promise.cards.${index}.title`, card.title)}</h3>
                <p className="promise-card-desc">{t(`about.promise.cards.${index}.desc`, card.desc)}</p>
                <div className="promise-card-glow" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default PromiseSection;
