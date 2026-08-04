import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./CustomCursor.scss";

// Clean, premium inline SVG oil drop for custom cursor shape
const OilDropCursorSVG = ({ color = "#d0021b" }) => (
  <svg viewBox="0 0 100 120" fill="none" className="cursor-drop-svg">
    <path
      d="M50 10 C50 10, 85 55, 85 75 C85 94.2, 69.3 110, 50 110 C30.7 110, 15 94.2, 15 75 C15 55, 50 10, 50 10 Z"
      fill={color}
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M40 60 C37 65, 37 75, 45 80" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const CustomCursor = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);
  const mouseCoords = useRef({ x: 0, y: 0 });
  const cursorCoords = useRef({ x: 0, y: 0 });
  
  // Tuned lerp factor: 0.18 is highly responsive (no lagging disconnect) but retains organic elasticity
  const LERP_FACTOR = 0.18;

  useEffect(() => {
    // Detect mobile viewport and accessibility reduced motion
    const checkSettings = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    checkSettings();
    window.addEventListener("resize", checkSettings);

    return () => window.removeEventListener("resize", checkSettings);
  }, []);

  useEffect(() => {
    if (isAdmin || isMobile || prefersReducedMotion) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    // Enable custom cursor active class on body to cleanly suppress native pointer
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      setIsVisible(true);

      // Perform hover check for clickable / interactive items
      const target = e.target;
      if (target) {
        // Broad selectors to capture all button, link, inputs, dropdowns, textareas, nav elements and cards
        const isInteractive = target.closest(
          "button, a, [role='button'], input, select, textarea, .why-card, .product-card-wrapper, .cj-node, .ts-card, .blog-card, .footer-btn, .ts-nav__btn, .ts-dot, .nav-link, .mobile-menu-toggle, .hero-btn, .arrow-circle"
        );
        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Smooth LERP loop for tracking cursor coords
    let frameId;
    const updatePosition = () => {
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      const currentX = cursorCoords.current.x;
      const currentY = cursorCoords.current.y;

      // Coordinate interpolation
      const nextX = currentX + (targetX - currentX) * LERP_FACTOR;
      const nextY = currentY + (targetY - currentY) * LERP_FACTOR;

      cursorCoords.current.x = nextX;
      cursorCoords.current.y = nextY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      frameId = requestAnimationFrame(updatePosition);
    };

    frameId = requestAnimationFrame(updatePosition);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      cancelAnimationFrame(frameId);
    };
  }, [isAdmin, isMobile, prefersReducedMotion]);

  if (isAdmin || isMobile || prefersReducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-wrapper ${isHovered ? "is-hovered" : ""} ${isVisible ? "is-visible" : ""}`}
    >
      <div className="cursor-inner">
        <OilDropCursorSVG color={isHovered ? "#f5c518" : "#d0021b"} />
      </div>
      <div className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
