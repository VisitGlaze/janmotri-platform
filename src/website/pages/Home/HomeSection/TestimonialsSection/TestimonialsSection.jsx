import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "../../../../../shared/LanguageContext";
import "./TestimonialsSection.scss";
import { FaQuoteLeft } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const reviews = [
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
  },
  {
    name: "Hetalben Joshi",
    city: "Bhavnagar",
    rating: 5,
    text: "100% natural and chemical-free oil. My family loves the authentic taste. Best groundnut oil in Gujarat!",
  },
  {
    name: "Prakashbhai Mer",
    city: "Junagadh",
    rating: 5,
    text: "Been using for 3 years now. The quality never changes — always fresh, always pure. Truly a trustworthy brand.",
  },
];

function StarRating({ value }) {
  return (
    <div className="ts-stars" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`ts-star ${i < value ? "ts-star--filled" : ""}`}
          style={{ "--si": i }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getVisible() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1100) return 2;
  return 3;
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const autoRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(3);
  const [slideKey, setSlideKey] = useState(0);
  const [dir, setDir] = useState(1); // 1=forward, -1=backward
  const { t, getImage } = useLanguage();

  useEffect(() => {
    const update = () => setVisible(getVisible());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const total = reviews.length;

  const goNext = useCallback(() => {
    setDir(1);
    setSlideKey(k => k + 1);
    setCurrent(c => (c + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDir(-1);
    setSlideKey(k => k + 1);
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(goNext, 4500);
  };

  useEffect(() => {
    if (!entered) return;
    autoRef.current = setInterval(goNext, 4500);
    return () => clearInterval(autoRef.current);
  }, [entered, goNext]);

  const handleNext = () => { goNext(); resetAuto(); };
  const handlePrev = () => { goPrev(); resetAuto(); };

  const visibleCards = Array.from({ length: visible }, (_, i) =>
    reviews[(current + i) % total]
  );

  return (
    <section className="ts-section" ref={sectionRef}>
      {/* floating orbs */}
      <div className="ts-orb ts-orb--1" />
      <div className="ts-orb ts-orb--2" />
      <div className="ts-orb ts-orb--3" />

      {/* bg pattern */}
      <div className="ts-bg-pattern" style={{ backgroundImage: `url(${getImage("journeyBg2")})` }} />

      <div className="ts-container">

        {/* ── HEADER ── */}
        <div className={`ts-header ${entered ? "ts-header--in" : ""}`}>
          <div className="ts-header__left">
            <p className="ts-eyebrow">
              <span className="ts-eyebrow__line" />
              {t("home.testimonials.eyebrow", "What people say")}
              <span className="ts-eyebrow__line" />
            </p>
            <h2 className="ts-title">
              {t("home.testimonials.title", "Fans & Their ")}
              <span className="ts-title__accent">{t("home.testimonials.titleAccent", "Words")}</span>
            </h2>
          </div>

          <div className="ts-header__right">
            <div className="ts-counter">
              <span className="ts-counter__cur">{String(current + 1).padStart(2, "0")}</span>
              <span className="ts-counter__sep">/</span>
              <span className="ts-counter__tot">{String(total).padStart(2, "0")}</span>
            </div>
            <div className="ts-nav">
              <button className="ts-nav__btn" onClick={handlePrev} aria-label="Previous">
                <FiArrowLeft />
              </button>
              <button className="ts-nav__btn ts-nav__btn--active" onClick={handleNext} aria-label="Next">
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className={`ts-progress-wrap ${entered ? "ts-progress-wrap--in" : ""}`}>
          <div
            className="ts-progress-bar"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* ── CARDS ── */}
        <div
          key={slideKey}
          className={`ts-track ts-track--${dir > 0 ? "fwd" : "bwd"} ${entered ? "ts-track--in" : ""}`}
          style={{ "--vis": visible }}
        >
          {visibleCards.map((review, i) => {
            const originalIndex = (current + i) % total;
            return (
              <div
                key={`${review.name}-${slideKey}-${i}`}
                className="ts-card"
                style={{ "--ci": i, "--vis": visible }}
              >
                {/* large background quote */}
                <span className="ts-card__bg-quote">"</span>

                {/* stars */}
                <div className="ts-card__top">
                  <StarRating value={review.rating} />
                  <span className="ts-card__num">0{i + 1 + current > total ? i + 1 + current - total : i + 1 + current}</span>
                </div>

                {/* text */}
                <p className="ts-card__text">{t(`home.testimonials.reviewsList.${originalIndex}.text`, review.text)}</p>

                {/* divider */}
                <div className="ts-card__divider" />

                {/* user */}
                <div className="ts-card__user">
                  <div className="ts-card__avatar">
                    <FaQuoteLeft />
                    <div className="ts-card__avatar-ring" />
                  </div>
                  <div className="ts-card__info">
                    <h4>{t(`home.testimonials.reviewsList.${originalIndex}.name`, review.name)}</h4>
                    <span>
                      <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                        <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="currentColor" />
                      </svg>
                      {t(`home.testimonials.reviewsList.${originalIndex}.city`, review.city)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DOTS ── */}
        <div className={`ts-dots ${entered ? "ts-dots--in" : ""}`}>
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`ts-dot ${i === current ? "ts-dot--active" : ""}`}
              onClick={() => {
                setDir(i > current ? 1 : -1);
                setSlideKey(k => k + 1);
                setCurrent(i);
                resetAuto();
              }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}