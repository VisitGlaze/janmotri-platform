import { useCartStore } from "../../../../shared/useCartStore";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./OrderSummarySection.scss";

export default function OrderSummarySection({ formValues, currentStep = 1, onActionClick }) {
  const { cart } = useCartStore();
  const { t, getImage } = useLanguage();

  const subtotal = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const discount = cart.reduce((acc, item) => acc + ((item.originalPrice - item.price) * item.quantity), 0);
  const tax = Math.round(cart.reduce((acc, item) => acc + (item.price * item.quantity * 0.025), 0));
  const total = subtotal - discount; // GST is included in the net total as per wireframe math

  // Dynamic button labels based on the checkout step
  const getButtonLabel = () => {
    switch (currentStep) {
      case 1:
        return t("checkoutPage.sidebar.continueToPayment");
      case 2:
        return t("checkoutPage.sidebar.confirmOrder");
      case 3:
        return t("checkoutPage.sidebar.placeOrderBtn");
      default:
        return t("checkoutPage.sidebar.confirmOrder");
    }
  };


  return (
    <div className="order-summary-sidebar-container">
      {/* 1. Order Details Panel */}
      <div className="summary-card-panel">
        <h4 className="panel-section-title">
          <i className="pi pi-list-check title-icon" />
          <span>{t("checkoutPage.orderSummary")}</span>
        </h4>

        {cart.length === 0 ? (
          <div className="empty-cart-summary">
            <i className="pi pi-shopping-cart empty-icon" />
            <p>{t("checkoutPage.sidebar.cartEmptyDesc")}</p>
          </div>
        ) : (
          <div className="summary-items-list-static">
            {cart.map((item) => (
              <div key={item.id} className="summary-item-row-static">
                <div className="item-img-container">
                  <img src={getImage(item.imageKey)} alt={item.name} className="item-thumbnail" />
                </div>
                
                <div className="item-details-meta">
                  <h5 className="item-name">{item.name}</h5>
                  <span className="item-qty-static">{t("productDetail.quantity")}: {item.quantity}</span>
                </div>

                <div className="item-price-static">
                  ₹{item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="summary-section-divider" />

        {/* 2. Delivery Address Panel */}
        <h4 className="panel-section-title">
          <i className="pi pi-map-marker title-icon" />
          <span>{t("checkoutPage.shippingForm.delivery")}</span>
        </h4>
        
        <div className="delivery-address-summary">
          {formValues && formValues.firstName ? (
            <div className="address-details-text">
              <p className="recipient-name">{formValues.firstName} {formValues.lastName}</p>
              <p className="address-line">{formValues.address}</p>
              {formValues.apartment && <p className="address-line">{formValues.apartment}</p>}
              <p className="address-line">{formValues.city} - {formValues.pinCode}</p>
              <p className="address-line country-line">Gujarat, India</p>
            </div>
          ) : (
            <p className="empty-address-msg">{t("checkoutPage.sidebar.emptyAddressMsg")}</p>
          )}
        </div>

        <div className="summary-section-divider" />

        {/* 3. Pricing Breakdown */}
        <div className="pricing-breakdown-details">
          <div className="breakdown-row">
            <span className="row-label">{t("common.subtotal")}</span>
            <span className="row-value">₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="breakdown-row discount-row">
            <span className="row-label">{t("common.discount")}</span>
            <span className="row-value">-₹{discount.toFixed(2)}</span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">{t("common.deliveryCharge")}</span>
            <span className="row-value text-green-bold">{t("common.free")}</span>
          </div>

          <div className="breakdown-row">
            <span className="row-label">{t("common.tax")}</span>
            <span className="row-value">₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-section-divider thin" />

          <div className="breakdown-row total-row">
            <span className="row-label">{t("common.total")}</span>
            <span className="row-value">
              <span className="inr-label">INR</span> ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 4. Action Button */}
        {cart.length > 0 && (
          <div className="checkout-sidebar-action-wrap mt-6">
            <button 
              type="button" 
              className="confirm-order-action-btn"
              onClick={onActionClick}
            >
              {getButtonLabel()}
            </button>
            <p className="terms-disclaimer-note">
              {t("checkoutPage.sidebar.termsNotice").replace("{buttonLabel}", getButtonLabel())}{" "}
              <a href="#/terms-and-conditions" target="_blank" rel="noreferrer">{t("footer.termsConditions")}</a> {t("common.and")} <a href="#/privacy-policy" target="_blank" rel="noreferrer">{t("footer.privacyPolicy")}</a>.
            </p>
          </div>
        )}
      </div>

      {/* Security note / guarantees */}
      <div className="security-note-disclaimer mt-4">
        <i className="pi pi-shield lock-icon" />
        <span>SSL Secure Payment</span>
        <span className="dot-divider">•</span>
        <i className="pi pi-check-circle lock-icon" />
        <span>Trusted Payment Gateway</span>
      </div>
    </div>
  );
}
