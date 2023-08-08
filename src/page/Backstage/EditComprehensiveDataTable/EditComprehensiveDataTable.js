import React, { useEffect, useState, useContext } from "react";
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
import { useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";

const playerList = [
  "Select a Player",
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
  {
    field: "playerName",
    header: "PlayerName",
  },
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
  {
    field: "cornerBall",
    header: "Corner Ball",
  },
  {
    field: "goalKick",
    header: "Goal Kick",
  },
  {
    field: "header",
    header: "Header",
  },
  {
    field: "handBall",
    header: "Hand Ball",
  },
  {
    field: "penaltyKick",
    header: "Penalty Kick",
  },
  {
    field: "freeKick",
    header: "Free Kick",
  },
  {
    field: "offside",
    header: "offside",
  },
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

const EditComprehensiveDataTable = () => {
  const [playerMatchStats, setPlayerMatchData] = useState(null);
  const { authContext, submitStatusHandler } = useGlobalStore();
  const navigate = useNavigate();

  // 初始處理 Start
  const initHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
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
        setPlayerMatchData(initData);
      }
    }
  };
  useEffect(() => {
    initHandler();
  }, []);
  // 初始處理 End

  // 編輯模式：下拉選單 Start
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
  // 編輯模式：下拉選單 End

  // 編輯模式：計數器 Start
  const dropdownEditor = (options) => {
    return (
      <Dropdown
        appendTo={"self"}
        value={options.value}
        options={playerList}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Player"
      />
    );
  };
  // 編輯模式：計數器 End

  // 編輯模式的時，顯示的組件處理 Start
  const cellEditor = (options) => {
    if (options.field === "playerName") return dropdownEditor(options);
    else return textNumberEditor(options);
  };
  // 編輯模式的時，顯示的組件處理 End

  // 編輯完處理 Start
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    rowData[field] = newValue;
  };
  // 編輯完處理 End

  // 輸入值是否為整數判斷 Start
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
  // 輸入值是否為整數判斷 End

  // 表單送出處理器 Start
  const submitHandler = () => {
    //TODO 數據送出處理未完
    if (!submitStatusHandler.submitStatus) {
    }
  };
  // 表單送出處理器 End

  return (
    <div className="card p-fluid h-screen">
      <DataTable value={playerMatchStats} editMode="cell">
        {columns.map(({ field, header }) => {
          return (
            <Column
              key={field}
              field={field}
              header={header}
              style={{ width: "7%", whiteSpace: "nowrap" }}
              editor={cellEditor}
              onCellEditComplete={onCellEditComplete}
            />
          );
        })}
      </DataTable>
      <Button
        disabled
        onClick={(e) => {
          console.log(playerMatchStats);
        }}
      >
        Add
      </Button>
    </div>
  );
};
export default EditComprehensiveDataTable;
