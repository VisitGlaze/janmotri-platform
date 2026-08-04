import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../../../shared/useCartStore";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./CheckoutFormSection.scss";

// Beautiful custom QR Code SVG
const QrCodeSvg = () => (
  <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="qr-code-svg">
    <rect width="100" height="100" rx="12" fill="#F9FAFB"/>
    {/* QR corners */}
    <rect x="10" y="10" width="22" height="22" rx="3" fill="#111827" stroke="#F9FAFB" strokeWidth="2"/>
    <rect x="14" y="14" width="14" height="14" rx="1" fill="#FFFFFF"/>
    <rect x="17" y="17" width="8" height="8" fill="#111827"/>

    <rect x="68" y="10" width="22" height="22" rx="3" fill="#111827" stroke="#F9FAFB" strokeWidth="2"/>
    <rect x="72" y="14" width="14" height="14" rx="1" fill="#FFFFFF"/>
    <rect x="75" y="17" width="8" height="8" fill="#111827"/>

    <rect x="10" y="68" width="22" height="22" rx="3" fill="#111827" stroke="#F9FAFB" strokeWidth="2"/>
    <rect x="14" y="72" width="14" height="14" rx="1" fill="#FFFFFF"/>
    <rect x="17" y="75" width="8" height="8" fill="#111827"/>

    {/* QR random dots mockup */}
    <rect x="38" y="12" width="6" height="6" rx="1" fill="#111827"/>
    <rect x="48" y="16" width="6" height="6" rx="1" fill="#111827"/>
    <rect x="40" y="26" width="14" height="6" rx="1" fill="#111827"/>
    
    <rect x="42" y="42" width="16" height="16" rx="2" fill="#EC1C24"/> {/* Brand red center block */}
    
    <rect x="14" y="42" width="6" height="12" rx="1" fill="#111827"/>
    <rect x="26" y="46" width="12" height="6" rx="1" fill="#111827"/>

    <rect x="78" y="42" width="10" height="6" rx="1" fill="#111827"/>
    <rect x="72" y="52" width="6" height="12" rx="1" fill="#111827"/>

    <rect x="42" y="68" width="14" height="6" rx="1" fill="#111827"/>
    <rect x="50" y="78" width="6" height="10" rx="1" fill="#111827"/>
    <rect x="38" y="84" width="10" height="6" rx="1" fill="#111827"/>
    
    <rect x="68" y="68" width="20" height="6" rx="1" fill="#111827"/>
    <rect x="74" y="78" width="6" height="10" rx="1" fill="#111827"/>
  </svg>
);

