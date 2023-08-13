import React, { useEffect, useState, useContext, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { v4 as uuidv4 } from "uuid";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { GetPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { AddGameRecord } from "../../../API/playerInfo/playerInfo";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";

const columns = [
  {
    field: "playerName",
    header: "選手",
  },
  {
    field: "goal",
    header: "得分",
  },
  {
    field: "toShoot",
    header: "射門",
  },
  {
    field: "penaltyKick",
    header: "12碼罰球",
  },
  {
    field: "freeKick",
    header: "自由球",
  },
  {
    field: "cornerBall",
    header: "角球",
  },
  {
    field: "handBall",
    header: "手球",
  },
  {
    field: "offside",
    header: "越線",
  },
  {
    field: "technicalFoul",
    header: "技術性犯規",
  },
  {
    field: "yellowCard",
    header: "黃牌",
  },
  {
    field: "readCard",
    header: "紅牌",
  },
];
const teamItem = [
  "台北熊讚",
  "新北航源",
  "台中藍鯨",
  "高雄陽信",
  "花蓮",
  "戰神女足",
];
let allPlayerList = [];

const EditComprehensiveDataTable = () => {
  const { authContext, submitContext } = useGlobalStore();
  const navigate = useNavigate();

  // 項目狀態 Start
  const [playerList, setPlayerList] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [isHome, setIsHome] = useState("1");
  const [date, setDate] = useState(null);
  const [playingField, setPlayingField] = useState("");
  const [gameData, setGameData] = useState([]);
  const dataTableRef = useRef();
  // 項目狀態 End

  // 初始處理 Start
  const initHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      const leaguePlayerList = await GetPlayersInfo()
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            return [...Result];
          } else {
            console.log("傳送無錯誤，但沒取得資料 from EditComprehensive Page");
          }
        })
        .catch((err) => {
          alert(err);
          return false;
        });
      if (!leaguePlayerList) return false;
      allPlayerList = leaguePlayerList.map((item) => ({ ...item }));

      setGameData((prevGameData) => {
        let _gameData = prevGameData.map((item) => ({ ...item }));
        for (let i = 0; i < 16; i++) {
          _gameData.push({
            id: uuidv4(),
            playerName: "Select a Player",
            goal: "0",
            toShoot: "0",
            penaltyKick: "0",
            freeKick: "0",
            cornerBall: "0",
            handBall: "0",
            offside: "0",
            technicalFoul: "0",
            yellowCard: "0",
            readCard: "0",
          });
        }
        return _gameData;
      });
    }
  };

  useEffect(() => {
    initHandler();
  }, []);
  // 初始處理 End

  // 根據選擇隊伍顯示不同球員清單處理 Start
  const onMyTeamChg = (e) => {
    console.log("rest觸發");
    setMyTeam(e.target.value);
    // dataTableRef.current.clearState();
    /* 因無法直接清除到PrimeReact-dataTable內部記憶的舊值，只能用 
        內部的 Method『dataTableRef.current.reset();』來清除 */
    dataTableRef.current.reset();
  };
  useEffect(() => {
    setGameData((prevGameData) => {
      console.log("資料重置");
      const _gameData = prevGameData.map((item) => {
        item.playerName = "Select a Player";
        item.goal = "0";
        item.toShoot = "0";
        item.penaltyKick = "0";
        item.freeKick = "0";
        item.cornerBall = "0";
        item.handBall = "0";
        item.offside = "0";
        item.technicalFoul = "0";
        item.yellowCard = "0";
        item.readCard = "0";
        return item;
      });
      return _gameData;
    });

    const _playerList = allPlayerList.filter((item) => {
      return item["Team"] === myTeam;
    });
    const playerList = _playerList.map((playerInfo) => {
      return playerInfo["Name"];
    });
    setPlayerList(playerList);
  }, [myTeam]);
  // 根據選擇隊伍顯示不同球員清單處理 End

  // 編輯模式：計數器 Start
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
  // 編輯模式：計數器 End

  // 編輯模式：下拉選單 Start
  const dropdownEditor = (options) => {
    console.log({ options });
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
  // 編輯模式：下拉選單 End

  // 編輯模式的時，顯示的組件處理 Start
  const cellEditor = (options) => {
    if (options.field === "playerName") return dropdownEditor(options);
    else return textNumberEditor(options);
  };
  // 編輯模式的時，顯示的組件處理 End

  // radioBtn樣式處理 Start
  const radioBtnHandler = () => {
    const btnData = ["homeGame", "awayGame"];
    return btnData.map((item) => {
      return (
        <div key={item} className="flex align-items-center ml-3">
          <RadioButton
            inputId={item === "homeGame" ? "field1" : "field2"}
            name={item === "homeGame" ? "homeGame" : "awayGame"}
            value={item === "homeGame" ? "homeGame" : "awayGame"}
            onChange={(e) =>
              setIsHome(e.target.value === "homeGame" ? "1" : "0")
            }
            checked={isHome === (item === "homeGame" ? "1" : "0")}
          />
          <label
            htmlFor={item === "homeGame" ? "field1" : "field2"}
            className="ml-2"
          >
            {item === "homeGame" ? "主場" : "客場"}
          </label>
        </div>
      );
    });
  };
  // radioBtn樣式處理 End

  // 編輯完處理 Start
  const onCellEditComplete = (e) => {
    console.log("編輯完成", e);
    let { rowData, newValue, field, originalEvent: event } = e;
    console.log({ rowData }, { newValue });
    rowData[field] = newValue;
  };
  // 編輯完處理 End

  // 輸入值是否為整數判斷 Start * 目前此函數未使用
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
    if (!submitContext.submitStatus) {
      submitContext.onSetSubmitStatus(true);
      const dateConversion = () => {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      };
      const appendedData = {
        team: myTeam,
        opponent: opponentTeam,
        isHome: isHome,
        place: playingField,
        date: dateConversion(),
      };
      // TODO 還未處理完
      const _gameData = gameData.map((item) => ({ ...item, ...appendedData }));

      AddGameRecord(gameData)
        .then((res) => {})
        .catch((err) => {
          alert(err);
        });
      submitContext.onSetSubmitStatus(false);
    }
  };
  // 表單送出處理器 End

  return (
    <div className="card p-fluid h-screen page-edit-player">
      <div className="flex col-12">
        <div className="flex align-items-center ">
          <label className="text-lg ">您的隊伍：</label>
          <Dropdown
            value={myTeam}
            options={teamItem}
            onChange={(e) => onMyTeamChg(e)}
            placeholder="請選擇隊伍"
          />
        </div>
        <div className="flex align-items-center ">
          <label className="text-lg ml-5">主客場：</label>
          {radioBtnHandler()}
        </div>
        <div className="flex align-items-center my-2 ">
          <label className="text-lg ml-5">對戰隊伍：</label>
          <Dropdown
            appendTo={"self"}
            value={opponentTeam}
            options={teamItem}
            onChange={(e) => setOpponentTeam(e.target.value)}
            placeholder="請選擇隊伍"
          />
        </div>
        <div className="flex align-items-center ml-6">
          <label className="text-lg ">比賽日期：</label>
          <Calendar
            className="w-5"
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>
        <div className="flex align-items-center ">
          <label className="text-lg " htmlFor="playingField">
            比賽場館：
          </label>
          <InputText
            id="playingField"
            className="w-5"
            type="text"
            value={playingField}
            placeholder="請輸入比賽場館"
            onChange={(e) => setPlayingField(e.target.value)}
          />
        </div>
      </div>
      <DataTable ref={dataTableRef} value={gameData} editMode="cell">
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
        disabled={submitContext.submitStatus}
        label="送出表單"
        onClick={(e) => submitHandler()}
      />
      <div>
        <p className="text-2xl text-pink-500">
          ※ 請先選擇您的隊伍，否則選手清單將為空。 ※
        </p>
      </div>
    </div>
  );
};
export default EditComprehensiveDataTable;
