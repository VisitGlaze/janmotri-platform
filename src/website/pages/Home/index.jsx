import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "./HomeSection/HeroSection/HeroSection";
import StatsSection from "./HomeSection/StatsSection/StatsSection";
import QuoteSection from "./HomeSection/QuoteSection/QuoteSection";
import ProductsSection from "./HomeSection/ProductsSection/ProductsSection";
import WhyChooseSection from "./HomeSection/WhyChooseSection/WhyChooseSection";
import JourneySection from "./HomeSection/JourneySection/JourneySection";
import PromiseSection from "./HomeSection/PromiseSection/PromiseSection";
import TestimonialsSection from "./HomeSection/TestimonialsSection/TestimonialsSection";
import BlogSection from "./HomeSection/BlogSection/BlogSection";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";

const Home = () => {
  const location = useLocation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion settings
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    if (location.state && location.state.scrollToId) {
      const { scrollToId } = location.state;
      if (scrollToId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTimeout(() => {
          const element = document.getElementById(scrollToId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      }
      window.history.replaceState({}, document.title);
    }

    return () => mediaQuery.removeEventListener("change", handler);
  }, [location]);

  // Accessibility profile fallback for entrance animations
  const revealProps = prefersReducedMotion 
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: { duration: 0.65 }
      }
    : {
        initial: { opacity: 0, y: 45, scale: 0.97 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
      };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section with Reveal */}
      <motion.div {...revealProps}>
        <StatsSection />
      </motion.div>

      {/* Quote Section with Reveal */}
      <motion.div {...revealProps}>
        <QuoteSection />
      </motion.div>

      {/* Products Section (uses internal cascade reveals, no double wrappers) */}
      <div id="products-section">
        <ProductsSection />
      </div>

      {/* Why Choose Section with Reveal */}
      <motion.div {...revealProps}>
        <WhyChooseSection />
      </motion.div>

      {/* Journey Section with Reveal */}
      <motion.div {...revealProps}>
        <JourneySection />
      </motion.div>

      {/* Promise Section with Reveal */}
      <motion.div {...revealProps}>
        <PromiseSection />
      </motion.div>

      {/* Testimonials Section with Reveal */}
      <div id="reviews-section">
        <motion.div {...revealProps}>
          <TestimonialsSection />
        </motion.div>
      </div>

      {/* Blog Section with Reveal */}
      <div id="blogs-section">
        <motion.div {...revealProps}>
          <BlogSection />
        </motion.div>
      </div>

      {/* Footer with Reveal */}
      <div id="contact-section">
        <motion.div {...revealProps}>
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default Home;