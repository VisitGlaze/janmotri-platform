import { useLanguage } from "../../../../../shared/LanguageContext";
import { motion } from "framer-motion";
import "./PromiseSection.scss";

// Centralized image imports

import { PiDropBold, PiSealCheckFill, PiLeafFill } from "react-icons/pi";

const features = [
  {
    icon: <PiDropBold />,
    title: "Purity & Health in Every Drop",
    description: "Every drop gifted by nature is prepared with care and trust for your well-being.",
  },
  {
    icon: <PiSealCheckFill />,
    title: "A Direct Touch of Nature for Your Day and Family",
    description: "Every drop carries nature's care and purity, best for you and your family's health.",
  },
  {
    icon: <PiLeafFill />,
    title: "A Promise of Purity and Trust for Your Health",
    description: "A genuine and pure choice for your well-being, with no compromise on purity.",
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 75, damping: 14 },
  },
};

const showcaseVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const PromiseSection = () => {
  const { t, getImage } = useLanguage();

  return (
    <section className="promise-section">
      {/* Subtle background blobs */}
      <div className="bg-ornament bg-ornament-left" />
      <div className="bg-ornament bg-ornament-right" />

      <div className="promise-inner">

        {/* ── TOP: Centered heading + description ── */}
        <div className="promise-section-header">
          <motion.h2
            initial={{ opacity: 0, y: -22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("home.promise.title", "Our Promise")}
          </motion.h2>

          <motion.p
            className="intro-text"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("home.promise.desc", "We are committed to providing our customers with the purest and highest quality groundnut oil, helping them lead a healthier life.")}
          </motion.p>
        </div>

        {/* ── BOTTOM: 2-column grid ── */}
        <div className="promise-grid">

          {/* Left Column — 3 promise cards */}
          <div className="promise-content">
            <motion.div
              className="features-list"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  variants={cardVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 16px 40px rgba(239,32,39,0.06)",
                    borderColor: "rgba(239,32,39,0.22)",
                  }}
                >
                  <div className="feature-icon">{item.icon}</div>
                  <div className="feature-content">
                    <h4>{t(`home.promise.cards.${index}.title`, item.title)}</h4>
                    <p>{t(`home.promise.cards.${index}.desc`, item.description)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Product Showcase */}
          <div className="promise-image-wrapper">
            <motion.div
              className="product-showcase-container"
              variants={showcaseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {/* Rotating Mandala Pattern */}
              <div className="mandala-backdrop">
                <svg
                  className="mandala-svg"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="95" stroke="#f4b400" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.25" />
                  <circle cx="100" cy="100" r="85" stroke="#f4b400" strokeWidth="0.75" opacity="0.3" />
                  <circle cx="100" cy="100" r="75" stroke="#f4b400" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                  <g stroke="#f4b400" strokeWidth="0.6" opacity="0.3">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = (i * 360) / 24;
                      return (
                        <line
                          key={i}
                          x1="100" y1="100"
                          x2={100 + 80 * Math.cos((angle * Math.PI) / 180)}
                          y2={100 + 80 * Math.sin((angle * Math.PI) / 180)}
                          strokeDasharray="45 35"
                        />
                      );
                    })}
                  </g>
                  <circle cx="100" cy="100" r="50" stroke="#f4b400" strokeWidth="0.8" opacity="0.4" />
                  <g stroke="#f4b400" strokeWidth="0.5" opacity="0.35">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const angle = (i * 360) / 16;
                      const x = 100 + 50 * Math.cos((angle * Math.PI) / 180);
                      const y = 100 + 50 * Math.sin((angle * Math.PI) / 180);
                      return <circle key={i} cx={x} cy={y} r="6" />;
                    })}
                  </g>
                  <circle cx="100" cy="100" r="30" fill="none" stroke="#f4b400" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.25" />
                </svg>
              </div>

              {/* Glowing Rings */}
              <div className="glowing-ring ring-outer" />
              <div className="glowing-ring ring-middle" />
              <div className="glowing-ring ring-inner" />

              {/* Golden Liquid Splash */}
              <div className="liquid-oil-splash">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M40,100 C40,70 60,60 100,50 C140,40 160,70 160,100 C160,130 140,150 100,150 C60,150 40,130 40,100 Z"
                    fill="url(#goldGrad)"
                    opacity="0.12"
                    filter="blur(8px)"
                  />
                  <defs>
                    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#f4b400" />
                      <stop offset="100%" stopColor="#d4a017" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Oil Bottle */}
              <div className="product-circle-plate">
                <img
                  src={getImage("promiseOil")}
                  alt="Janmotri Oil Bottle"
                  className="promise-product-image"
                />
              </div>

              {/* Floating Groundnuts */}
              <div className="floating-element peanut peanut-left">
                <img src={getImage("peanut")} alt="Groundnut" />
              </div>
              <div className="floating-element peanut peanut-right">
                <img src={getImage("peanut")} alt="Groundnut" />
              </div>

              {/* Floating Leaves */}
              <div className="floating-element leaf leaf-top">🍃</div>
              <div className="floating-element leaf leaf-bottom">🌿</div>

              {/* Oil Droplets */}
              <div className="floating-element droplet droplet-1">
                <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15,0 C22,12 30,22 30,28 C30,34.6 23.3,40 15,40 C6.7,40 0,34.6 0,28 C0,22 8,12 15,0 Z" fill="#f4b400" opacity="0.65" />
                </svg>
              </div>
              <div className="floating-element droplet droplet-2">
                <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15,0 C22,12 30,22 30,28 C30,34.6 23.3,40 15,40 C6.7,40 0,34.6 0,28 C0,22 8,12 15,0 Z" fill="#d4a017" opacity="0.5" />
                </svg>
              </div>

              {/* Sparks */}
              <div className="floating-element spark spark-1">✨</div>
              <div className="floating-element spark spark-2">✨</div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromiseSection;