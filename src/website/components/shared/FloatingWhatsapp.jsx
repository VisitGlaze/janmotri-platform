import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./FloatingWhatsapp.scss";

export default function FloatingWhatsapp() {
  const location = useLocation();

  // Hide on admin panel pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.a
      href="https://wa.me/919081619797"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="whatsapp-pulse-ring"></div>
      <i className="pi pi-whatsapp whatsapp-icon" />
      <span className="whatsapp-tooltip-label">Chat with Us</span>
    </motion.a>
  );
}
