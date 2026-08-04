import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../../../shared/LanguageContext";
import "./JourneySection.scss";

// Desi, organic cold pressed oil journey timelines

const steps = [
  {
    id: "01",
    title: "Farming",
    desc: "100% natural farming. Sourced from the finest local groundnut farms under strict quality supervision.",
    imageKey: "farming",
    color: "green",
    slot: 1,
    left: "25%",
    top: "15%",
    accent: "#10b981"
  },
  {
    id: "02",
    title: "Purification",
    desc: "Multi-stage cleaning. Pods are thoroughly cleaned and sorted to select only the healthiest, premium kernels.",
    imageKey: "purification",
    color: "orange",
    slot: 2,
    left: "67%",
    top: "15%",
    accent: "#f59e0b"
  },
  {
    id: "03",
    title: "Traditional\nCold Pressed",
    desc: "Traditional wooden Ghani. Slow extraction at low temperatures ensures natural nutrients and aroma are preserved.",
    imageKey: "coldPressed",
    color: "blue",
    slot: 3,
    left: "81%",
    top: "50%",
    accent: "#0ea5e9"
  },
  {
    id: "04",
    title: "Filtration",
    desc: "Natural sedimentation. Oil is filtered using eco-friendly cotton fabric filters, retaining pure golden clarity without chemicals.",
    imageKey: "filtration",
    color: "purple",
    slot: 4,
    left: "58%",
    top: "80%",
    accent: "#8b5cf6"
  },
  {
    id: "05",
    title: "Packaging",
    desc: "Hygienically sealed. Packed in food-grade, leak-proof containers and tin cans to maintain absolute freshness.",
    imageKey: "packaging",
    color: "pink",
    slot: 5,
    left: "23%",
    top: "72.8%",
    accent: "#ec4899"
  }
];

