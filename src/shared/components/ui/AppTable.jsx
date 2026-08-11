import React from "react";
import { DataTable } from "primereact/datatable";

const AppTable = ({ value, className, children, ...props }) => {
  return (
    <DataTable
      value={value}
      className={className}
      unstyled={true}
      {...props}
    >
      {children}
    </DataTable>
  );
};

export { Column } from "primereact/column";
export default AppTable;
