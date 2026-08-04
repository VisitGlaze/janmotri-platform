import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollToTop.scss";

const ScrollToTop = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [threshold, setThreshold] = useState(800);

  useEffect(() => {
    // Dynamic appear threshold: set to window viewport height + 100px (so it only appears after hero section is passed)
    const updateThreshold = () => {
      setThreshold(window.innerHeight + 100);
    };
    updateThreshold();
    window.addEventListener("resize", updateThreshold);

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (docHeight > 0) {
        const progress = (scrolled / docHeight) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      } else {
        setScrollProgress(0);
      }

      // Toggle visibility based on threshold
      setVisible(scrolled > (window.innerHeight + 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial call

    return () => {
      window.removeEventListener("resize", updateThreshold);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isAdmin) return null;

  // The circular outline circumference for radius 45 is 2 * PI * 45 = 282.74
  const strokeDashoffset = 283 - (283 * scrollProgress) / 100;

  // Compute rising clip-path Y-coordinate: from 110 (empty) down to 10 (full)
  const clipY = 110 - (100 * scrollProgress) / 100;

  return (
    <button
      className={`scroll-to-top-btn ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      {/* Circle progress outline ring */}
      <svg className="progress-ring" width="60" height="60" viewBox="0 0 100 100">
        <circle
          className="progress-ring__bg"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="progress-ring__fill"
          cx="50"
          cy="50"
          r="45"
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center rising oil-drop fill illustration */}
      <div className="drop-container">
        <svg viewBox="0 0 100 120" className="oil-drop-svg">
          <defs>
            <clipPath id="drop-fill-clip">
              <rect x="0" y={clipY} width="100" height="110" />
            </clipPath>
          </defs>
          
          {/* Background hollow drop shape */}
          <path
            d="M50 10 C50 10, 85 55, 85 75 C85 94.2, 69.3 110, 50 110 C30.7 110, 15 94.2, 15 75 C15 55, 50 10, 50 10 Z"
            className="oil-drop-bg"
          />
          
          {/* Filled drop representing scroll progress */}
          <path
            d="M50 10 C50 10, 85 55, 85 75 C85 94.2, 69.3 110, 50 110 C30.7 110, 15 94.2, 15 75 C15 55, 50 10, 50 10 Z"
            className="oil-drop-fill"
            clipPath="url(#drop-fill-clip)"
          />
        </svg>
      </div>
    </button>
  );
};

export default ScrollToTop;
