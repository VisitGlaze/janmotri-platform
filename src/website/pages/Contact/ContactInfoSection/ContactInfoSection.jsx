import { motion } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./ContactInfoSection.scss";

export default function ContactInfoSection() {
  const { t } = useLanguage();

  return (
    <div className="contact-info-pane">
      
      {/* Phone Card */}
      <motion.div 
        className="info-card-item"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="info-icon-circle">
          <span className="pi pi-phone icon-detail"></span>
        </div>
        <div className="info-text-details">
          <h3 className="info-title">{t("contactPage.callUs", "Call Us")}</h3>
          <a href="tel:+919099908309" className="info-link-value">
            +91 90999 08309
          </a>
          <p className="info-sub-label">{t("contactPage.workHours", "9 AM to 5 PM")}</p>
        </div>
      </motion.div>

      {/* Email Card */}
      <motion.div 
        className="info-card-item"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="info-icon-circle">
          <span className="pi pi-envelope icon-detail"></span>
        </div>
        <div className="info-text-details">
          <h3 className="info-title">{t("contactPage.emailUs", "Email Us")}</h3>
          <a href="mailto:janmotrioilandfoodproducts@gmail.com" className="info-link-value email-value">
            janmotrioilandfoodproducts@gmail.com
          </a>
          <p className="info-sub-label">{t("contactPage.generalEnquiries", "For general enquiries")}</p>
        </div>
      </motion.div>

      {/* Address Card */}
      <motion.div 
        className="info-card-item"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="info-icon-circle">
          <span className="pi pi-map-marker icon-detail"></span>
        </div>
        <div className="info-text-details">
          <h3 className="info-title">{t("contactPage.visitUs", "Visit Us")}</h3>
          <a 
            href="https://maps.app.goo.gl/BacvLQVaLaRCebG26"
            target="_blank"
            rel="noopener noreferrer"
            className="info-link-value address-value"
            title="Open in Google Maps"
          >
            {t("footer.addressVal", "93 Plot No: 1 Radhamani Park, Near Matridham Mandir, Akwada, Bhavnagar – 364002")}
          </a>
        </div>
      </motion.div>

    </div>
  );
}
