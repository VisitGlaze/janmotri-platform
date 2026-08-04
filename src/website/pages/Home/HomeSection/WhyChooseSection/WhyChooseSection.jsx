import { useEffect, useRef } from "react";
import { useLanguage } from "../../../../../shared/LanguageContext";
import "./WhyChooseSection.scss";

// Centralized image imports

const features = [
  {
    icon: "🫀",
    title: "Excellent for Heart Health",
    desc: "Best for your heart health, 0% cholesterol groundnut oil, ideal for a healthy lifestyle!",
  },
  {
    icon: "🏋️",
    title: "Supports Fitness",
    desc: "Nutrient-rich Janmotri Groundnut Oil for your fitness and health.",
  },
  {
    icon: "😊",
    title: "Rich in Taste",
    desc: "Enhances the natural flavor and aroma of every dish.",
  },
  {
    icon: "🚫",
    title: "Helps Control Cholesterol",
    desc: "Premium quality traditional Ghani groundnut oil for daily use.",
  },
];

const WhyChooseSection = () => {
  const sectionRef = useRef(null);
  const { t, getImage } = useLanguage();

  useEffect(() => {
    const targets =
      sectionRef.current?.querySelectorAll("[data-anim]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(
              entry.target.dataset.delay || 0
            );

            setTimeout(() => {
              entry.target.classList.add("anim--in");
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    targets?.forEach((el) =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="why-section"
    >
      {/* Blurred background image */}
      <div className="why-bg-image" style={{ backgroundImage: `url(${getImage("farmBg")})` }} />

      {/* Overlay */}
      <div className="why-overlay"></div>

      <div className="why-inner">

        {/* LEFT CONTENT */}
        <div className="why-content">

          <h2
            className="why-heading"
            data-anim
            data-delay="0"
          >
            {t("home.whyChoose.title", "Why Only Janmotri\nGroundnut Oil?")}

            <span className="why-heading__line"></span>
          </h2>

          <p
            className="why-desc"
            data-anim
            data-delay="100"
          >
            {t("home.whyChoose.desc", "Our pure groundnut oil is Perfect for everyday cooking. Made from premium-quality groundnuts and free from harmful chemicals")}
          </p>

          <div className="why-grid">

            {features.map((item, index) => (
              <div
                key={index}
                className="why-card"
                data-anim
                data-delay={200 + index * 100}
              >
                <div className="why-card__icon">
                  {item.icon}
                </div>

                <div className="why-card__body">
                  <h4>{t(`home.whyChoose.features.${index}.title`, item.title)}</h4>

                  <p>{t(`home.whyChoose.features.${index}.desc`, item.desc)}</p>
                </div>
              </div>
            ))}

          </div>

        </div>

        {/* RIGHT PRODUCTS */}
        <div
          className="why-products"
          data-anim
          data-delay="150"
        >
          <img
            src={getImage("fifteenKg")}
            alt="15 Kg Box"
            className="why-products__box"
          />

          <img
            src={getImage("fiveLiters")}
            alt="5 L – Value Saver Pack"
            className="why-products__can"
          />

          <div className="why-products__glow"></div>
        </div>

      </div>

      {/* Bottom Red Shape */}
      <div className="why-slash"></div>
    </section>
  );
};

export default WhyChooseSection;