import React from "react";
import { Button } from "primereact/button";

const AppButton = ({ label, children, className, unstyled = true, ...props }) => {
  return (
    <Button 
      className={className} 
      unstyled={unstyled} 
      {...props}
    >
      {label || children}
    </Button>
  );
};

export default AppButton;
