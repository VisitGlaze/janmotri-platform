import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./FeedbackFormSection.scss";

export default function FeedbackFormSection({
  formData,
  handleInputChange,
  handleRatingClick,
  handleFormSubmit,
  hoveredRating,
  setHoveredRating,
  errorMessage,
  submitSuccess
}) {
  const { t } = useLanguage();

  return (
    <section className="feedback-form-section">
      <Container>
        <div className="feedback-grid">
          {/* Form Intro (Left) */}
          <motion.div
            className="feedback-intro-pane"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-eyebrow">{t("reviewPage.formIntroEyebrow", "Customer Voice")}</span>
            <h2 className="section-heading">{t("reviewPage.formTitle", "Share Your Experience")}</h2>
            <p className="section-description">
              {t("reviewPage.formSubtitle", "Are You Satisfied With Our Product? Your Little Comment Motivates Us To Do Better Work.")}
            </p>

            {/* Accent Quote Alert Box */}
            <div className="feedback-alert-box">
              <span className="alert-quote-mark">“</span>
              <p className="alert-text">{t("reviewPage.alertText", "We read each response individually and improve accordingly.")}</p>
            </div>
          </motion.div>

          {/* Input Card Container (Right) */}
          <motion.div
            className="feedback-form-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleFormSubmit} className="feedback-form">
              {/* Row: Name and Email */}
              <div className="form-row flex-two">
                <div className="form-group">
                  <label htmlFor="name">{t("reviewPage.formName", "Your Name")}</label>
                  <input
                    type="text"
                    id="name"
                    placeholder={t("reviewPage.formNamePlaceholder", "Enter Full Name")}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t("reviewPage.formEmail", "Email Id")}</label>
                  <input
                    type="email"
                    id="email"
                    placeholder={t("reviewPage.formEmailPlaceholder", "Enter Email Address")}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Rating selection (Stars) */}
              <div className="form-group rating-form-group">
                <label>{t("reviewPage.formRating", "Your Rating")}</label>
                <div className="stars-rating-container">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = starValue <= (hoveredRating || formData.rating);
                    return (
                      <motion.span
                        key={starValue}
                        className={`rating-star ${isFilled ? "filled" : ""}`}
                        onClick={() => handleRatingClick(starValue)}
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        ★
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              {/* Comments area */}
              <div className="form-group">
                <label htmlFor="feedback">{t("reviewPage.formFeedback", "Your Feedback")}</label>
                <textarea
                  id="feedback"
                  rows="4"
                  placeholder={t("reviewPage.formFeedbackPlaceholder", "Enter Feedback")}
                  value={formData.feedback}
                  onChange={handleInputChange}
                />
              </div>

              {/* Notifications */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    className="error-banner"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="pi pi-info-circle mr-2"></span>
                    {errorMessage}
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    className="success-banner"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="pi pi-check-circle mr-2"></span>
                    {t("reviewPage.successMsg", "Thank you! Your feedback has been submitted successfully.")}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="form-submit-wrap">
                <motion.button
                  type="submit"
                  className="submit-feedback-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("reviewPage.formBtn", "Submit Feedback")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
