import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import SectionTitle from "../../../components/shared/SectionTitle";
import "./StorySection.scss";

const StorySection = () => {
  const { t } = useLanguage();
  const { title, quote, description1, description2 } = aboutData.story;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="about-story about-section-padding">
      {/* Premium organic abstract background blobs */}
      <div className="story-blob-decor blob-1"></div>
      <div className="story-blob-decor blob-2"></div>

      <Container>
        <div className="story-header-wrap">
          <SectionTitle subtitle={t("about.story.heritage", "OUR HERITAGE")} title={t("about.story.title", title)} centered />
        </div>

        <motion.div
          className="story-grid-layout"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column: Testimonial-Style Quote Card */}
          <motion.div className="story-quote-column" variants={leftColumnVariants}>
            <div className="story-quote-card">
              <div className="quote-icon-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M11.19 12.19c0 1.66-1.34 3-3 3-.24 0-.48-.03-.7-.08.38 1.25 1.5 2.13 2.87 2.13.17 0 .34-.01.5-.04l.15 1.26c-.21.05-.43.08-.65.08-2.61 0-4.73-2.12-4.73-4.73 0-2.88 2.06-4.99 4.73-5.26v1.36c-1.57.25-2.73 1.62-2.73 3.28 0 .17.01.34.04.5.22-.05.46-.08.7-.08 1.66 0 3 1.34 3 3zm8.81 0c0 1.66-1.34 3-3 3-.24 0-.48-.03-.7-.08.38 1.25 1.5 2.13 2.87 2.13.17 0 .34-.01.5-.04l.15 1.26c-.21.05-.43.08-.65.08-2.61 0-4.73-2.12-4.73-4.73 0-2.88 2.06-4.99 4.73-5.26v1.36c-1.57.25-2.73 1.62-2.73 3.28 0 .17.01.34.04.5.22-.05.46-.08.7-.08 1.66 0 3 1.34 3 3z" />
                </svg>
              </div>
              <blockquote className="quote-text">
                {t("about.story.quote", quote)}
              </blockquote>
              <div className="quote-divider-line"></div>
              <div className="quote-footer">
                <span className="quote-author-label">{t("about.story.philosophyLabel", "JANMOTRI BRAND PHILOSOPHY")}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative Descriptions */}
          <motion.div className="story-narrative-column" variants={rightColumnVariants}>
            <div className="narrative-text-box">
              <span className="narrative-eyebrow">{t("about.story.essence", "THE ESSENCE OF JANMOTRI")}</span>
              <h3 className="narrative-heading">{t("about.story.traditionModernity", "Tradition Meets Innovation")}</h3>
            </div>

            <div className="narrative-cards-container">
              {/* Narrative Card 1 */}
              <motion.div className="narrative-card" variants={cardVariants}>
                <div className="card-emoji-box">
                  <span className="emoji-symbol">🌱</span>
                </div>
                <div className="card-body-text">
                  <h4 className="card-heading-title">{t("about.story.philosophy", "Our Philosophy")}</h4>
                  <p className="card-paragraph">{t("about.story.desc1", description1)}</p>
                </div>
              </motion.div>

              {/* Narrative Card 2 */}
              <motion.div className="narrative-card" variants={cardVariants}>
                <div className="card-emoji-box">
                  <span className="emoji-symbol">🤝</span>
                </div>
                <div className="card-body-text">
                  <h4 className="card-heading-title">{t("about.story.partnership", "Our Partnership")}</h4>
                  <p className="card-paragraph">{t("about.story.desc2", description2)}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default StorySection;
