import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./CursorEffects.scss";

// SVG Icons as React inline components for crisp, resolution-independent rendering
const LeafSVG = ({ color = "#10b981" }) => (
  <svg viewBox="0 0 100 100" fill="none" className="decor-svg">
    <path
      d="M50 90 C50 90, 80 65, 80 40 C80 15, 50 10, 50 10 C50 10, 20 15, 20 40 C20 65, 50 90, 50 90 Z"
      fill="rgba(16, 185, 129, 0.06)"
      stroke={color}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M50 10 L50 90" stroke={color} strokeWidth="2" opacity="0.6" />
    <path d="M50 35 Q65 30 75 25" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M50 50 Q68 47 78 40" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M50 35 Q35 30 25 25" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M50 50 Q32 47 22 40" stroke={color} strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const PeanutSVG = ({ color = "#eebc55" }) => (
  <svg viewBox="0 0 100 160" fill="none" className="decor-svg">
    <path
      d="M50 20 C65 20, 75 35, 70 55 C68 63, 62 70, 58 75 C62 80, 68 87, 70 95 C75 115, 65 130, 50 130 C35 130, 25 115, 30 95 C32 87, 38 80, 42 75 C38 70, 32 63, 30 55 C25 35, 35 20, 50 20 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="rgba(245, 158, 11, 0.06)"
    />
    <path d="M50 35 C53 45, 47 55, 50 65" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M50 85 C53 95, 47 105, 50 115" stroke={color} strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const OilDropSVG = ({ color = "#ef2027" }) => (
  <svg viewBox="0 0 100 120" fill="none" className="decor-svg">
    <path
      d="M50 10 C50 10, 85 55, 85 75 C85 94.2, 69.3 110, 50 110 C30.7 110, 15 94.2, 15 75 C15 55, 50 10, 50 10 Z"
      fill="rgba(239, 32, 39, 0.04)"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M40 60 C37 65, 37 75, 45 80" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const CursorEffects = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lastSpawnTime = useRef(0);
  const decorRefs = useRef([]);

  // Background decoration items configurations positioned along the scroll height of the page
  const bgDecors = [
    { id: 1, type: "peanut", top: "12%", left: "4%", size: 120, speed: 1.2 },
    { id: 2, type: "leaf", top: "28%", right: "6%", size: 90, speed: 0.9 },
    { id: 3, type: "drop", top: "46%", left: "5%", size: 80, speed: 1.5 },
    { id: 4, type: "peanut", top: "62%", right: "5%", size: 110, speed: 1.1 },
    { id: 5, type: "leaf", top: "78%", left: "4%", size: 100, speed: 1.3 },
    { id: 6, type: "drop", top: "92%", right: "6%", size: 85, speed: 1.4 },
  ];

  // Detect mobile viewport and accessibility preferences
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  // requestAnimationFrame-based physics loop for smooth LERP inertia (lag behind)
  useEffect(() => {
    if (isAdmin || isMobile || prefersReducedMotion) return;

    // Track targets and current properties for each item
    const physicsData = bgDecors.map(() => ({
      targetX: 0,
      targetY: 0,
      targetRotate: 0,
      currentX: 0,
      currentY: 0,
      currentRotate: 0,
    }));

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn trail particle (throttled)
      const now = Date.now();
      if (now - lastSpawnTime.current > 75) {
        lastSpawnTime.current = now;

        const types = ["peanut", "drop", "spark"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomSize = Math.floor(Math.random() * 12) + 12;
        const randomRotation = Math.floor(Math.random() * 360);

        const newParticle = {
          id: now + Math.random(),
          x: e.clientX,
          y: e.clientY,
          type: randomType,
          size: randomSize,
          rotation: randomRotation,
        };

        setParticles((prev) => [...prev.slice(-12), newParticle]);
      }
    };

    const handleClick = (e) => {
      const now = Date.now();
      const newRipple = {
        id: now,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    let frameId;
    const update = () => {
      physicsData.forEach((item, index) => {
        const el = decorRefs.current[index];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        const dx = mouseX - elCenterX;
        const dy = mouseY - elCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = 0;
        let targetY = 0;
        let targetRotate = 0;

        // Magnetism: deflect within 240px
        if (dist < 240) {
          const force = (240 - dist) / 240; // 0 to 1
          const angle = Math.atan2(dy, dx);
          
          // Max deflection 12px (subtle, tactile)
          targetX = -Math.cos(angle) * force * 12;
          targetY = -Math.sin(angle) * force * 12;
          targetRotate = -Math.cos(angle) * force * 8;
        }

        // Apply LERP smoothing factor of 0.08 per frame
        item.currentX += (targetX - item.currentX) * 0.08;
        item.currentY += (targetY - item.currentY) * 0.08;
        item.currentRotate += (targetRotate - item.currentRotate) * 0.08;

        el.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0) rotate(${item.currentRotate}deg)`;
      });

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(frameId);
    };
  }, [isAdmin, isMobile, prefersReducedMotion]);

  // Clean up expired trail particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(1));
    }, 140);
    return () => clearInterval(interval);
  }, [particles]);

  // Clean up expired ripples after animation completes (600ms)
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isAdmin) return null;

  return (
    <div className="cursor-effects-container">
      
      {/* Cursor Particle Trails (Desktop Only, disabled if prefersReducedMotion is active) */}
      {!isMobile && !prefersReducedMotion &&
        particles.map((p) => (
          <div
            key={p.id}
            className={`cursor-trail-particle type-${p.type}`}
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            }}
          >
            {p.type === "peanut" && <PeanutSVG color="#eebc55" />}
            {p.type === "drop" && <OilDropSVG color="#ef2027" />}
            {p.type === "spark" && <div className="gold-spark" />}
          </div>
        ))}

      {/* Click-triggered Golden Oil Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="oil-ripple"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
          }}
        >
          <div className="ripple-ring ripple-ring--inner" />
          <div className="ripple-ring ripple-ring--outer" />
        </div>
      ))}
    </div>
  );
};

export default CursorEffects;
