import { motion } from "framer-motion";
import { aboutData } from "../aboutData";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import InstagramCard from "../../../components/shared/InstagramCard";
import "./InstagramSection.scss";

const InstagramSection = () => {
  const { getImage } = useLanguage();
  const { title, handle, link, postKeys } = aboutData.instagram;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="about-instagram about-section-padding">
      <Container>
        <div className="instagram-header-wrap">
          <div className="insta-title-left">
            <h2 className="insta-heading">{title}</h2>
            <div className="heading-line"></div>
          </div>
          
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="insta-handle-link"
          >
            <i className="pi pi-instagram mr-2"></i>
            <span>{handle}</span>
          </a>
        </div>

        <motion.div 
          className="instagram-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {postKeys && postKeys.map((postKey, index) => (
            <motion.div key={index} variants={itemVariants}>
              <InstagramCard image={getImage(postKey)} link={link} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default InstagramSection;
