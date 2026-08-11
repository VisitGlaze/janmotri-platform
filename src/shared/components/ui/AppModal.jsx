import React from "react";
import { Dialog } from "primereact/dialog";

const AppModal = ({ visible, onHide, header, footer, className, children, ...props }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={footer}
      className={className}
      unstyled={true}
      {...props}
    >
      {children}
    </Dialog>
  );
};

export default AppModal;
