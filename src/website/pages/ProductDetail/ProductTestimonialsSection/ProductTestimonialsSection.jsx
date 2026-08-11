import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../../../../shared/LanguageContext";
import Container from "../../../components/shared/Container";
import "./ProductTestimonialsSection.scss";

const productReviews = [
  {
    name: "Kiranben Patel",
    city: "Vadodara",
    rating: 5,
    text: "The taste and aroma of Janmotri Groundnut Oil are both amazing. Using it in cooking doubles the flavor of every meal.",
  },
  {
    name: "Dipakbhai Trivedi",
    city: "Rajkot",
    rating: 5,
    text: "We have been using this brand for years. The oil is always fresh, pure, and healthy. It is completely safe for children as well.",
  },
  {
    name: "Raj Desai",
    city: "Ahmedabad",
    rating: 5,
    text: "For homemade snacks, bhajiya, or puri – Janmotri Groundnut Oil is the best choice for every dish. It maintains both quality and trust.",
  },
  {
    name: "Mayurbhai Shah",
    city: "Surat",
    rating: 5,
    text: "The aroma of Janmotri Groundnut Oil itself shows how pure it is. A special flavor remains throughout cooking.",
  }
];

export default function ProductTestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();
  const total = productReviews.length;

  const handleNext = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const nameText = t(`home.testimonials.reviewsList.${current}.name`, productReviews[current].name);
  const cityText = t(`home.testimonials.reviewsList.${current}.city`, productReviews[current].city);
  const reviewText = t(`home.testimonials.reviewsList.${current}.text`, productReviews[current].text);

  return (
    <section className="prod-testimonials-section">
      <Container>
        {/* Header with Navigation Controls */}
        <div className="testimonials-header-row">
          <div className="header-titles">
            <span className="eyebrow-caption">{t("home.testimonials.eyebrow", "User Reviews")}</span>
            <h2 className="section-title-large">
              {t("home.testimonials.title", "Fans & Their ")}{t("home.testimonials.titleAccent", "Words")}
            </h2>
          </div>

          <div className="testimonials-nav-controls">
            <button className="nav-arrow-btn" onClick={handlePrev} aria-label="Previous Review">
              <FiArrowLeft />
            </button>
            <button className="nav-arrow-btn active-arrow" onClick={handleNext} aria-label="Next Review">
              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Carousel Slide Card */}
        <div className="testimonials-slider-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="testimonial-slide-card"
            >
              {/* Star Ratings */}
              <div className="stars-row">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`review-star-item ${i < productReviews[current].rating ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="testimonial-text-content">
                "{reviewText}"
              </p>

              {/* Author & Quote Info */}
              <div className="author-quote-row">
                <div className="red-quote-avatar">
                  <span className="quote-mark-icon">“</span>
                </div>
                <div className="author-details-meta">
                  <h4 className="author-name-title">{nameText}</h4>
                  <span className="author-city-location">, {cityText}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </Container>
    </section>
  );
}
