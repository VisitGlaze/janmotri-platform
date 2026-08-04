import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

const AppTextarea = ({ className, unstyled = true, ...props }) => {
  return (
    <InputTextarea 
      className={className} 
      unstyled={unstyled} 
      {...props} 
    />
  );
};

export default AppTextarea;
