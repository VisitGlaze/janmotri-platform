import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./TestimonialsSection.scss";

export default function TestimonialsSection({ reviewsList }) {
  const { t } = useLanguage();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <section className="testimonials-grid-section">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="grid-section-eyebrow">{t("home.testimonials.eyebrow", "User Testimonials")}</span>
          <h2 className="fans-grid-title">
            {t("home.testimonials.title", "Fans & Their ")}{t("home.testimonials.titleAccent", "Words")}
          </h2>
        </motion.div>

        {/* Testimonials Masonry Cards */}
        <motion.div
          className="testimonials-cards-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {reviewsList.map((review) => {
              const isInitial = review.id === 1 || review.id === 2 || review.id === 3 || review.id === 4;
              const nameText = isInitial ? t(`home.testimonials.reviewsList.${review.id - 1}.name`, review.name) : review.name;
              const cityText = review.city === "Verified Buyer" ? t("common.verifiedBuyer", "Verified Buyer") : (isInitial ? t(`home.testimonials.reviewsList.${review.id - 1}.city`, review.city) : review.city);
              const reviewText = isInitial ? t(`home.testimonials.reviewsList.${review.id - 1}.text`, review.text) : review.text;

              return (
                <motion.div
                  key={review.id}
                  className="testimonial-grid-card"
                  variants={fadeUpVariants}
                  whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(236, 28, 36, 0.08)" }}
                >
                  {/* Stars */}
                  <div className="card-stars-wrap">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`card-star ${i < review.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="card-testimonial-text">
                    {reviewText}
                  </p>

                  {/* Author block with Red Double Quote Icon */}
                  <div className="card-author-wrap">
                    <div className="red-quote-icon">
                      <span className="quotes-symbol">“</span>
                    </div>
                    <div className="author-details">
                      <h4 className="author-name">{nameText}</h4>
                      {review.city && <span className="author-city">, {cityText}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
