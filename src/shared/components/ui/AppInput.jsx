import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const AppInput = ({ type = "text", className, unstyled = true, ...props }) => {
  if (type === "textarea") {
    return (
      <InputTextarea 
        className={className} 
        unstyled={unstyled} 
        {...props} 
      />
    );
  }

  // Handle standard textbox or numbers
  return (
    <InputText 
      type={type} 
      className={className} 
      unstyled={unstyled} 
      {...props} 
    />
  );
};

export default AppInput;
