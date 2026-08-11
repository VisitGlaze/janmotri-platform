import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { productsData } from "../../../shared/productData";
import { useLanguage } from "../../../shared/LanguageContext";
import "./Account.scss";

// Beautiful inline Avatar SVG mockup
const AvatarSvg = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="avatar-svg">
    <rect width="100" height="100" rx="50" fill="#E5E7EB" />
    {/* Hair/Head contour */}
    <path d="M50 20C36.19 20 25 31.19 25 45C25 50.81 27 56.16 30.34 60.44C30.68 60.88 31.25 61 31.75 60.75C34.34 59.44 38.69 58 44 58C46 58 48 60 50 60C52 60 54 58 56 58C61.31 58 65.66 59.44 68.25 60.75C68.75 61 69.32 60.88 69.66 60.44C73 56.16 75 50.81 75 45C75 31.19 63.81 20 50 20Z" fill="#111827" />
    {/* Neck */}
    <path d="M43 70H57V82H43V70Z" fill="#F3F4F6" />
    {/* Face */}
    <path d="M50 28C39.51 28 31 36.51 31 47C31 54.81 35.81 61.53 42.5 64.25C43.5 64.65 44 65.25 44 66C44 67.5 45.5 69 47 69H53C54.5 69 56 67.5 56 66C56 65.25 56.5 64.65 57.5 64.25C64.19 61.53 69 54.81 69 47C69 36.51 60.49 28 50 28Z" fill="#FCA5A5" />
    {/* Collar/Shirt */}
    <path d="M26 88C34 84 42 80 50 82C58 80 66 84 74 88C75.5 88.8 77 90 77 92V100H23V92C23 90 24.5 88.8 26 88Z" fill="#3B82F6" />
    <path d="M50 82L44 70H56L50 82Z" fill="#FFFFFF" />
    <path d="M50 82L47 70H53L50 82Z" fill="#EF4444" /> {/* Red tie */}
  </svg>
);

// Empty Order State receipt SVG mockup
const ReceiptSvg = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="receipt-svg">
    <rect x="12" y="6" width="40" height="52" rx="4" fill="#FFF5F5" stroke="#E5252A" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M18 16H46" stroke="#E5252A" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 24H38" stroke="#E5252A" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 32H42" stroke="#E5252A" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 40H30" stroke="#E5252A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="44" cy="40" r="3" fill="#E5252A" />
  </svg>
);

