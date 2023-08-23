import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const ComprehensiveDataTable = React.memo(
  ({ className, gameData, columnsInfo, UpdateGameRecord }) => {
    const [tableType, setTableType] = useState("總數據");
    const [tableData, setTableData] = useState([]);
    const [columnType, seColumnType] = useState("MixColumns");
    const [editMode, setEditMode] = useState(false);
    const dropdownItem = ["總數據", "進攻數據", "防守數據"];

    // 設定列類型，以及表格數據 Start
    useEffect(() => {
      let tableDatatype = "";
      switch (tableType) {
        case "總數據":
          seColumnType("MixColumns");
          tableDatatype = "MixData";
          break;
        case "進攻數據":
          seColumnType("OffColumns");
          tableDatatype = "OffensiveData";
          break;
        case "防守數據":
          seColumnType("DefColumns");
          tableDatatype = "DefensiveData";
          break;
      }
      const _tableData = [JSON.parse(JSON.stringify(gameData[tableDatatype]))];
      setTableData(_tableData);
    }, [tableType]);
    // 設定列類型，以及表格數據 End

    // 編輯模式下的顯示的組件 Start
    const textNumberEditor = (options) => {
      return (
        <InputNumber
          value={options.value}
          onChange={(e) => options.editorCallback(e.value)}
          mode="decimal"
          showButtons
          min={0}
          max={100}
        />
      );
    };
    // 編輯模式下的顯示的組件 Emd

    // 『一般』『編輯』模式下所顯示的不同類型資料 Start
    const cellEditor = (options) => {
      const { field, rowData } = options;
      return editMode ? textNumberEditor(options) : rowData[field];
    };
    // 『一般』『編輯』模式下所顯示的不同類型資料 End

    // 列渲染 Start
    const columnsDataHandler = () => {
      return columnsInfo[columnType].map((data) => {
        return (
          <Column
            key={uuidv4()}
            field={data.Field}
            header={data.Header}
            editor={cellEditor}
            onCellEditComplete={onCellEditComplete}
          />
        );
      });
    };
    // 列渲染 End

    // 編輯完成時所做處理 Start
    const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      rowData[field] = newValue;
    };
    // 編輯完成時所做處理 End

    const editCompleted = () => {
      const data = {
        Date: gameData.date,
        Opponent: gameData.opponent,
      };
      // 因變更過的資料，類型會變成number，所以用類型來判斷有變更過的data。
      for (const props in tableData[0]) {
        if (tableData[0].hasOwnProperty(props)) {
          if (typeof tableData[0][props] === "number") {
            data[props] = tableData[0][props];
          }
        }
      }
      UpdateGameRecord(data);
      // TODO 更改的欄位，以及選手ID，對戰隊伍，日期。
      setEditMode(false);
    };

    return (
      <div className={className}>
        <div>
          <Button
            className={`m-2 ${editMode ? "text-red-500" : ""}`}
            label="編輯模式"
            onClick={() => setEditMode(true)}
          />
          <Button
            className="m-2"
            label="儲存編輯"
            onClick={() => editCompleted()}
          />
        </div>
        <div>
          <Dropdown
            className="m-2 w-full md:w-14rem"
            options={dropdownItem}
            value={tableType}
            onChange={(e) => setTableType(e.value)}
          />
        </div>
        <div className="card overflow-auto">
          <DataTable
            value={tableData}
            tableStyle={{ minWidth: "50rem" }}
            editMode="cell"
          >
            {columnsDataHandler()}
          </DataTable>
        </div>
      </div>
    );
  }
);
export default ComprehensiveDataTable;