export default function JourneySection() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);

  const [entered, setEntered] = useState(false);
  const [activeId, setActiveId] = useState("01");
  const [isHovered, setIsHovered] = useState(false);
  const { t, getImage } = useLanguage();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathLength, setPathLength] = useState(2500);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Measure total length of the guide SVG path
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength() || 2500);
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const motionHandler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);

    // Track vertical scroll progress relative to this section's visibility window
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const elementHeight = rect.height;
      const visibleRange = windowHeight + elementHeight;
      const scrolled = windowHeight - rect.top; // pixel progress into view

      // Compute ratio between 0 and 1
      const progress = scrolled / visibleRange;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run initially

    return () => {
      obs.disconnect();
      mediaQuery.removeEventListener("change", motionHandler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto cycle logic (pauses on hover)
  useEffect(() => {
    if (!entered || isHovered) return;

    const interval = setInterval(() => {
      setActiveId((prev) => {
        const currentIdx = steps.findIndex((s) => s.id === prev);
        if (currentIdx === -1 || prev === "06") {
          return "01";
        }
        if (currentIdx === steps.length - 1) {
          return "06"; // Show Delivery truck
        }
        return steps[currentIdx + 1].id;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [entered, isHovered]);

  return (
    <section className="circular-journey" ref={sectionRef}>
      <div className="container">

        {/* Header Title */}
        <div className="journey-header">
          <h2 className="title">{t("home.journey.title", "Our Journey of Excellence")}</h2>
          <div className="title-bar"></div>
          <p className="description">
            {t("home.journey.desc", "From farm to your kitchen, every drop is carefully crafted to ensure purity, freshness, and quality.")}
          </p>
        </div>

        {/* Circular Process Flow (Desktop) */}
        <div className={`cj-stage ${entered ? "cj-stage--in" : ""}`}>

          {/* Animated Connecting SVG Paths */}
          <div className="cj-svg-layer">
            <svg viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="75%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ef2027" />
                </linearGradient>
                <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Core Guide Track */}
              <path
                className="guide-track"
                d="M 250 110 Q 460 70 670 110 Q 770 230 810 350 Q 730 490 580 560 Q 380 570 230 510 Q 150 390 480 330"
              />

              {/* Signature Moment: Scroll-Linked progressive path drawing (falls back to solid path for reduced motion) */}
              <path
                ref={pathRef}
                className="animated-flow"
                d="M 250 110 Q 460 70 670 110 Q 770 230 810 350 Q 730 490 580 560 Q 380 570 230 510 Q 150 390 480 330"
                stroke="url(#flow-gradient)"
                strokeDasharray={pathLength}
                strokeDashoffset={prefersReducedMotion ? 0 : pathLength - (pathLength * scrollProgress)}
                style={{ transition: "stroke-dashoffset 0.12s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>
          </div>

          {/* Center Delivery Truck Card */}
          <div
            className={`cj-center-truck ${activeId === "06" ? "is-active" : ""}`}
            onMouseEnter={() => {
              setActiveId("06");
              setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="truck-wrapper"
              animate={{
                y: activeId === "06" ? [0, -6, 0] : [0, -2, 0],
                rotate: activeId === "06" ? [0, 1, -1, 0] : [0, 0.4, -0.4, 0]
              }}
              transition={{
                duration: activeId === "06" ? 1.5 : 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="truck-tag-num">06</span>

              {/* Rotating Gold Seal Badge */}
              <div className="premium-seal-badge">
                <div className="seal-body">
                  <span className="seal-text-line line-red">{t("home.journey.seal.pure", "Pure.")}</span>
                  <span className="seal-text-line">{t("home.journey.seal.natural", "Natural.")}</span>
                  <span className="seal-text-line">{t("home.journey.seal.trusted", "Trusted.")}</span>
                </div>
                <div className="seal-border-spin"></div>
              </div>

              <img src={getImage("deliveryTruck")} alt="Janmotri Delivery Truck" className="truck-img" />
            </motion.div>

            <div className="delivery-label">
              <h3>{t("home.journey.steps.5.title", "Delivery")}</h3>
              <div className="line-indicator"></div>
            </div>
          </div>

          {/* Interactive Nodes */}
          {steps.map((step) => {
            const isActive = activeId === step.id;
            const stepIndex = parseInt(step.id, 10) - 1;
            return (
              <div
                key={step.id}
                style={{ left: step.left, top: step.top }}
                className={`cj-node node-s${step.slot} color-${step.color} ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => {
                  setActiveId(step.id);
                  setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Node Details (Glassmorphic Box) */}
                <div className="node-details">
                  <span className="node-num" style={{ backgroundColor: step.accent }}>
                    {step.id}
                  </span>
                  <h4 className="node-title">{t(`home.journey.steps.${stepIndex}.title`, step.title)}</h4>
                  <p className="node-desc">{t(`home.journey.steps.${stepIndex}.desc`, step.desc)}</p>
                </div>

                {/* Node Circle Wrapper */}
                <div className="node-circle" style={{ "--accent-color": step.accent }}>
                  <div className="circle-inner">
                    <img src={getImage(step.imageKey)} alt={step.title} />
                  </div>
                  {/* Glowing Ring */}
                  <div className="circle-glow"></div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Responsive Mobile Timeline (Visible on screens < 1024px) */}
        <div className="mobile-timeline">
          {steps.map((step) => {
            const isActive = activeId === step.id;
            const stepIndex = parseInt(step.id, 10) - 1;
            return (
              <div
                key={step.id}
                className={`mobile-step ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveId(step.id)}
              >
                <div className="mobile-marker-container">
                  <div className="mobile-marker" style={{ backgroundColor: step.accent }}>
                    <span>{step.id}</span>
                  </div>
                  <div className="mobile-line"></div>
                </div>
                <div className="mobile-content-card">
                  <div className="mobile-card-image">
                    <img src={getImage(step.imageKey)} alt={step.title} />
                  </div>
                  <div className="mobile-card-info">
                    <h4>{t(`home.journey.steps.${stepIndex}.title`, step.title)}</h4>
                    <p>{t(`home.journey.steps.${stepIndex}.desc`, step.desc)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Delivery (Step 6) */}
          <div
            className={`mobile-step mobile-step-delivery ${activeId === "06" ? "is-active" : ""}`}
            onClick={() => setActiveId("06")}
          >
            <div className="mobile-marker-container">
              <div className="mobile-marker delivery-marker">
                <span>06</span>
              </div>
            </div>
            <div className="mobile-content-card delivery-card">
              <div className="mobile-card-image delivery-image">
                <img src={getImage("deliveryTruck")} alt="Delivery Truck" />
              </div>
              <div className="mobile-card-info">
                <h4>{t("home.journey.steps.5.title", "Delivery")}</h4>
                <p>{t("home.journey.steps.5.desc", "Seamless logistics ensuring 100% pure and fresh oil reaches your kitchen promptly.")}</p>
                <div className="mobile-seal-inline">
                  <span>{t("home.journey.seal.pure", "Pure")}</span> • <span>{t("home.journey.seal.natural", "Natural")}</span> • <span>{t("home.journey.seal.trusted", "Trusted")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}