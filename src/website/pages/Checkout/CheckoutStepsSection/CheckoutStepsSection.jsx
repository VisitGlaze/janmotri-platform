import { motion } from "framer-motion";
import { useLanguage } from "../../../../shared/LanguageContext";
import "./CheckoutStepsSection.scss";

export default function CheckoutStepsSection({ currentStep = 1 }) {
  const { t } = useLanguage();
  const steps = [
    { label: t("checkoutPage.billingDetails"), step: 1 },
    { label: t("checkoutPage.paymentMethod"), step: 2 },
    { label: t("checkoutPage.completeOrder"), step: 3 }
  ];


  return (
    <div className="checkout-steps-container">
      <div className="steps-wrapper">
        {steps.map((item, idx) => {
          const isActive = item.step <= currentStep;
          const isCurrent = item.step === currentStep;

          return (
            <div key={item.step} className="step-item-wrap">
              {idx > 0 && (
                <div className="step-line-container">
                  <div className="step-line-bg" />
                  <motion.div 
                    className="step-line-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: item.step <= currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}

              <div className="step-circle-text">
                <motion.div 
                  className={`step-circle ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
                  animate={{ 
                    scale: isCurrent ? 1.15 : 1,
                    backgroundColor: isActive ? "#EC1C24" : "#ffffff",
                    borderColor: isActive ? "#EC1C24" : "#e5e7eb"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.step < currentStep ? (
                    <i className="pi pi-check text-white text-xs font-bold" />
                  ) : (
                    <span className={`step-num ${isActive ? "text-white" : "text-gray-400"}`}>{item.step}</span>
                  )}
                </motion.div>
                <span className={`step-label ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
