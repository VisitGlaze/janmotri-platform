import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./ContactSupportSection.scss";

export default function ContactSupportSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="faq-cta-section">
      <Container>
        <div className="faq-cta-grid">
          
          {/* Card 1: Still Have A Question? */}
          <motion.div 
            className="faq-cta-card card-message"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="cta-content">
              <h3 className="cta-title">{t("faqPage.supportTitle", "Still Have Questions?")}</h3>
              <p className="cta-desc">
                {t("faqPage.supportDesc", "Our dedicated support desk is available to assist you with any questions regarding product quality, bulk orders, or custom requirements.")}
              </p>
              <motion.button 
                className="cta-action-btn"
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t("common.contactUsBtn", "Contact Us")} &rarr;
              </motion.button>
            </div>
          </motion.div>

          {/* Card 2: Call us */}
          <motion.div 
            className="faq-cta-card card-call"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="call-icon-wrap">
              <span className="pi pi-phone call-icon-symbol"></span>
            </div>
            <div className="call-details-wrap">
              <h3 className="call-title">{t("footer.callUs", "Call Us:")}</h3>
              <span className="call-status">{t("faqPage.active247", "active 24/7")}</span>
              <a href="tel:+919099908309" className="call-phone-link">
                +91 90999 08309
              </a>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
