import React from "react";
import { Dropdown } from "primereact/dropdown";

const AppDropdown = ({ value, onChange, options, className, placeholder, ...props }) => {
  // Normalize simple strings to label-value pairs for PrimeReact Dropdown
  const formattedOptions = options
    ? options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    )
    : [];

  return (
    <Dropdown
      value={value}
      onChange={(e) => onChange && onChange(e)}
      options={formattedOptions}
      placeholder={placeholder}
      className={className}
      unstyled={true}
      {...props}
    />
  );
};

export default AppDropdown;
