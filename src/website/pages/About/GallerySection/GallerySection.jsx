import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import SectionTitle from "../../../components/shared/SectionTitle";
import GalleryCard from "../../../components/shared/GalleryCard";
import "./GallerySection.scss";

const GallerySection = () => {
  const { t, getImage } = useLanguage();
  const { subtitle, title, linkText, items } = aboutData.gallery;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="about-gallery-section about-section-padding">
      <Container>
        <div className="gallery-header-wrap">
          <SectionTitle subtitle={t("about.gallery.subtitle", subtitle)} title={t("about.gallery.title", title)} />

          {/* <a href="#/gallery" className="gallery-view-all-link">
            {t("common.viewAll", linkText)} <span className="arrow">→</span>
          </a> */}
        </div>

        <motion.div
          className="gallery-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`gallery-grid-item gallery-item-${index}`}
            >
              <GalleryCard image={getImage(item.imageKey)} title={t(`about.gallery.items.${index}`, item.title)} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default GallerySection;
