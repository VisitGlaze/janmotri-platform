import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./ContactFormSection.scss";

export default function ContactFormSection({
  formData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  submitSuccess
}) {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="contact-form-card"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <form onSubmit={handleFormSubmit} className="contact-form">
        
        {/* Row: Name and Phone */}
        <div className="form-row flex-two">
          <div className="form-group">
            <label htmlFor="name">{t("contactPage.formName", "Your Name")}</label>
            <input 
              type="text" 
              id="name" 
              placeholder={t("contactPage.placeholderName", "Enter Name")}
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">{t("contactPage.formPhone", "Phone Number")}</label>
            <input 
              type="text" 
              id="phone" 
              placeholder={t("contactPage.placeholderPhone", "Enter Mobile Number")}
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row: Email and Subject */}
        <div className="form-row flex-two">
          <div className="form-group">
            <label htmlFor="email">{t("contactPage.formEmail", "Email Address")}</label>
            <input 
              type="email" 
              id="email" 
              placeholder={t("contactPage.placeholderEmail", "Enter Email Address")}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">{t("contactPage.formSubject", "Subject")}</label>
            <input 
              type="text" 
              id="subject" 
              placeholder={t("contactPage.placeholderSubject", "Enter Subject")}
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Message area */}
        <div className="form-group">
          <label htmlFor="message">{t("contactPage.formMessage", "Message")}</label>
          <textarea 
            id="message" 
            rows="5" 
            placeholder={t("contactPage.placeholderMessage", "Enter Message")}
            value={formData.message}
            onChange={handleInputChange}
          />
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              className="error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="pi pi-info-circle mr-2"></span>
              {errorMessage}
            </motion.div>
          )}

          {submitSuccess && (
            <motion.div 
              className="success-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="pi pi-check-circle mr-2"></span>
              {t("contactPage.successMsg", "Message sent successfully!")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="form-submit-wrap">
          <motion.button 
            type="submit" 
            className="send-message-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("contactPage.formBtn", "Send Message")}
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}
