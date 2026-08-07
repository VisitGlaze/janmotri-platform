import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./VisionMissionSection.scss";

const VisionMissionSection = () => {
  const { t, getImage } = useLanguage();
  const { imageKey, vision, mission } = aboutData.visionMission;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="about-vision-mission about-section-padding">
      <Container>
        <motion.div
          className="vision-mission-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >

          {/* Left Column - Image with decorative rotating rings */}
          <motion.div
            className="vm-image-col"
            variants={imageVariants}
          >
            <div className="vm-image-container">
              <div className="vm-ring vm-ring-1"></div>
              <div className="vm-ring vm-ring-2"></div>
              <div className="vm-ring vm-ring-3"></div>
              <div className="vm-img-wrap">
                <img src={getImage(imageKey)} alt="Pure Janmotri Groundnut Oil" className="vm-photo" />
                <div className="vm-img-overlay"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Cards */}
          <div className="vm-cards-col">

            {/* Vision Card */}
            <motion.div
              className="vm-card card-vision"
              variants={cardVariants}
            >
              <div className="card-indicator"></div>
              <div className="vm-card-body">
                {/* <span className="card-label">{t("about.visionMission.focusLabel", "🌱 Our Focus")}</span> */}
                <h3 className="card-title">{t("about.visionMission.vision", vision.title)}</h3>
                <p className="card-text">{t("about.visionMission.visionDesc", vision.desc)}</p>
              </div>
              <div className="vm-card-backdrop-glow" />
            </motion.div>

            {/* Mission Card */}
            <motion.div
              className="vm-card card-mission"
              variants={cardVariants}
            >
              <div className="card-indicator"></div>
              <div className="vm-card-body">
                {/* <span className="card-label">{t("about.visionMission.pathLabel", "🤝 Our Path")}</span> */}
                <h3 className="card-title">{t("about.visionMission.mission", mission.title)}</h3>
                <p className="card-text">{t("about.visionMission.missionDesc", mission.desc)}</p>
              </div>
              <div className="vm-card-backdrop-glow" />
            </motion.div>

          </div>

        </motion.div>
      </Container>
    </section>
  );
};

export default VisionMissionSection;
