import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "primereact/dropdown";

const ComprehensiveDataTable = React.memo(
  ({ className, gameData, columnsInfo }) => {
    const [tableType, setTableType] = useState("總數據");
    const [tableData, setTableData] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const dropdownItem = ["總數據", "進攻數據", "防守數據"];

    // 列資料渲染處理 Start
    useEffect(() => {
      let columnType = "";
      let tableDatatype = "";
      switch (tableType) {
        case "總數據":
          columnType = "MixColumns";
          tableDatatype = "MixData";
          break;
        case "進攻數據":
          columnType = "OffColumns";
          tableDatatype = "OffensiveData";
          break;
        case "防守數據":
          columnType = "DefColumns";
          tableDatatype = "DefensiveData";
          break;
      }
      const columnsData = columnsInfo[columnType].map((data) => {
        return (
          <Column key={uuidv4()} field={data.Field} header={data.Header} />
        );
      });
      setColumnData(columnsData);
      const _tableData = [JSON.parse(JSON.stringify(gameData[tableDatatype]))];
      setTableData(_tableData);
    }, [tableType]);
    // 列資料渲染處理 End

    return (
      <div className={className}>
        <div>
          <Dropdown
            className="m-2 w-full md:w-14rem"
            options={dropdownItem}
            value={tableType}
            onChange={(e) => setTableType(e.value)}
          />
        </div>
        <div className="card overflow-auto">
          <DataTable value={tableData} tableStyle={{ minWidth: "50rem" }}>
            {columnData}
          </DataTable>
        </div>
      </div>
    );
  }
);
export default ComprehensiveDataTable;
