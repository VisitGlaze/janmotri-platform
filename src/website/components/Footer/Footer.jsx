import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../../shared/LanguageContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "./Footer.scss";

// Decoupled image keys resolved from centralized config
const instaPostsKeys = ["insta1", "insta2", "insta3", "insta4", "insta5", "insta6"];

export default function Footer({ hideInstagram = false }) {
  const footerRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, getImage } = useLanguage();

  const navItems = [
    { name: t("common.home", "Home"), path: "/", targetId: null },
    { name: t("common.aboutUs", "About Us"), path: "/about", targetId: null },
    { name: t("common.products", "Products"), path: "/products", targetId: null },
    { name: t("common.review", "Review"), path: "/review", targetId: null },
    { name: t("common.faqs", "FAQs"), path: "/faq", targetId: null },
    { name: t("common.contactUs", "Contact Us"), path: "/contact", targetId: null },
  ];

  const contactInfo =
    [
      {
        //address
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
          </svg>
        ),
        label: t("footer.address", "Address:"),
        value: t("footer.addressVal", "93 Plot No: 1 Radhamani Park, Near Matridham Mandir, Akwada, Bhavnagar"),
        href: "https://maps.app.goo.gl/BacvLQVaLaRCebG26",
      },
      {
        //call
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor" />
          </svg>
        ),
        label: t("footer.callUs", "Call Us:"),
        value: "+91 90999 08309",
        href: "tel:+919099908309",
      },
      {
        //email
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
          </svg>
        ),
        label: t("footer.email", "Email:"),
        value: "janmotrioilandfoodproducts@gmail.com",
        href: "mailto:janmotrioilandfoodproducts@gmail.com",
      },
    ];

  const legalLinks = [
    { name: t("footer.privacyPolicy", "Privacy Policy"), path: "/privacy-policy" },
    { name: t("footer.termsConditions", "Terms & Conditions"), path: "/terms-and-conditions" },
    { name: t("footer.returnReplacementPolicy", "Return & Replacement Policy"), path: "/return-replacement-policy" },
    { name: t("footer.shippingPolicy", "Shipping Policy"), path: "/shipping-policy" }
  ];

  const handleNavigation = (item) => {
    if (item.path === "/about") {
      navigate("/about");
      return;
    }

    if (item.path === "/products") {
      navigate("/products");
      return;
    }

    if (item.path === "/review") {
      navigate("/review");
      return;
    }

    if (item.path === "/faq") {
      navigate("/faq");
      return;
    }

    if (item.path === "/contact") {
      navigate("/contact");
      return;
    }

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToId: item.targetId || "top" } });
    } else {
      if (item.targetId) {
        const element = document.getElementById(item.targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.05 }
    );
    if (footerRef.current) obs.observe(footerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className={`ft-root ${hideInstagram ? "ft-no-insta" : ""}`} ref={footerRef}>

      {/* ══ INSTAGRAM SECTION (Light Cream backdrop) ══════════════════════════════ */}
      {!hideInstagram && (
        <div className={`ft-insta-section ${entered ? "ft-reveal" : ""}`} style={{ "--rd": "0s" }}>
          <div className="ft-insta-header">
            <h3 className="ft-insta-title">{t("footer.followInstagram", "Follow us on Instagram")}</h3>
            <a
              href="https://www.instagram.com/janmotri_oil/?hl=en"
              className="ft-insta-handle"
              target="_blank"
              rel="noreferrer"
            >
              @janmotri_oil
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Instagram Swipe Slider (Swiper Integration) */}
          <div className="ft-insta-carousel-wrap">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              navigation={{
                prevEl: ".ft-insta-prev",
                nextEl: ".ft-insta-next"
              }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 }
              }}
              className="ft-insta-swiper"
            >
              {instaPostsKeys.map((key, index) => (
                <SwiperSlide key={key}>
                  <div className="ft-insta-card">
                    <a href="https://www.instagram.com/janmotri_oil/?hl=en" target="_blank" rel="noreferrer">
                      <img src={getImage(key)} alt={`Janmotri Post ${index + 1}`} />
                      <div className="ft-insta-card__hover"></div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Premium Custom Navigation Buttons */}
            <button type="button" className="ft-insta-nav-btn ft-insta-prev" aria-label="Previous Slide">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="ft-insta-nav-btn ft-insta-next" aria-label="Next Slide">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ══ WAVE SEPARATOR (Cream to Charcoal Blend) ═════════════════════ */}
      <div className="ft-wave">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,90 Q360,20 720,60 T1440,70 L1440,120 L0,120 Z" fill="#E7E7E7" />
        </svg>
      </div>

      {/* ══ MAIN FOOTER BODY (Charcoal Background) ═══════════════════════════════ */}
      <div className="ft-body">

        {/* Floating background oil droplets */}
        <div className="oil-drop drop-1"></div>
        <div className="oil-drop drop-2"></div>
        <div className="oil-drop drop-3"></div>
        <div className="oil-drop drop-4"></div>

        <div className="ft-grid">

          {/* Col 1: Brand Info */}
          <div className={`ft-col ft-col--brand ${entered ? "ft-reveal" : ""}`} style={{ "--rd": ".1s" }}>
            <img
              src={getImage("logo")}
              alt="Janmotri"
              className="ft-logo"
              onClick={() => handleNavigation({ path: "/", targetId: null })}
              style={{ cursor: "pointer" }}
            />
            <p
              className="ft-brand-name"
              onClick={() => handleNavigation({ path: "/", targetId: null })}
              style={{ cursor: "pointer" }}
            >
              {t("footer.brandTitle", "Janmotri Oil & Food Products")}
            </p>
            <div className="ft-badges">
              <img src={getImage("fssai")} alt="FSSAI" className="ft-badge" />
              <span className="ft-divider"></span>
              <img src={getImage("iso")} alt="ISO" className="ft-badge" />
              <span className="ft-divider"></span>
              <img src={getImage("makeInIndia")} alt="Make In India" className="ft-badge" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className={`ft-col ft-col--links ${entered ? "ft-reveal" : ""}`} style={{ "--rd": ".2s" }}>
            <h4 className="ft-col__heading">{t("footer.quickLinks", "Navigation")}</h4>
            <ul className="ft-links">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item);
                    }}
                  >
                    <span className="ft-links__text">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal links */}
          <div className={`ft-col ft-col--legal ${entered ? "ft-reveal" : ""}`} style={{ "--rd": ".4s" }}>
            <h4 className="ft-col__heading">{t("footer.information", "Information")}</h4>
            <ul className="ft-links">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.path);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span className="ft-links__text">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact details */}
          <div className={`ft-col ft-col--contact ${entered ? "ft-reveal" : ""}`} style={{ "--rd": ".3s" }}>
            <h4 className="ft-col__heading">{t("footer.brandTitle", "Janmotri Oil & Food Products")}</h4>
            <ul className="ft-contact">
              {contactInfo.map((c, i) => (
                <li key={i}>
                  <span className="ft-contact__icon">{c.icon}</span>
                  <div>
                    <span className="ft-contact__label">{c.label}</span>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="ft-contact__val"
                    >
                      {c.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom copyright & social media buttons */}
        <div className="ft-bottom-wrapper">
          <div className={`ft-bottom ${entered ? "ft-reveal" : ""}`} style={{ "--rd": ".5s" }}>
            <p className="ft-copy">{t("footer.allRightsReserved", "© 2026 Janmotri Foods. All Rights Reserved.")}</p>
            <div className="ft-social">
              <a href="https://www.facebook.com/janmotrioil" target="_blank" rel="noreferrer" className="ft-social__btn facebook" aria-label="Facebook">
                <i className="pi pi-facebook"></i>
              </a>
              <a href="https://in.linkedin.com/in/janmotri-oil-and-food-products-74769b384" target="_blank" rel="noreferrer" className="ft-social__btn linkedin" aria-label="LinkedIn">
                <i className="pi pi-linkedin"></i>
              </a>
              {/* <a href="#" className="ft-social__btn twitter" aria-label="Twitter">
                <i className="pi pi-twitter"></i>
              </a> */}
              <a href="https://www.instagram.com/janmotri_oil/?hl=en" target="_blank" rel="noreferrer" className="ft-social__btn instagram" aria-label="Instagram">
                <i className="pi pi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Peanut Ticker at very bottom of page */}
        <div className="ft-marquee">
          <div className="ft-marquee-track">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="ft-marquee-item">
                <img src={getImage("peanut")} alt="peanut icon" />
                <span>{t("footer.brandMarquee", "Janmotri Groundnut Oil")}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}