export default function Account() {
  const navigate = useNavigate();
  const { t, getImage } = useLanguage();

  const getStatusLabel = (status) => {
    switch (status) {
      case "Delivered": return t("accountPage.tabs.delivered");
      case "Pending": return t("accountPage.tabs.pending");
      case "Cancelled": return t("accountPage.tabs.cancelled");
      default: return status;
    }
  };

  const [profileValues, setProfileValues] = useState(() => {
    const savedProfile = localStorage.getItem("janmotri_profile");
    return savedProfile ? JSON.parse(savedProfile) : {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      pinCode: ""
    };
  });

  const [toastMessage, setToastMessage] = useState("");
  const [orderHistory] = useState(() => {
    const savedOrders = localStorage.getItem("janmotri_orders");
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      const hasOldPrefix = parsed.some(order => order.orderId && order.orderId.startsWith("AO-"));
      if (!hasOldPrefix) {
        return parsed;
      }
    }
    const defaultMockOrders = [
      {
        orderId: "JM-88291",
        date: "June 08, 2026",
        status: "Delivered",
        items: [
          {
            id: 1,
            name: "Janmotri Groundnut Oil",
            imageKey: productsData[0]?.imageKey || "",
            price: 1250,
            quantity: 2
          }
        ],
        subtotal: 2500,
        discount: 0,
        tax: 62.5,
        totalPaid: 2562.5,
        recipient: "Ajay Sharma",
        address: "Flat 402, Royal Residency, City Center, Gwalior - 474011",
        phone: "+91 98765 43210",
        paymentMethod: "upi",
        referralName: "",
        transactionId: "TXN-98218374",
        paymentStatus: "Payment Successful"
      },
      {
        orderId: "JM-88292",
        date: "June 09, 2026",
        status: "Pending",
        items: [
          {
            id: 1,
            name: "Janmotri Groundnut Oil",
            imageKey: productsData[0]?.imageKey || "",
            price: 1250,
            quantity: 1
          }
        ],
        subtotal: 1250,
        discount: 0,
        tax: 31.25,
        totalPaid: 1281.25,
        recipient: "Ajay Sharma",
        address: "Flat 402, Royal Residency, City Center, Gwalior - 474011",
        phone: "+91 98765 43210",
        paymentMethod: "cod",
        referralName: "",
        transactionId: "TXN-28374921",
        paymentStatus: "Payment Pending"
      },
      {
        orderId: "JM-88293",
        date: "May 20, 2026",
        status: "Cancelled",
        items: [
          {
            id: 1,
            name: "Janmotri Groundnut Oil",
            imageKey: productsData[0]?.imageKey || "",
            price: 1250,
            quantity: 2
          }
        ],
        subtotal: 2500,
        discount: 0,
        tax: 62.5,
        totalPaid: 2562.5,
        recipient: "Ajay Sharma",
        address: "Flat 402, Royal Residency, City Center, Gwalior - 474011",
        phone: "+91 98765 43210",
        paymentMethod: "referral",
        referralName: "Janmotri Partner",
        transactionId: "TXN-10293847",
        paymentStatus: "Payment Successful"
      }
    ];
    localStorage.setItem("janmotri_orders", JSON.stringify(defaultMockOrders));
    return defaultMockOrders;
  });
  const [activeTab, setActiveTab] = useState("all"); // all, delivered, pending, cancelled
  const [searchQuery, setSearchQuery] = useState("");

  // Load profile values and order history from localStorage on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, val) => {
    setProfileValues(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    localStorage.setItem("janmotri_profile", JSON.stringify(profileValues));
    setToastMessage(t("accountPage.successToast"));
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // Filter orders based on active tab and search query
  const getFilteredOrders = () => {
    return orderHistory.filter((order) => {
      // Tab filter
      if (activeTab === "delivered" && order.status !== "Delivered") return false;
      if (activeTab === "pending" && order.status !== "Pending") return false;
      if (activeTab === "cancelled" && order.status !== "Cancelled") return false;

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesId = order.orderId.toLowerCase().includes(query);
        const matchesItem = order.items.some(item => item.name.toLowerCase().includes(query));
        return matchesId || matchesItem;
      }

      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  const handleStartShopping = () => {
    navigate("/products");
  };

  return (
    <div className="account-page-root">
      <Navbar />

      <main className="account-main-content shared-container">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="toast-alert-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <i className="pi pi-check-circle mr-2" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="account-stacked-layout">

          {/* ──────────────────────────────────────────────────────── */}
          {/* 1. EDIT PROFILE CARD PANEL (Mockup Reference Redesign) */}
          {/* ──────────────────────────────────────────────────────── */}
          <motion.section
            className="account-card-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="panel-title">{t("accountPage.editProfile")}</h2>

            <form onSubmit={handleSaveChanges} className="profile-edit-form-grid">

              {/* Left Column: Avatar display and edit badge */}
              <div className="avatar-upload-column">
                <div className="avatar-badge-wrapper">
                  <AvatarSvg />
                  <button type="button" className="avatar-edit-pencil-btn" aria-label="Change Avatar">
                    <i className="pi pi-pencil" />
                  </button>
                </div>
              </div>

              {/* Right Column: Address & details fields */}
              <div className="profile-fields-inputs-wrapper">
                <div className="grid-2-cols">
                  <div className="input-field-wrap">
                    <label htmlFor="firstName" className="input-label">{t("accountPage.firstName")}</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder={t("accountPage.firstName")}
                      className="form-input"
                      value={profileValues.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div className="input-field-wrap">
                    <label htmlFor="lastName" className="input-label">{t("accountPage.lastName")}</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder={t("accountPage.lastName")}
                      className="form-input"
                      value={profileValues.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-field-wrap">
                  <label htmlFor="address" className="input-label">{t("accountPage.address")}</label>
                  <input
                    type="text"
                    id="address"
                    placeholder={t("accountPage.address")}
                    className="form-input"
                    value={profileValues.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                <div className="input-field-wrap">
                  <label htmlFor="apartment" className="input-label">{t("accountPage.apartment")}</label>
                  <input
                    type="text"
                    id="apartment"
                    placeholder={t("accountPage.apartment")}
                    className="form-input"
                    value={profileValues.apartment}
                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                  />
                </div>

                <div className="grid-2-cols">
                  <div className="input-field-wrap">
                    <label htmlFor="city" className="input-label">{t("accountPage.city")}</label>
                    <input
                      type="text"
                      id="city"
                      placeholder={t("accountPage.city")}
                      className="form-input"
                      value={profileValues.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="input-field-wrap">
                    <label htmlFor="pinCode" className="input-label">{t("accountPage.pinCode")}</label>
                    <input
                      type="text"
                      id="pinCode"
                      placeholder={t("accountPage.pinCode")}
                      className="form-input"
                      value={profileValues.pinCode}
                      onChange={(e) => handleInputChange("pinCode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-action-btn-row mt-6">
                  <motion.button
                    type="submit"
                    className="save-profile-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("common.saveChanges")}
                  </motion.button>
                </div>
              </div>

            </form>
          </motion.section>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 2. MY ORDER LIST PANEL (Mockup Reference Redesign) */}
          {/* ──────────────────────────────────────────────────────── */}
          <motion.section
            className="account-card-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >

            {/* Header with Title and Search input */}
            <div className="order-panel-header-row">
              <h2 className="panel-title">{t("accountPage.myOrder")}</h2>

              <div className="search-orders-input-wrap">
                <i className="pi pi-search search-icon-tag" />
                <input
                  type="text"
                  placeholder={t("accountPage.findOrders")}
                  className="search-input-box"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Tabs Row */}
            <div className="order-filter-tabs-row">
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                {t("accountPage.tabs.all")}
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === "delivered" ? "active" : ""}`}
                onClick={() => setActiveTab("delivered")}
              >
                {t("accountPage.tabs.delivered")}
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                {t("accountPage.tabs.pending")}
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${activeTab === "cancelled" ? "active" : ""}`}
                onClick={() => setActiveTab("cancelled")}
              >
                {t("accountPage.tabs.cancelled")}
              </button>
            </div>

            {/* Content: Orders List or Empty state */}
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div
                  key="empty-state"
                  className="empty-orders-inner-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="empty-receipt-wrap">
                    <ReceiptSvg />
                  </div>
                  <h3 className="empty-header-title">{t("accountPage.emptyOrders")}</h3>
                  <p className="empty-desc-text">{t("accountPage.emptyOrdersDesc")}</p>
                  <motion.button
                    type="button"
                    className="start-shopping-action-btn"
                    onClick={handleStartShopping}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="pi pi-shopping-cart" />
                    <span>{t("accountPage.startShopping")}</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="orders-list"
                  className="order-history-items-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredOrders.map((order, idx) => {
                    const statusColors = {
                      Delivered: "status-green",
                      Pending: "status-amber",
                      Cancelled: "status-red"
                    };

                    const primaryItem = order.items?.[0] || {
                      name: "Janmotri Groundnut Oil",
                      imageKey: productsData[0]?.imageKey || ""
                    };

                    return (
                      <motion.div
                        key={`${order.orderId}-${idx}`}
                        className="order-item-row-card"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}
                      >
                        <div className="order-row-left-content">
                          <div className="order-product-thumbnail-box">
                            <img src={getImage(primaryItem.imageKey)} alt={primaryItem.name} className="product-thumbnail-img" />
                          </div>
                          <div className="order-product-details">
                            <h4 className="order-product-name">{primaryItem.name}</h4>
                            <div className="order-meta-info">
                              <span className="order-number-text">Order #{order.orderId}</span>
                              <span className="meta-divider-dot">&bull;</span>
                              <span className="order-date-text">{order.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="order-row-right-content">
                          <span className={`status-badge-pill ${statusColors[order.status] || "status-amber"}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <button
                            type="button"
                            className="track-package-btn"
                            onClick={() => navigate(`/track/${order.orderId}`)}
                          >
                            <i className="pi pi-map-marker" />
                            <span>{t("accountPage.trackPackage")}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
