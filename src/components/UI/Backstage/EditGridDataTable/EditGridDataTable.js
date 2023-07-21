import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobile as card,
  faMeteor as toShoot,
  faFutbol,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { v4 as uuidv4 } from "uuid";

// ***** 固定資料區，不會變動也不需刷新 *****
const initData = [];
for (let i = 0; i < 16; i++) {
  initData.push({
    id: uuidv4(),
    playerName: "Select a Player",
    goal: "0",
    toShoot: "0",
    cornerBall: "0",
    goalKick: "0",
    header: "0",
    handBall: "0",
    penaltyKick: "0",
    freeKick: "0",
    offside: "0",
    yellowCard: "0",
    readCard: "0",
  });
}
const playerList = [
  "A選手",
  "B選手",
  "C選手",
  "D選手",
  "E選手",
  "F選手",
  "G選手",
  "H選手",
  "I選手",
  "J選手",
  "K選手",
  "替補-A選手",
  "替補-B選手",
  "替補-C選手",
  "替補-D選手",
  "替補-E選手",
];
const columns = [
  { field: "playerName", header: "PlayerName" },
  {
    field: "goal",
    header: (
      <FontAwesomeIcon
        icon={faFutbol}
        size="2xl"
        style={{ color: "#000000" }}
      />
    ),
  },
  {
    field: "toShoot",
    header: (
      <FontAwesomeIcon icon={toShoot} size="2xl" style={{ color: "#f52424" }} />
    ),
  },
  { field: "cornerBall", header: "Corner Ball" },
  { field: "goalKick", header: "Goal Kick" },
  { field: "header", header: "Header" },
  { field: "handBall", header: "Hand Ball" },
  { field: "penaltyKick", header: "Penalty Kick" },
  { field: "freeKick", header: "Free Kick" },
  { field: "offside", header: "offside" },
  {
    field: "yellowCard",
    header: (
      <FontAwesomeIcon icon={card} size="2xl" style={{ color: "#ffdd00" }} />
    ),
  },
  {
    field: "readCard",
    header: (
      <FontAwesomeIcon icon={card} size="2xl" style={{ color: "#ff0000" }} />
    ),
  },
];
// ***

const EditGridDataTable = () => {
  const [products, setProducts] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setProducts(initData);
  }, []);

  // ***** 編輯模式：下拉式選單 *****
  const dropdownEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={playerList}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Player"
      />
    );
  };
  // ***

  // ***** 編輯模式：計數器 *****
  const textNumberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="decimal"
        showButtons
        min={0}
        max={100}
      />
    );
  };
  // ***

  // ***** 根據所選欄位，回傳不同編輯模式 *****
  const cellEditor = (options) => {
    if (options.field === "playerName") return dropdownEditor(options);
    else return textNumberEditor(options);
  };
  // ***

  // ***** 輸入值是否為整數判斷 *****
  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  };
  // ***

  // ***** 編輯完後，輸入值的處理 *****
  const onCellEditComplete = (e) => {
    const { rowData, newValue, newRowData, field, originalEvent: event } = e;

    switch (field) {
      case "playerName":
        const { playerName } = newRowData;
        // console.log(newRowData);
        // console.log(newRowData.goal);
        // console.log(newRowData.playerName);
        // rowData[field] = "1";
        break;

      default:
        if (isPositiveInteger(newValue)) {
          console.log(newRowData);
          console.log(newRowData.playerName);
          rowData[field] = newValue;
        } else event.preventDefault();
        break;
    }
  };
  // ***

  const dataTableColumns = columns.map(({ field, header }) => {
    return (
      <Column
        key={field}
        field={field}
        header={header}
        style={{ width: "7%" }}
        editor={(options) => cellEditor(options)}
        onCellEditComplete={onCellEditComplete}
      />
    );
  });

  return (
    <div className="card p-fluid">
      <DataTable
        value={products}
        editMode="cell"
        tableStyle={{ minWidth: "50rem" }}
        selectionMode="single"
        selection={selectedProduct}
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        dataKey="id"
      >
        {dataTableColumns}
      </DataTable>
    </div>
  );
};
export default EditGridDataTable;
