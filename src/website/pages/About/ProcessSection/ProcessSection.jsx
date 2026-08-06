import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import SectionTitle from "../../../components/shared/SectionTitle";
import "./ProcessSection.scss";

const ProcessSection = () => {
  const { t, getImage } = useLanguage();
  const { subtitle, title, description, steps } = aboutData.process;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="about-process about-section-padding">
      {/* Editorial Decorative Blobs & Background Geometry */}
      <div className="editorial-bg-circle circle-1" />
      <div className="editorial-bg-circle circle-2" />

      <Container>
        <div className="process-header-container">
          <SectionTitle subtitle={t("about.process.subtitle", subtitle)} title={t("about.process.title", title)} centered />
          <p className="process-intro-narrative">
            {t("about.process.desc", description)}
          </p>
        </div>

        <motion.div
          className="editorial-process-journey"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            const rowVariants = {
              hidden: { opacity: 0, y: 60 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
              }
            };

            return (
              <motion.div
                key={index}
                className={`editorial-row ${isEven ? "row-normal" : "row-reverse"}`}
                variants={rowVariants}
              >
                {/* Backdrop Huge Number Overlay */}
                <div className="huge-step-number-backdrop">
                  {step.step}
                </div>

                {/* Left/Right Image Section (Large, Cover, Framed) */}
                <div className="editorial-image-column">
                  <div className="editorial-image-frame">
                    <img
                      src={getImage(step.imageKey)}
                      alt={t(`about.process.steps.${index}.title`, step.title)}
                      className="editorial-photo"
                      loading="lazy"
                    />
                    <div className="editorial-photo-overlay" />

                    {/* Tiny gold badge floating on image */}
                    <div className="editorial-float-badge">
                      <span className="float-badge-dot" />
                      {step.step}
                    </div>
                  </div>
                </div>

                {/* Left/Right Overlapping Glass Card */}
                <div className="editorial-content-column">
                  <div className="editorial-glass-card">
                    <div className="card-header-accent" />

                    <div className="step-count-badge">
                      <span className="step-prefix">{t("about.process.stagePrefix", "STAGE")}</span>
                      <span className="step-num">{step.step}</span>
                    </div>

                    <h3 className="editorial-step-title">{t(`about.process.steps.${index}.title`, step.title)}</h3>
                    <p className="editorial-step-desc">{t(`about.process.steps.${index}.desc`, step.desc)}</p>

                    {/* Premium check assurance mark */}
                    {/* <div className="editorial-assurance">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="assurance-icon">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="assurance-text">{t("about.process.guarantee", "Janmotri Purity Guaranteed")}</span>
                    </div> */}
                  </div>
                </div>

                {/* Vertical Connector Line Segment */}
                {index < steps.length - 1 && (
                  <div className="editorial-connector-line">
                    <div className="connector-glow-dot" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};

export default ProcessSection;