export default function CheckoutFormSection({ 
  currentStep, 
  formValues, 
  setFormValues, 
  onBack,
  validationError,
  setValidationError
}) {
  const { cart } = useCartStore();
  const { t } = useLanguage();


  const subtotal = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const discount = cart.reduce((acc, item) => acc + ((item.originalPrice - item.price) * item.quantity), 0);
  const total = subtotal - discount;

  const handleInputChange = (field, val) => {
    setValidationError("");
    setFormValues(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setValidationError("");
    setFormValues(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  // Render Step 1 Form: Customer Info
  const renderStep1 = () => (
    <motion.div 
      className="form-step-content"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Contact Info Header */}
      <div className="form-group-section">
        <h3 className="section-title">{t("checkoutPage.shippingForm.contact")}</h3>
        
        <div className="input-field-wrap">
          <label htmlFor="email" className="input-label">{t("contactPage.formEmail")}</label>
          <input 
            type="email" 
            id="email" 
            placeholder={t("checkoutPage.shippingForm.emailPlaceholder")} 
            className="form-input"
            value={formValues.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        
        <div className="checkbox-wrap">
          <input 
            type="checkbox" 
            id="newsOffers" 
            className="form-checkbox"
            checked={formValues.newsOffers}
            onChange={(e) => handleInputChange("newsOffers", e.target.checked)}
          />
          <label htmlFor="newsOffers" className="checkbox-label">
            {t("checkoutPage.shippingForm.emailCheckbox")}
          </label>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="form-group-section mt-6">
        <h3 className="section-title">{t("checkoutPage.shippingForm.delivery")}</h3>
        
        <div className="grid-2-cols">
          <div className="input-field-wrap">
            <label htmlFor="firstName" className="input-label">{t("checkoutPage.shippingForm.firstName")}</label>
            <input 
              type="text" 
              id="firstName" 
              placeholder={t("checkoutPage.shippingForm.firstName")} 
              className="form-input"
              value={formValues.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </div>
          
          <div className="input-field-wrap">
            <label htmlFor="lastName" className="input-label">{t("checkoutPage.shippingForm.lastName")}</label>
            <input 
              type="text" 
              id="lastName" 
              placeholder={t("checkoutPage.shippingForm.lastName")} 
              className="form-input"
              value={formValues.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="input-field-wrap mt-4">
          <label htmlFor="address" className="input-label">{t("checkoutPage.shippingForm.address")}</label>
          <input 
            type="text" 
            id="address" 
            placeholder={t("checkoutPage.shippingForm.address")} 
            className="form-input"
            value={formValues.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        <div className="input-field-wrap mt-4">
          <label htmlFor="apartment" className="input-label">{t("checkoutPage.shippingForm.apartment")}</label>
          <input 
            type="text" 
            id="apartment" 
            placeholder={t("checkoutPage.shippingForm.apartment")} 
            className="form-input"
            value={formValues.apartment}
            onChange={(e) => handleInputChange("apartment", e.target.value)}
          />
        </div>

        <div className="grid-2-cols mt-4">
          <div className="input-field-wrap">
            <label htmlFor="city" className="input-label">{t("checkoutPage.shippingForm.city")}</label>
            <input 
              type="text" 
              id="city" 
              placeholder={t("checkoutPage.shippingForm.city")} 
              className="form-input"
              value={formValues.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>
          
          <div className="input-field-wrap">
            <label htmlFor="pinCode" className="input-label">{t("checkoutPage.shippingForm.pinCode")}</label>
            <input 
              type="text" 
              id="pinCode" 
              maxLength="6"
              placeholder={t("checkoutPage.shippingForm.pinCode")} 
              className="form-input"
              value={formValues.pinCode}
              onChange={(e) => handleInputChange("pinCode", e.target.value)}
            />
          </div>
        </div>
      </div>

      {validationError && (
        <div className="error-alert-bar mt-4">
          <i className="pi pi-exclamation-circle mr-2" />
          <span>{validationError}</span>
        </div>
      )}
    </motion.div>
  );

  // Render Step 2 Form: Payment Method Selection & Inputs (Redesigned as per wireframe references)
  const renderStep2 = () => {
    return (
      <motion.div 
        className="form-step-content"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-group-section">
          <h3 className="section-title">{t("checkoutPage.paymentMethod")}</h3>
          <p className="section-subtitle">{t("checkoutPage.paymentForm.selectPreferred")}</p>
          
          <div className="payment-options-vertical-list">
            
            {/* 1. Pay Letter with Referral Option */}
            <div 
              className={`payment-row-card ${formValues.paymentMethod === "referral" ? "selected" : ""}`}
              onClick={() => handlePaymentMethodChange("referral")}
            >
              <div className="row-header-wrap">
                <div className="decor-icon-box">
                  <i className="pi pi-calendar" />
                </div>
                
                <div className="method-meta-text">
                  <h4 className="method-title">{t("checkoutPage.paymentForm.referral")}</h4>
                  <p className="method-subtext">{t("checkoutPage.paymentForm.referralDesc")}</p>
                </div>

                <div className="row-right-radio">
                  <div className={`radio-circle ${formValues.paymentMethod === "referral" ? "checked" : ""}`} />
                </div>
              </div>

              <AnimatePresence>
                {formValues.paymentMethod === "referral" && (
                  <motion.div 
                    className="method-expand-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="referral-input-panel">
                      <label htmlFor="referralName" className="expand-input-label">{t("checkoutPage.paymentForm.referralName")}</label>
                      <div className="input-btn-split">
                        <input 
                          type="text" 
                          id="referralName"
                          placeholder={t("checkoutPage.paymentForm.referralName")} 
                          className="form-input expand-input"
                          value={formValues.referralName}
                          onChange={(e) => handleInputChange("referralName", e.target.value)}
                          onClick={(e) => e.stopPropagation()} // Prevent collapse trigger
                        />
                        <button 
                          type="button" 
                          className="eligibility-check-btn"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          {t("checkoutPage.paymentForm.checkEligibility")}
                        </button>
                      </div>
                      {validationError && (
                        <p className="referral-warning-note mt-2">
                          {t("checkoutPage.paymentForm.referralWarning")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. UPI Option */}
            <div 
              className={`payment-row-card ${formValues.paymentMethod === "upi" ? "selected" : ""}`}
              onClick={() => handlePaymentMethodChange("upi")}
            >
              <div className="row-header-wrap">
                <div className="decor-icon-box">
                  <i className="pi pi-mobile" />
                </div>
                
                <div className="method-meta-text">
                  <h4 className="method-title">{t("checkoutPage.paymentForm.upi")}</h4>
                  <p className="method-subtext">{t("checkoutPage.paymentForm.upiDesc")}</p>
                </div>

                <div className="row-right-radio">
                  <div className={`radio-circle ${formValues.paymentMethod === "upi" ? "checked" : ""}`} />
                </div>
              </div>

              <AnimatePresence>
                {formValues.paymentMethod === "upi" && (
                  <motion.div 
                    className="method-expand-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="upi-qrcode-panel">
                      <div className="upi-instructions-col">
                        <h5 className="instructions-header">{t("checkoutPage.paymentForm.scanPayInstructions")}</h5>
                        <ol className="instructions-list">
                          <li>{t("checkoutPage.paymentForm.upiStep1", "Open your preferred UPI mobile app")}</li>
                          <li>{t("checkoutPage.paymentForm.upiStep2", "Confirm payment of ₹{total}").replace("{total}", total.toFixed(2))}</li>
                          <li>{t("checkoutPage.paymentForm.upiStep3", "Scan the QR code shown on the right")}</li>
                          <li>{t("checkoutPage.paymentForm.upiStep4", "Confirm payment of ₹{total}").replace("{total}", total.toFixed(2))}</li>
                        </ol>
                        
                        <div className="supported-upi-brands">
                          <span className="brand-label">{t("checkoutPage.paymentForm.supportedUpiApps", "Supported UPI apps")}</span>
                          <div className="brand-logos-row">
                            <span className="upi-brand u-logo">UPI</span>
                            <span className="upi-brand g-logo">GPay</span>
                            <span className="upi-brand ph-logo">PhonePe</span>
                            <span className="upi-brand pa-logo">Paytm</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="qrcode-display-col">
                        <div className="qr-box-border">
                          <QrCodeSvg />
                          <span className="scan-here-text">{t("checkoutPage.paymentForm.scanHere", "Scan here")}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Cash on Delivery (COD) Option */}
            <div 
              className={`payment-row-card ${formValues.paymentMethod === "cod" ? "selected" : ""}`}
              onClick={() => handlePaymentMethodChange("cod")}
            >
              <div className="row-header-wrap">
                <div className="decor-icon-box">
                  <i className="pi pi-wallet" />
                </div>
                
                <div className="method-meta-text">
                  <h4 className="method-title">{t("checkoutPage.paymentForm.cod")}</h4>
                  <div className="badge-wrapper-row">
                    <span className="pincode-available-badge">{t("checkoutPage.paymentForm.codDesc")}</span>
                  </div>
                </div>

                <div className="row-right-radio">
                  <div className={`radio-circle ${formValues.paymentMethod === "cod" ? "checked" : ""}`} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Subtle navigation back trigger */}
        <div className="subtle-back-action-wrap mt-6">
          <button type="button" className="subtle-back-link-btn" onClick={onBack}>
            &larr; {t("checkoutPage.sidebar.backBtn")}
          </button>
        </div>
      </motion.div>
    );
  };

  // Render Step 3 Form: Order Review details
  const renderStep3 = () => {
    const paymentLabels = {
      referral: `${t("checkoutPage.paymentForm.referral")} (${formValues.referralName || ""})`,
      upi: t("checkoutPage.paymentForm.upi"),
      cod: t("checkoutPage.paymentForm.cod")
    };

    return (
      <motion.div 
        className="form-step-content"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-group-section">
          <h3 className="section-title">{t("checkoutPage.completeOrder")}</h3>
          
          <div className="review-cards-list">
            
            {/* Contact Card */}
            <div className="review-info-card">
              <div className="card-header">
                <span className="card-heading">{t("checkoutPage.shippingForm.contact")}</span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">{t("contactPage.formEmail")}:</span>
                  <span className="info-value">{formValues.email}</span>
                </div>
              </div>
            </div>

            {/* Shipping Card */}
            <div className="review-info-card mt-4">
              <div className="card-header">
                <span className="card-heading">{t("checkoutPage.shippingForm.delivery")}</span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">{t("contactPage.formName")}:</span>
                  <span className="info-value">{formValues.firstName} {formValues.lastName}</span>
                </div>
                <div className="info-row mt-2">
                  <span className="info-label">{t("accountPage.address")}:</span>
                  <span className="info-value">
                    {formValues.address}
                    {formValues.apartment ? `, ${formValues.apartment}` : ""}, {formValues.city} - {formValues.pinCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="review-info-card mt-4">
              <div className="card-header">
                <span className="card-heading">{t("checkoutPage.paymentMethod")}</span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">{t("orderTracking.method")}:</span>
                  <span className="info-value">{paymentLabels[formValues.paymentMethod] || ""}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Back Link */}
        <div className="subtle-back-action-wrap mt-6">
          <button type="button" className="subtle-back-link-btn" onClick={onBack}>
            &larr; {t("checkoutPage.sidebar.backBtn")}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="checkout-form-container">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
}
