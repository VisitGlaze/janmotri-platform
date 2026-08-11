import { useState, useEffect, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../../../shared/useCartStore";
import { useLanguage } from "../../../shared/LanguageContext";
import { useAuthStore } from "../../../shared/useAuthStore";
import "./Navbar.scss";

// Decoupled images imported centrally

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auth states
  const { isLoggedIn, userMobile, logoutUser } = useAuthStore();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const { language, setLanguage, t, getImage } = useLanguage();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languagesList = [
    { code: "en", name: "English" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "hi", name: "हिन्दी" }
  ];

  const currentLanguageName = languagesList.find(l => l.code === language)?.name || "English";

  // Reactively calculate total items in the cart
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );
  const clearCart = useCartStore((state) => state.clearCart);

  const navItems = [
    { name: t("common.home", "Home"), path: "/", targetId: null },
    { name: t("common.aboutUs", "About Us"), path: "/about", targetId: null },
    { name: t("common.products", "Products"), path: "/products", targetId: null },
    { name: t("common.review", "Review"), path: "/review", targetId: null },
    { name: t("common.faqs", "FAQs"), path: "/faq", targetId: null },
    { name: t("common.contactUs", "Contact Us"), path: "/contact", targetId: null },
  ];

  const handleNavigation = (item) => {
    setMobileMenuVisible(false);

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

  const isActive = (item) => {
    if (location.pathname === "/about") {
      return item.path === "/about";
    }
    if (location.pathname === "/products" || location.pathname.startsWith("/product/")) {
      return item.path === "/products";
    }
    if (location.pathname === "/review") {
      return item.path === "/review";
    }
    if (location.pathname === "/faq") {
      return item.path === "/faq";
    }
    if (location.pathname === "/contact") {
      return item.path === "/contact";
    }
    return item.path === "/";
  };

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
      }
    };

    updateNavbarHeight();

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      updateNavbarHeight();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateNavbarHeight);

    let resizeObserver;
    if (headerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateNavbarHeight();
      });
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
      if (resizeObserver && headerRef.current) {
        resizeObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className={`navbar ${isSticky ? "is-sticky" : ""}`}>
        <div className="logo" onClick={() => handleNavigation({ path: "/", targetId: null })} style={{ cursor: "pointer" }}>
          <img src={getImage("logo")} alt={t("navbar.logoAlt", "Janmotri Logo")} />
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={isActive(item) ? "active" : ""}
              onClick={() => handleNavigation(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Desktop Right Side (Language + My Account + Shopping Cart) */}
        <div className="nav-right">
          {/* Custom Dropdown language Switcher */}
          <div className="lang-switcher-wrap" ref={dropdownRef}>
            <button className="lang-toggle-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
              <i className="pi pi-globe lang-globe-icon"></i>
              <span>{currentLanguageName}</span>
              <i className={`pi pi-chevron-down lang-chevron ${langDropdownOpen ? "open" : ""}`}></i>
            </button>
            {langDropdownOpen && (
              <ul className="lang-dropdown-menu">
                {languagesList.map((lang) => (
                  <li
                    key={lang.code}
                    className={language === lang.code ? "active" : ""}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                  >
                    {lang.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* {!isLoggedIn ? (
            <button className="login-btn" onClick={() => navigate("/login")}>
              {t("common.login", "Login")}
            </button>
          ) : (
            <div className="user-profile-wrap" ref={userDropdownRef}>
              <button
                className="profile-btn"
                aria-label={t("common.myAccount", "My Account")}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <i className="pi pi-user"></i>
              </button>
              {userDropdownOpen && (
                <ul className="profile-dropdown-menu">
                  <li className="menu-header">
                    <span className="user-phone">{userMobile}</span>
                  </li>
                  <li onClick={() => { setUserDropdownOpen(false); navigate("/profile"); }}>
                    <i className="pi pi-shopping-bag mr-2"></i>
                    <span>{t("common.myOrders", "My Orders")}</span>
                  </li>
                  <li onClick={() => { setUserDropdownOpen(false); navigate("/profile"); }}>
                    <i className="pi pi-heart mr-2"></i>
                    <span>{t("common.wishlist", "Wishlist")}</span>
                  </li>
                  <li onClick={() => { setUserDropdownOpen(false); navigate("/profile"); }}>
                    <i className="pi pi-user-edit mr-2"></i>
                    <span>{t("common.profile", "Profile")}</span>
                  </li>
                  <li className="logout-item" onClick={() => { setUserDropdownOpen(false); logoutUser(); clearCart(); navigate("/"); }}>
                    <i className="pi pi-power-off mr-2"></i>
                    <span>{t("common.logout", "Logout")}</span>
                  </li>
                </ul>
              )}
            </div>
          )} */}

          {isLoggedIn && cartCount > 0 && (
            <button className="cart-btn" aria-label={t("common.shoppingCart", "Shopping Cart")} onClick={() => navigate("/checkout")}>
              <i className="pi pi-shopping-cart"></i>
              <span className="cart-badge">{cartCount}</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Trigger (visible < 1024px) */}
        <div className="mobile-actions">
          {/* Mobile Cart Button */}
          {isLoggedIn && cartCount > 0 && (
            <button className="cart-btn mobile-cart" aria-label={t("common.shoppingCart", "Shopping Cart")} onClick={() => navigate("/checkout")}>
              <i className="pi pi-shopping-cart"></i>
              <span className="cart-badge">{cartCount}</span>
            </button>
          )}

          <Button
            icon="pi pi-bars"
            className="mobile-menu-btn p-button-rounded p-button-text"
            onClick={() => setMobileMenuVisible(true)}
            aria-label={t("navbar.menuAlt", "Menu")}
          />
        </div>
      </header>

      {/* Responsive Slideout Menu Drawer (PrimeReact Sidebar) */}
      <Sidebar
        visible={mobileMenuVisible}
        onHide={() => setMobileMenuVisible(false)}
        position="right"
        className="navbar-mobile-sidebar"
      >
        <div className="sidebar-content">
          <div className="sidebar-logo-wrap" onClick={() => handleNavigation({ path: "/", targetId: null })} style={{ cursor: "pointer" }}>
            <img src={getImage("logo")} alt={t("navbar.logoAlt", "Janmotri Logo")} className="sidebar-logo" />
          </div>

          <ul className="sidebar-links">
            {navItems.map((item) => (
              <li
                key={item.path}
                className={isActive(item) ? "active" : ""}
                onClick={() => handleNavigation(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>

          <div className="sidebar-action">
            {/* Segmented language buttons in mobile view */}
            <div className="mobile-lang-switcher">
              <span className="mobile-lang-label">{t("common.language", "Language")}</span>
              <div className="mobile-lang-buttons">
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    className={`mobile-lang-btn ${language === lang.code ? "active" : ""}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuVisible(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* {!isLoggedIn ? (
              <button className="login-btn w-full mb-3" onClick={() => { setMobileMenuVisible(false); navigate("/login"); }}>
                {t("common.login", "Login")}
              </button>
            ) : (
              <>
                <div className="mobile-user-header mb-3">
                  <i className="pi pi-user mr-2" style={{ color: "#ED1C24" }}></i>
                  <span className="font-semibold" style={{ color: "#333333" }}>{userMobile}</span>
                </div>
                <button className="account-btn w-full mb-3" onClick={() => { setMobileMenuVisible(false); navigate("/profile"); }}>
                  {t("common.myAccount", "My Account")}
                </button>
                <button
                  className="logout-btn-mobile w-full mb-3"
                  onClick={() => { setMobileMenuVisible(false); logoutUser(); clearCart(); navigate("/"); }}
                  style={{
                    background: "rgba(237, 28, 36, 0.08)",
                    color: "#ED1C24",
                    border: "none",
                    padding: "12px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <i className="pi pi-power-off mr-2"></i>
                  <span>{t("common.logout", "Logout")}</span>
                </button>
              </>
            )} */}
            {isLoggedIn && cartCount > 0 && (
              <button className="cart-btn w-full mobile-sidebar-cart" onClick={() => { setMobileMenuVisible(false); navigate("/checkout"); }}>
                <i className="pi pi-shopping-cart mr-2"></i>
                <span>{t("common.cart", "Cart")} ({cartCount})</span>
              </button>
            )}
          </div>
        </div>
      </Sidebar>

      {/* Decorative Wave Divider at Top (fades out on scroll) */}
      <img
        src={getImage("navbarWave")}
        alt="wave"
        className={`navbar-wave ${isSticky ? "hide-wave" : ""}`}
      />
    </>
  );
};

export default Navbar;