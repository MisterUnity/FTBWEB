import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";

const ComprehensiveDataTable = ({ dataTableValue, className }) => {
  return (
    <div className={`card ${className}`}>
      <DataTable
        value={dataTableValue ? dataTableValue.data : null}
        tableStyle={{ minWidth: "50rem" }}
      >
        {dataTableValue ? (
          dataTableValue.columnName.map((data) => {
            return (
              <Column key={uuidv4()} field={data.field} header={data.header} />
            );
          })
        ) : (
          <></>
        )}
      </DataTable>
    </div>
  );
};
export default ComprehensiveDataTable;
