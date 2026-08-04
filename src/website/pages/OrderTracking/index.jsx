import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCartStore } from "../../../shared/useCartStore";
import { useLanguage } from "../../../shared/LanguageContext";
import "./OrderTracking.scss";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { t, getImage } = useLanguage();

  const getPaymentMethodLabel = (method) => {
    switch (method?.toLowerCase()) {
      case "cod": return t("checkoutPage.paymentForm.cod");
      case "upi": return t("checkoutPage.paymentForm.upi");
      case "referral": return t("checkoutPage.paymentForm.referral");
      default: return method;
    }
  };

  const getPaymentStatusLabel = (status) => {
    if (status === "Payment Successful") {
      return t("orderTracking.paySuccess");
    }
    if (status === "Payment Pending") {
      return t("orderTracking.payPending");
    }
    return status;
  };

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Retrieve order details from localStorage
    const savedOrders = localStorage.getItem("janmotri_orders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      const matchedOrder = parsedOrders.find(
        (o) => o.orderId.toLowerCase() === orderId.toLowerCase()
      );
      setOrder(matchedOrder || null);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-tracking-page-root">
        <Navbar />
        <div className="loading-container shared-container">
          <i className="pi pi-spin pi-spinner loading-spinner" />
          <p>{t("orderTracking.loading")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-page-root">
        <Navbar />
        <div className="error-not-found-container shared-container">
          <div className="error-icon-box">
            <i className="pi pi-exclamation-circle" />
          </div>
          <h2>{t("orderTracking.notFound")}</h2>
          <p>{t("orderTracking.notFoundDesc")} <strong>{orderId}</strong>.</p>
          <p className="sub-hint">{t("orderTracking.notFoundHint")}</p>
          <button type="button" className="error-back-btn" onClick={() => navigate("/profile")}>
            {t("checkoutPage.success.accountBtn")}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Determine timeline configuration
  const isCancelled = order.status === "Cancelled";
  
  const getTimelineConfig = () => {
    if (isCancelled) {
      return {
        stages: [
          { label: t("orderTracking.stages.placed"), date: order.date, completed: true },
          { 
            label: t("orderTracking.stages.payment"), 
            date: order.paymentStatus === "Payment Successful" ? order.date : "", 
            completed: order.paymentStatus === "Payment Successful" 
          },
          { label: t("orderTracking.stages.cancelled"), date: order.date, completed: true, active: true }
        ],
        theme: "cancelled"
      };
    }

    const standardStages = [
      { key: "Placed", label: t("orderTracking.stages.placed") },
      { key: "Payment", label: t("orderTracking.stages.payment") },
      { key: "Processing", label: t("orderTracking.stages.processing") },
      { key: "Packed", label: t("orderTracking.stages.packed") },
      { key: "Shipped", label: t("orderTracking.stages.shipped") },
      { key: "OutForDelivery", label: t("orderTracking.stages.outForDelivery") },
      { key: "Delivered", label: t("orderTracking.stages.delivered") }
    ];

    let activeIndex = 0;
    if (order.status === "Pending") {
      activeIndex = order.paymentStatus === "Payment Successful" ? 1 : 0;
    } else if (order.status === "Processing") {
      activeIndex = 2;
    } else if (order.status === "Packed") {
      activeIndex = 3;
    } else if (order.status === "Shipped") {
      activeIndex = 4;
    } else if (order.status === "Out For Delivery" || order.status === "OutForDelivery") {
      activeIndex = 5;
    } else if (order.status === "Delivered") {
      activeIndex = 6;
    }

    return {
      stages: standardStages.map((stage, idx) => ({
        label: stage.label,
        completed: idx <= activeIndex,
        active: idx === activeIndex,
        date: idx === activeIndex ? "Today" : idx < activeIndex ? order.date : ""
      })),
      theme: "standard"
    };
  };

  const timeline = getTimelineConfig();

  // Buy again action
  const handleBuyAgain = (item) => {
    addToCart(item, item.quantity || 1);
    navigate("/checkout");
  };

  // WhatsApp Support click helper
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(`Hi Janmotri Support, I need help with my Order ID: ${order.orderId}.`);
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  };

  // Print Invoice helper
  const handlePrint = () => {
    window.print();
  };

  // Calculate estimated delivery date
  const getDeliveryEstimate = () => {
    if (isCancelled) return t("orderTracking.estimateCancelled");
    if (order.status === "Delivered") return `${t("orderTracking.estimateDelivered")} ${order.date}`;
    return t("orderTracking.estimatePending");
  };

  return (
    <div className="order-tracking-page-root">
      <Navbar />

      <main className="order-tracking-main shared-container">
        
        {/* Breadcrumbs / Back navigation */}
        <div className="tracking-navigation-header">
          <button type="button" className="back-link-btn" onClick={() => navigate("/profile")}>
            <i className="pi pi-arrow-left" />
            <span>{t("orderTracking.backDashboard")}</span>
          </button>
        </div>

        {/* Top Order Brief Banner */}
        <motion.div 
          className="order-brief-banner"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="banner-details">
            <span className="order-id-label">ORDER #{order.orderId}</span>
            <h1 className="banner-title">{t("orderTracking.title")}</h1>
            <p className="banner-estimate">
              <i className="pi pi-calendar" />
              <span>{getDeliveryEstimate()}</span>
            </p>
          </div>
          
          <div className="banner-actions">
            <button type="button" className="action-btn invoice-btn" onClick={handlePrint}>
              <i className="pi pi-print" />
              <span>{t("common.printInvoice")}</span>
            </button>
            <button type="button" className="action-btn support-btn" onClick={handleWhatsAppClick}>
              <i className="pi pi-whatsapp" />
              <span>{t("common.whatsappSupport")}</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Timeline Component */}
        <motion.div 
          className={`timeline-panel-card ${timeline.theme}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="timeline-title-row">
            <i className="pi pi-map-marker" />
            <span>{t("orderTracking.progressTitle")}</span>
          </h3>

          <div className="timeline-stepper-container">
            {timeline.stages.map((stage, idx) => {
              let nodeClass = "step-node";
              if (stage.active) nodeClass += " active";
              else if (stage.completed) nodeClass += " completed";
              else nodeClass += " pending";

              return (
                <div key={idx} className={nodeClass}>
                  {idx > 0 && <div className="step-connector-line" />}
                  
                  <div className="step-node-point">
                    {stage.completed && !stage.active ? (
                      <i className="pi pi-check" />
                    ) : stage.active ? (
                      <div className="pulsing-inner-dot" />
                    ) : null}
                  </div>

                  <div className="step-node-text-wrap">
                    <span className="step-label">{stage.label}</span>
                    {stage.date && <span className="step-date">{stage.date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 2-Column Details Grid */}
        <div className="tracking-details-columns-layout">
          
          {/* Left Column: Items and Payments */}
          <div className="details-left-column">
            
            {/* Order Items Card */}
            <motion.div 
              className="details-card-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="card-header-title">
                <i className="pi pi-shopping-bag" />
                <span>{t("orderTracking.itemsTitle")}</span>
              </h3>

              <div className="order-items-list-wrapper">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="item-row-row">
                    <div className="item-thumbnail-box">
                      <img src={getImage(item.imageKey)} alt={item.name} />
                    </div>
                    <div className="item-details-meta">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-qty-price">
                        {t("productDetail.quantity")}: <strong>{item.quantity}</strong> &bull; ₹{item.price.toFixed(2)} {t("common.each")}
                      </p>
                      <div className="item-action-row">
                        <button 
                          type="button" 
                          className="item-action-link"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {t("orderTracking.viewProduct")}
                        </button>
                        <span className="link-divider">|</span>
                        <button 
                          type="button" 
                          className="item-action-link primary"
                          onClick={() => handleBuyAgain(item)}
                        >
                          {t("orderTracking.buyAgain")}
                        </button>
                      </div>
                    </div>
                    <div className="item-final-price-column">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Tracking Card */}
            <motion.div 
              className="details-card-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="card-header-title">
                <i className="pi pi-wallet" />
                <span>{t("orderTracking.paymentTitle")}</span>
              </h3>

              <div className="payment-tracking-grid">
                <div className="summary-pricing-rows">
                  <div className="price-line">
                    <span className="label">{t("common.subtotal")}</span>
                    <span className="value">₹{(order.subtotal || order.totalPaid).toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="price-line">
                      <span className="label">{t("common.discount")}</span>
                      <span className="value savings">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="price-line">
                    <span className="label">{t("common.tax")}</span>
                    <span className="value">₹{(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="price-line">
                    <span className="label">{t("common.deliveryCharge")}</span>
                    <span className="value free">{t("common.free")}</span>
                  </div>
                  <div className="price-line total-highlight">
                    <span className="label">{t("common.grandTotal")}</span>
                    <span className="value">₹{order.totalPaid.toFixed(2)}</span>
                  </div>
                </div>

                <div className="payment-meta-details-card">
                  <div className="meta-row">
                    <span className="meta-label">{t("orderTracking.method")}</span>
                    <span className="meta-value text-uppercase">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">{t("orderTracking.status")}</span>
                    <span className={`meta-value badge ${order.paymentStatus === "Payment Successful" ? "success" : "pending"}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">{t("orderTracking.txnId")}</span>
                    <span className="meta-value font-mono">{order.transactionId || "N/A"}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">{t("orderTracking.orderDate")}</span>
                    <span className="meta-value">{order.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Address and Need Help */}
          <div className="details-right-column">
            
            {/* Delivery Address Card */}
            <motion.div 
              className="details-card-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h3 className="card-header-title">
                <i className="pi pi-map-marker" />
                <span>{t("orderTracking.shippingTitle")}</span>
              </h3>
              
              <div className="shipping-address-box">
                <h4 className="recipient-name">{order.recipient}</h4>
                <p className="address-body-text">{order.address}</p>
                <div className="phone-line-wrap">
                  <i className="pi pi-phone" />
                  <span>{order.phone}</span>
                </div>
              </div>
            </motion.div>

            {/* Help & Support Card */}
            <motion.div 
              className="details-card-block help-card-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h3 className="card-header-title no-border">
                <i className="pi pi-question-circle" />
                <span>{t("orderTracking.helpTitle")}</span>
              </h3>
              
              <p className="help-box-description">
                {t("orderTracking.helpDesc")}
              </p>
              
              <button type="button" className="help-whatsapp-btn" onClick={handleWhatsAppClick}>
                <i className="pi pi-whatsapp" />
                <span>{t("orderTracking.helpBtn")}</span>
              </button>
            </motion.div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
