import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";

const ComprehensiveDataTable = React.memo(({ dataTableValue, className }) => {
  const columns = () => {
    if (dataTableValue.ColumnName) {
      return dataTableValue.ColumnName.map((data) => {
        return (
          <Column key={uuidv4()} field={data.Field} header={data.Header} />
        );
      });
    }
  };

  return (
    <div className={`card overflow-auto ${className}`}>
      <DataTable value={dataTableValue.Data} tableStyle={{ minWidth: "50rem" }}>
        {columns()}
      </DataTable>
    </div>
  );
});
export default ComprehensiveDataTable;
