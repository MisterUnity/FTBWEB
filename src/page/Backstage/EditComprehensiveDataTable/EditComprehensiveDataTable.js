import React, { useEffect, useState, useRef } from "react";
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
    field: "name",
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
    field: "redCard",
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
  const { authContext, submitContext, showToast } = useGlobalStore();
  const navigate = useNavigate();
  const dataTableRef = useRef();

  // 項目狀態 Start
  const [playerList, setPlayerList] = useState("");
  const [myTeam, setMyTeam] = useState("");
  const [opponentTeam, setOpponentTeam] = useState("");
  const [isHome, setIsHome] = useState(1);
  const [date, setDate] = useState(null);
  const [playingField, setPlayingField] = useState("");
  const [gameData, setGameData] = useState([]);
  // 項目狀態 End

  // 初始處理 Start
  useEffect(() => {
    const initHandler = async () => {
      if (await checkLogin(authContext, navigate)) {
        const leaguePlayerList = await GetPlayersInfo()
          .then((res) => {
            const { StatusCode, StatusMessage, Result } = res.data;
            if (StatusCode && StatusMessage.includes("Normal end.")) {
              return [...Result];
            } else {
              console.log(
                "傳送無錯誤，但沒取得資料 from EditComprehensive Page"
              );
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
              name: "Select a Player",
              goal: 0,
              toShoot: 0,
              penaltyKick: 0,
              freeKick: 0,
              cornerBall: 0,
              handBall: 0,
              offside: 0,
              technicalFoul: 0,
              yellowCard: 0,
              redCard: 0,
            });
          }
          return _gameData;
        });
      }
    };
    initHandler();
  }, [authContext, navigate]);
  // 初始處理 End

  // 隊伍互鎖處理 Start
  const onTeamChg = (e, type) => {
    const currentTeam = e.target.value;
    if (type === "myTeam") {
      if (currentTeam !== opponentTeam) {
        setMyTeam(currentTeam);
      } else {
        showToast("提示", "無法選擇和對戰隊伍相同的隊伍", 0);
      }
    } else {
      if (currentTeam !== myTeam) {
        setOpponentTeam(currentTeam);
      } else {
        showToast("提示", "無法選擇和您的隊伍相同的隊伍", 0);
      }
    }
  };
  // 隊伍互鎖處理 End

  // 根據選擇隊伍顯示不同球員清單處理 Start
  useEffect(() => {
    /* 因無法直接清除到PrimeReact-dataTable內部記憶的舊值，只能用 
        內部的 Method『dataTableRef.current.reset();』來清除 */
    dataTableRef.current.reset();
    setGameData((prevGameData) => {
      const _gameData = prevGameData.map((item) => {
        item.name = "Select a Player";
        item.goal = 0;
        item.toShoot = 0;
        item.penaltyKick = 0;
        item.freeKick = 0;
        item.cornerBall = 0;
        item.handBall = 0;
        item.offside = 0;
        item.technicalFoul = 0;
        item.yellowCard = 0;
        item.redCard = 0;
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
        onChange={(e) => {
          gameData[options.rowIndex][options.field] = e.value;
          // return options.editorCallback(e.value);
        }}
        mode="decimal"
        showButtons
        min={0}
        max={100}
      />
    );
  };
  // 編輯模式：計數器 End

  // 選手重複確認 Start
  const playerNameCheck = (value, options) => {
    const idx = gameData.findIndex((player) => player.name === value);
    if (idx === -1) {
      gameData[options.rowIndex].name = value;
      // return options.editorCallback(value);
    } else {
      return showToast("選手重複提示", `${value}，已被選取。`, 0);
    }
  };
  // 選手重複確認 End

  // 編輯模式：下拉選單 Start
  const dropdownEditor = (options) => {
    return (
      <Dropdown
        // appendTo={"self"} // 升版後好像修復了所以不用了 (訊息傳送門1)
        value={options.value}
        options={playerList}
        onChange={(e) => playerNameCheck(e.value, options)}
        placeholder="Select a Player"
      />
    );
  };
  // 編輯模式：下拉選單 End

  // 編輯模式的時，顯示的組件處理 Start
  const cellEditor = (options) => {
    if (options.field === "name") return dropdownEditor(options);
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
            onChange={(e) => setIsHome(e.target.value === "homeGame" ? 1 : 0)}
            checked={isHome === (item === "homeGame" ? 1 : 0)}
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

  // 編輯完處理 Start (可能是一點用也沒有)
  // const onCellEditComplete = (e) => {
  // let { rowData, newValue, field, originalEvent: event } = e;
  // rowData[field] = newValue;
  // };
  // 編輯完處理 End

  // 輸入值是否為整數判斷 Start * 目前此函數未使用
  // const isPositiveInteger = (val) => {
  //   // let str = String(val);
  //   // str = str.trim();
  //   // if (!str) {
  //   //   return false;
  //   // }
  //   // str = str.replace(/^0+/, "") || "0";
  //   // let n = Math.floor(Number(str));
  //   // return n !== Infinity && String(n) === str && n >= 0;
  // };
  // 輸入值是否為整數判斷 End

  // 表單送出處理器 Start
  const submitHandler = async () => {
    if (!submitContext.submitStatus) {
      submitContext.onSetSubmitStatus(true);
      let formattedDate = false;
      if (date && myTeam && opponentTeam && playingField) {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      } else {
        console.log("錯誤");
        showToast(
          "提醒訊息",
          date
            ? myTeam
              ? opponentTeam
                ? "請輸入比賽場地"
                : "請選擇對戰隊伍"
              : "請選擇您的隊伍"
            : "請選擇比賽日期",
          3
        );
        formattedDate = false;
      }

      if (!formattedDate) {
        submitContext.onSetSubmitStatus(false);
        return false;
      }
      const appendedData = {
        team: myTeam,
        opponent: opponentTeam,
        isHome: isHome,
        place: playingField,
        date: formattedDate,
      };
      const finalData = gameData.map((item) => ({ ...item, ...appendedData }));
      for (const index in finalData) {
        const playerName = finalData[index]["name"];
        if (playerName === "Select a Player") {
          // 刪除無效的資料
          delete finalData[index];
        } else {
          //  把渲染時需要的 key (id)，換成能夠對應後端資料庫相對應的球員 ID
          const playerNameInfo = allPlayerList.find(
            (item) => item["Name"] === playerName
          );
          finalData[index]["id"] = playerNameInfo["ID"];
        }
      }

      await AddGameRecord(finalData)
        .then((res) => {
          const { StatusCode, StatusMessage } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            showToast("狀態提示", "資料追加成功", 1);
            submitContext.onSetSubmitStatus(false);
          } else {
            showToast("狀態提示", "資料傳送失敗，出現未知問題", 0);
          }
        })
        .catch((err) => {
          showToast("狀態提示", `錯誤訊息：${err}`, 0);
          submitContext.onSetSubmitStatus(false);
        });
      submitContext.onSetSubmitStatus(false);
    }
  };
  // 表單送出處理器 End

  return (
    <div className="card p-fluid page-edit-player">
      <div className="grid grid-nogutter">
        <div className="col-12 md:col-4">
          <div className="fie">您的隊伍</div>
          <div className="edt">
            <Dropdown
              className="w-full"
              value={myTeam}
              options={teamItem}
              onChange={(e) => onTeamChg(e, "myTeam")}
              placeholder="請選擇隊伍"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 md:pl-2">
          <div className="fie">主客場</div>
          <div className="edt flex">{radioBtnHandler()}</div>
        </div>
        <div className="col-12"></div>
        <div className="col-12 md:col-4">
          <div className="fie">對戰隊伍</div>
          <div className="edt">
            <Dropdown
              appendTo={"self"}
              value={opponentTeam}
              options={teamItem}
              onChange={(e) => onTeamChg(e, "opponentTeam")}
              placeholder="請選擇隊伍"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 md:pl-2">
          <div className="fie">比賽場館</div>
          <div className="edt">
            <InputText
              id="playingField"
              type="text"
              value={playingField}
              placeholder="請輸入比賽場館"
              onChange={(e) => setPlayingField(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-12"></div>
        <div className="col-12 md:col-4">
          <div className="fie">比賽日期</div>
          <div className="edt">
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </div>
        </div>
        <div className="col-12">
          <DataTable
            className="w-full"
            ref={dataTableRef}
            value={gameData}
            editMode="cell"
            scrollable
            scrollHeight="350px"
          >
            {columns.map(({ field, header }) => {
              return (
                <Column
                  key={field}
                  field={field}
                  header={header}
                  style={{ width: "7%", whiteSpace: "nowrap" }}
                  editor={(options) => cellEditor(options)}
                  // onCellEditComplete={onCellEditComplete} //可能是一點用也沒用，超爛
                />
              );
            })}
          </DataTable>
        </div>
        <div className="col-12 mt-2">
          <Button
            disabled={submitContext.submitStatus}
            label="送出表單"
            onClick={(e) => submitHandler()}
          />
        </div>
        <div className="col-12">
          <p className="text-2xl text-pink-500">
            ※ 請先選擇您的隊伍，否則選手清單將為空。 ※
          </p>
        </div>
      </div>
    </div>
  );
};
export default EditComprehensiveDataTable;
