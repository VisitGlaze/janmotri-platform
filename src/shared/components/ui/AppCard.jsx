import React from "react";
import { Card } from "primereact/card";

const AppCard = ({ title, subTitle, className, children, ...props }) => {
  return (
    <Card
      title={title}
      subTitle={subTitle}
      className={className}
      unstyled={true}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AppCard;
