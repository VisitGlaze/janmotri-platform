import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CheckoutStepsSection from "./CheckoutStepsSection/CheckoutStepsSection";
import CheckoutFormSection from "./CheckoutFormSection/CheckoutFormSection";
import OrderSummarySection from "./OrderSummarySection/OrderSummarySection";
import { useCartStore } from "../../../shared/useCartStore";
import { productsData } from "../../../shared/productData";
import { useLanguage } from "../../../shared/LanguageContext";
import "./Checkout.scss";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, addToCart, clearCart } = useCartStore();
  const { t, getImage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState("");
  
  // Checkout form fields state dynamically initialized from profile details or empty
  const [formValues, setFormValues] = useState(() => {
    const savedProfile = localStorage.getItem("janmotri_profile");
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    return {
      email: profile.email || "",
      newsOffers: false,
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      address: profile.address || "",
      apartment: profile.apartment || "",
      city: profile.city || "",
      pinCode: profile.pinCode || "",
      paymentMethod: "referral", // referral, upi, cod
      referralName: "",
      upiId: "",
    };
  });

  // Keep details for the success and cancellation pages after cart is cleared
  const [orderSummaryInfo, setOrderSummaryInfo] = useState(null);

  // Cancellation Questionnaire states (Reference Image 3)
  const [selectedReason, setSelectedReason] = useState("");
  const [customReasonText, setCustomReasonText] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateStep1 = () => {
    const { email, firstName, lastName, address, city, pinCode } = formValues;

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError(t("common.requiredEmail"));
      return false;
    }
    if (!firstName.trim()) {
      setValidationError(t("common.requiredFirstName"));
      return false;
    }
    if (!lastName.trim()) {
      setValidationError(t("common.requiredLastName"));
      return false;
    }
    if (!address.trim()) {
      setValidationError(t("common.requiredAddress"));
      return false;
    }
    if (!city.trim()) {
      setValidationError(t("common.requiredCity"));
      return false;
    }
    if (!pinCode.trim() || pinCode.trim().length !== 6 || isNaN(pinCode)) {
      setValidationError(t("common.requiredPinCode"));
      return false;
    }

    setValidationError("");
    return true;
  };

  const validateStep2 = () => {
    const { paymentMethod, referralName, upiId } = formValues;

    if (paymentMethod === "referral") {
      if (!referralName.trim()) {
        setValidationError(t("common.requiredReferral"));
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (upiId.trim() !== "" && !upiId.includes("@")) {
        setValidationError(t("common.requiredUpi"));
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  // Triggered by the sidebar Confirm button
  const handleSidebarAction = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 3) {
      // Placing order!
      const orderId = `JM-${Math.floor(10000 + Math.random() * 90000)}`; // match wireframe #JM-XXXXX
      const subtotal = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
      const discount = cart.reduce((acc, item) => acc + ((item.originalPrice - item.price) * item.quantity), 0);
      const tax = Math.round(cart.reduce((acc, item) => acc + (item.price * item.quantity * 0.025), 0));
      const totalPaid = subtotal - discount;

      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        imageKey: item.imageKey,
        price: item.price,
        quantity: item.quantity
      }));

      // Store in localStorage for My Account Dashboard Page
      const savedProfile = localStorage.getItem("janmotri_profile");
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      const phoneNum = profile.phone || "+91 98765 43210";

      const newOrder = {
        orderId,
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
        status: "Pending",
        items: orderItems,
        subtotal,
        discount,
        tax,
        totalPaid,
        recipient: `${formValues.firstName} ${formValues.lastName}`,
        address: `${formValues.address}${formValues.apartment ? `, ${formValues.apartment}` : ""}, ${formValues.city} - ${formValues.pinCode}`,
        phone: phoneNum,
        paymentMethod: formValues.paymentMethod,
        referralName: formValues.referralName || "",
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        paymentStatus: formValues.paymentMethod === "cod" ? "Payment Pending" : "Payment Successful"
      };

      const savedOrders = localStorage.getItem("janmotri_orders");
      const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem("janmotri_orders", JSON.stringify([newOrder, ...currentOrders]));

      setOrderSummaryInfo({
        orderId,
        subtotal,
        discount,
        tax,
        totalPaid,
        email: formValues.email,
        paymentMethod: formValues.paymentMethod,
        recipient: `${formValues.firstName} ${formValues.lastName}`,
        address: `${formValues.address}${formValues.apartment ? `, ${formValues.apartment}` : ""}, ${formValues.city} - ${formValues.pinCode}`,
        items: [...cart] // Backup items for cancellation/success display after cart is cleared
      });

      // Advance to step 4 (Success state)
      setCurrentStep(4);
      // Clear shopping cart
      clearCart();
      window.scrollTo(0, 0);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  // 1. Render Checkout Form & Sidebar layout (Steps 1, 2, 3)
  const renderCheckoutLayout = () => (
    <div className="checkout-grid-layout">
      {/* Left Column - Stepper & Form */}
      <div className="checkout-left-column">
        <CheckoutStepsSection currentStep={currentStep} />
        
        <CheckoutFormSection 
          currentStep={currentStep}
          formValues={formValues}
          setFormValues={setFormValues}
          onBack={handleBackStep}
          validationError={validationError}
          setValidationError={setValidationError}
        />
      </div>

      {/* Right Column - Summary & Action Button */}
      <div className="checkout-right-column">
        <OrderSummarySection 
          formValues={formValues}
          currentStep={currentStep}
          onActionClick={handleSidebarAction}
        />
      </div>
    </div>
  );

  // 2. Render Order Success Screen (Step 4 - Reference Image 2)
  const renderSuccessState = () => {
    if (!orderSummaryInfo) return null;

    return (
      <motion.div 
        className="checkout-placed-success-layout"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CheckoutStepsSection currentStep={3} />

        <div className="success-header-panel mt-6" style={{ background: "white", padding: "48px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 10px 30px rgba(0,0,0,0.01)", textAlign: "center" }}>
          <div className="success-icon-wrap" style={{ fontSize: "64px", color: "#10b981", marginBottom: "20px" }}>
            <i className="pi pi-check-circle" />
          </div>
          <h2 className="success-title" style={{ fontSize: "30px", fontWeight: "800", color: "#111", margin: "0 0 8px" }}>{t("checkoutPage.success.title")}</h2>
          <span className="success-subtitle-id" style={{ fontSize: "13px", fontWeight: "800", color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>ORDER #{orderSummaryInfo.orderId} • {t("checkoutPage.success.processed")}</span>
          <p style={{ marginTop: "16px", color: "#4b5563", fontSize: "15px", fontFamily: "Poppins, sans-serif" }}>
            {t("checkoutPage.success.desc")}
          </p>
          
          <div className="success-actions-wrap" style={{ marginTop: "36px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button 
              type="button" 
              className="primary-btn" 
              onClick={() => navigate(`/track/${orderSummaryInfo.orderId}`)}
            >
              <span className="btn-label">{t("checkoutPage.success.trackBtn")}</span>
              <div className="btn-arrow-circle">&rarr;</div>
            </button>
            <button 
              type="button" 
              className="save-profile-btn" 
              style={{ padding: "12px 28px", border: "1.5px solid #e5e7eb", background: "white", color: "#4b5563", borderRadius: "10px", fontWeight: "800", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              {t("checkoutPage.success.accountBtn")}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // 3. Render Cancellation Questionnaire (Step 5 - Reference Image 3)
  const renderCancelQuestionnaire = () => {
    const reasonsList = t("checkoutPage.cancellation.reasons") || [];

    const handleSubmitCancellation = () => {
      if (!selectedReason) {
        setValidationError(t("common.requiredCancelReason"));
        return;
      }
      const isAnotherReason = selectedReason === reasonsList[reasonsList.length - 1];
      if (isAnotherReason && !customReasonText.trim()) {
        setValidationError(t("common.requiredCancelCustom"));
        return;
      }

      setValidationError("");
      const finalReasonText = isAnotherReason ? customReasonText : selectedReason;
      setCancellationReason(finalReasonText);

      // Update order status in localStorage to Cancelled
      if (orderSummaryInfo) {
        const savedOrders = localStorage.getItem("janmotri_orders");
        if (savedOrders) {
          const currentOrders = JSON.parse(savedOrders);
          const updatedOrders = currentOrders.map(ord => {
            if (ord.orderId === orderSummaryInfo.orderId) {
              return { ...ord, status: "Cancelled" };
            }
            return ord;
          });
          localStorage.setItem("janmotri_orders", JSON.stringify(updatedOrders));
        }
      }

      // Advance to step 6 (Order Cancelled screen)
      setCurrentStep(6);
      window.scrollTo(0, 0);
    };

    return (
      <motion.div 
        className="checkout-cancel-questionnaire-layout"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="cancel-title">{t("checkoutPage.cancellation.title")}</h2>
        <p className="cancel-subtitle">{t("checkoutPage.cancellation.subtitle")}</p>

        <div className="reasons-radio-list">
          {reasonsList.map((reason) => {
            const isChecked = selectedReason === reason;
            return (
              <div 
                key={reason}
                className={`reason-radio-item ${isChecked ? "active" : ""}`}
                onClick={() => {
                  setValidationError("");
                  setSelectedReason(reason);
                }}
              >
                <div className={`custom-radio ${isChecked ? "checked" : ""}`} />
                <span className="reason-text">{reason}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea shown always as placeholder or when Another reason is selected */}
        <textarea 
          placeholder={t("checkoutPage.cancellation.commentPlaceholder")} 
          className="reason-comment-textarea"
          value={customReasonText}
          onChange={(e) => {
            setValidationError("");
            setCustomReasonText(e.target.value);
          }}
          disabled={!selectedReason || selectedReason !== reasonsList[reasonsList.length - 1]}
        />

        {validationError && (
          <div className="error-alert-bar mt-4">
            <i className="pi pi-exclamation-circle mr-2" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="action-buttons-row">
          <button 
            type="button" 
            className="submit-cancel-btn"
            onClick={handleSubmitCancellation}
          >
            {t("checkoutPage.cancellation.cancelBtn")}
          </button>
          <button 
            type="button" 
            className="go-back-btn"
            onClick={() => {
              setCurrentStep(4); // Return to success screen
              window.scrollTo(0, 0);
            }}
          >
            {t("checkoutPage.cancellation.goBack")}
          </button>
        </div>
      </motion.div>
    );
  };

  // 4. Render Order Cancelled Screen (Step 6 - Reference Image 1)
  const renderCancelledSuccessState = () => {
    if (!orderSummaryInfo) return null;

    const handleBuyAgain = () => {
      // Add items back into cart
      orderSummaryInfo.items.forEach(item => {
        addToCart(item, item.quantity);
      });
      // Go back to Checkout Step 1
      setCurrentStep(1);
      window.scrollTo(0, 0);
    };

    return (
      <motion.div 
        className="checkout-cancelled-success-layout"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="cancelled-header-panel">
          <h2 className="cancelled-title">{t("checkoutPage.cancelled.title")}</h2>
          <p className="cancelled-subtitle">
            {t("checkoutPage.cancelled.subtitle")}
          </p>
          <span className="cancelled-order-id">ORDER #{orderSummaryInfo.orderId}</span>
        </div>

        {/* Refund Tracking Stepper */}
        <div className="refund-tracker-panel mt-6">
          <div className="tracker-header-row">
            <span className="tracker-title">{t("checkoutPage.cancelled.refundStatus")}</span>
            <span className="tracker-badge-status">{t("checkoutPage.cancelled.inProgress")}</span>
          </div>
          
          <div className="refund-progress-line-container">
            <div className="progress-line-bg" />
            <div className="progress-line-fill" />
            
            <div className="progress-step-node">
              <div className="node-circle completed">
                <i className="pi pi-check" />
              </div>
              <span className="node-label completed">{t("checkoutPage.cancelled.timeline.cancelled")}</span>
            </div>

            <div className="progress-step-node">
              <div className="node-circle active" />
              <span className="node-label active">{t("checkoutPage.cancelled.timeline.procedure")}</span>
            </div>

            <div className="progress-step-node">
              <div className="node-circle" />
              <span className="node-label">{t("checkoutPage.cancelled.timeline.perfect")}</span>
            </div>
          </div>
        </div>

        <div className="cancelled-main-grid mt-6">
          
          {/* Left: items & payment list */}
          <div className="checkout-left-column">
            
            {/* Items Card */}
            <div className="cancelled-card-block">
              <h4 className="card-title-row">
                <i className="pi pi-shopping-bag title-icon" />
                <span>{t("checkoutPage.cancelled.itemsTitle")}</span>
              </h4>

              <div className="cancelled-items-list-block">
                {orderSummaryInfo.items.map((item) => (
                  <div key={item.id} className="item-row">
                    <div className="item-img-box">
                      <img src={getImage(item.imageKey)} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h5 className="item-name">{item.name}</h5>
                      <div className="item-meta-row-cancel">
                        <span className="item-qty">{t("productDetail.quantity")}: {item.quantity}</span>
                        <button type="button" className="buy-again-link" onClick={handleBuyAgain}>
                          {t("checkoutPage.cancelled.buyAgain")}
                        </button>
                      </div>
                    </div>
                    <div className="item-price">
                      ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details card */}
            <div className="cancelled-card-block">
              <h4 className="card-title-row">
                <i className="pi pi-wallet title-icon" />
                <span>{t("checkoutPage.cancelled.paymentTitle")}</span>
              </h4>

              <div className="cancelled-payment-summary-block">
                <div className="pricing-row">
                  <span className="label">{t("common.subtotal")}</span>
                  <span className="val">₹{orderSummaryInfo.subtotal.toFixed(2)}</span>
                </div>
                <div className="pricing-row">
                  <span className="label">{t("common.discount")}</span>
                  <span className="val">-₹{orderSummaryInfo.discount.toFixed(2)}</span>
                </div>
                <div className="pricing-row">
                  <span className="label">{t("common.deliveryCharge")}</span>
                  <span className="val">{t("common.free")}</span>
                </div>
                <div className="pricing-row">
                  <span className="label">{t("common.tax")}</span>
                  <span className="val">₹{orderSummaryInfo.tax.toFixed(2)}</span>
                </div>
                <div className="pricing-row total">
                  <span className="label">{t("common.total")}</span>
                  <span className="val">₹{orderSummaryInfo.totalPaid.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Address & Status cards */}
          <div className="checkout-left-column">
            
            {/* Delivery address success card */}
            <div className="cancelled-card-block">
              <h4 className="card-title-row">
                <i className="pi pi-map-marker title-icon" />
                <span>{t("checkoutPage.shippingForm.delivery")}</span>
              </h4>
              <div className="address-details-text-cancel">
                <p className="recipient">{orderSummaryInfo.recipient}</p>
                <p>{orderSummaryInfo.address}</p>
                <div className="phone-wrap">
                  <i className="pi pi-phone" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Reason for Cancellation Display block */}
            <div className="cancelled-card-block">
              <h4 className="card-title-row">
                <i className="pi pi-info-circle title-icon" />
                <span>{t("checkoutPage.cancelled.reasonTitle")}</span>
              </h4>
              <p className="cancel-reason-display-text">
                {cancellationReason || "Address/delivery details are incorrect"}
              </p>
            </div>

            {/* Refund process details status warning card */}
            <div className="cancelled-card-block">
              <div className="refund-status-progress-card">
                <h5 className="refund-status-title">{t("checkoutPage.cancelled.refundStatus")}</h5>
                <p className="refund-status-desc">
                  {t("checkoutPage.cancelled.refundNotice")}
                </p>
                <div className="refund-bottom-status-row">
                  <span className="status-txt">{t("checkoutPage.cancelled.refundProcess")}</span>
                  <span className="days-badge">{t("checkoutPage.cancelled.refundDays")}</span>
                </div>
              </div>

              <button type="button" className="download-invoice-outline-btn">
                <i className="pi pi-download" />
                <span>{t("checkoutPage.cancelled.invoiceBtn")}</span>
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    );
  };

  return (
    <div className="checkout-page-root">
      <Navbar />

      <main className="checkout-main-content shared-container">
        <AnimatePresence mode="wait">
          {currentStep < 4 && renderCheckoutLayout()}
          {currentStep === 4 && renderSuccessState()}
          {currentStep === 5 && renderCancelQuestionnaire()}
          {currentStep === 6 && renderCancelledSuccessState()}
        </AnimatePresence>
      </main>

      <Footer hideInstagram={true} />
    </div>
  );
}
