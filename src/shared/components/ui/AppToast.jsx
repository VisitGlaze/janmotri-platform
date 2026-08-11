import React, { useRef, useEffect } from "react";
import { Toast } from "primereact/toast";

const AppToast = ({ show, message, type, onHide }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && message && toastRef.current) {
      toastRef.current.show({
        severity: type === "error" ? "error" : "success",
        detail: message,
        life: 4000,
      });

      if (onHide) {
        const timer = setTimeout(onHide, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [show, message, type, onHide]);

  // Custom template mapping to match current SCSS classes and DOM structures exactly
  const itemTemplate = (message) => {
    return (
      <div className={`pl-toast-notification ${message.severity === "error" ? "error" : ""}`}>
        <i className={message.severity === "error" ? "pi pi-exclamation-triangle" : "pi pi-check-circle"} />
        <span>{message.detail}</span>
      </div>
    );
  };

  return (
    <Toast 
      ref={toastRef} 
      content={itemTemplate} 
      unstyled={true} 
    />
  );
};

export default AppToast;
