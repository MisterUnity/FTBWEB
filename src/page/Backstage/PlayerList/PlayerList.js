import React, { useEffect, useState, useContext, useCallback } from "react";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { GetPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { GetPlayerInfo } from "../../../API/playerInfo/playerInfo";
import PlayerInfo from "../../../components/UI/Backstage/PlayersInfo/PlayersInfo";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import PlayerListDataTable from "../../../components/UI/Backstage/PlayerListDataTable/PlayerListDataTable";
import CollapseSideBar from "../../../components/UI/Backstage/CollapseSideBar/CollapseSideBar";
import ComprehensiveDataTable from "../../../components/UI/Backstage/ComprehensiveDataTable/ComprehensiveDataTable";
import classes from "./PlayerList.module.css";
import blueWhaleLogo from "../../../assets/blue_whale_logo.png";
import { useGlobalStore } from "../../../store/GlobalContextProvider";

const PlayerList = () => {
  const [isHide, setIsHide] = useState(true);
  const [playerListData, setPlayerListData] = useState("");
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState({});
  const [dataTableType, setDataTableType] = useState();
  const [dataTableValue, setDataTableValue] = useState();
  const [isDisabled, setDisabled] = useState(false);
  const { authContext } = useGlobalStore();
  const navigate = useNavigate();

  // ***** 下拉選單選項 *****
  const dropdownItem = ["總數據", "進攻數據", "防守數據"];
  // ***

  // ***** 控制側邊顯示欄 *****
  const hideHandler = useCallback(() => {
    setIsHide(!isHide);
  }, [isHide]);
  // ***

  const updateHandler = (newDetailedInfo) => {
    setPlayerDetailedInfo(newDetailedInfo);
  };

  // ***** 編輯模式下，不得選擇球員清單 *****
  const disabledHandler = useCallback(() => {
    setDisabled(!isDisabled);
  }, [isDisabled]);
  // ***

  // ***** 初始數據處理 *****
  const InitHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      const playerListData = await GetPlayersInfo()
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            // 側邊欄選手清單;
            return [...Result];
          } else {
            console.log("傳送無錯誤，但沒取得資料");
            //TODO 其餘訊息時要做什麼處理
          }
        })
        .catch((err) => {
          alert(err);
          return false;
        });
      if (!playerListData) return false; // 錯誤的話跳出不繼續執行

      setPlayerListData(playerListData);
      // 獲取第一筆選手資料
      GetPlayerInfo(playerListData[0].ID)
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setPlayerDetailedInfo(dataMergeHandler(Result));

            // 初始化時，綜合表顯示-總數據頁面
            setDataTableType("總數據");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  useEffect(() => {
    InitHandler();
  }, []);
  // ***

  // ***** 合併進攻，防守數據，組成綜合數據表 *****
  const dataMergeHandler = (res) => {
    //攻擊和防守數據合併成一個總數據表
    let _playerDetailedInfo = { ...res };
    const { Data: OffensiveData } = res.OffensiveData;
    const { Data: DefensiveData } = res.DefensiveData;
    _playerDetailedInfo.ComprehensiveData = {};
    //時間一樣的數據合併成一組
    let _data = [];
    for (let i = 0; i < OffensiveData.length; i++) {
      for (let j = 0; j < DefensiveData.length; j++) {
        if (OffensiveData[i].Date === DefensiveData[j].Date) {
          const mergeCompleteData = {
            ...OffensiveData[i],
            ...DefensiveData[j],
          };
          _data.push(mergeCompleteData);
        }
      }
    }
    // 只需要一個時間欄
    const defensiveDataColumnName =
      _playerDetailedInfo.DefensiveData.ColumnName.filter(
        (item) => item.Field !== "Date"
      );
    let _MixedData = {
      ColumnName: [
        ..._playerDetailedInfo.OffensiveData.ColumnName,
        ...defensiveDataColumnName,
      ],
      Data: [..._data],
    };
    //把 Mixed,Offensive,Defensive加至ComprehensiveData裡
    _playerDetailedInfo.ComprehensiveData.MixedData = {
      ..._MixedData,
    };
    _playerDetailedInfo.ComprehensiveData.OffensiveData = {
      ..._playerDetailedInfo.OffensiveData,
    };
    _playerDetailedInfo.ComprehensiveData.DefensiveData = {
      ..._playerDetailedInfo.DefensiveData,
    };

    //刪除外層的 Offensive,Defensive
    delete _playerDetailedInfo.OffensiveData;
    delete _playerDetailedInfo.DefensiveData;
    return _playerDetailedInfo;
  };
  // ***

  // ***** 數據表單切換處理器 *****
  useEffect(() => {
    const { ComprehensiveData } = playerDetailedInfo;
    switch (dataTableType) {
      case "總數據":
        setDataTableValue(ComprehensiveData.MixedData);
        break;
      case "進攻數據":
        setDataTableValue(ComprehensiveData.OffensiveData);
        break;
      case "防守數據":
        setDataTableValue(ComprehensiveData.DefensiveData);
        break;
    }
  }, [dataTableType]);

  // ***** 獲取被點擊的選手詳細資訊，及數據表單切換處理 *****
  const getClickedNameHandler = useCallback(
    (playerID) => {
      //TODO取的選手資料
      GetPlayerInfo(playerID)
        .then((res) => {
          const resultData = dataMergeHandler(res);
          setPlayerDetailedInfo(resultData);
          /* 表單如果切換前顯示的是『總數據』頁面時，只需更換內容。
             不是的話要切回預設，顯示『總數據』頁面 */
          if (dataTableType !== "總數據") {
            setDataTableType("總數據");
          } else {
            setDataTableValue(resultData.ComprehensiveData.MixedData);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    [dataTableType, dataTableValue]
  );
  // ***

  return (
    <div className="w-full h-full flex absolute">
      <div className={`${classes.bg} flex flex-column w-full `}>
        <div className="flex justify-content-center align-items-center h-25rem ">
          <div
            className={`${classes.infoBG} w-11 h-21rem flex justify-content-center align-items-center`}
          >
            {
              <PlayerInfo
                className={`${classes.info}  h-19rem bg-gray-50`}
                playerDetailedInfo={playerDetailedInfo}
                onDisabled={disabledHandler}
                onUpdate={updateHandler}
              />
            }
          </div>
        </div>
        <div className="flex flex-column align-items-end  h-25rem">
          <Dropdown
            className="m-2 w-full md:w-14rem"
            options={dropdownItem}
            value={dataTableType}
            onChange={(e) => setDataTableType(e.value)}
          />

          <ComprehensiveDataTable
            className="w-full"
            dataTableValue={dataTableValue}
          />
        </div>
      </div>

      <CollapseSideBar
        className="h-full bg-primary-500 opacity-60"
        collapse={isHide}
        onSetIsHide={hideHandler}
      >
        <PlayerListDataTable
          playersData={playerListData}
          hide={isHide}
          onClickPlayer={getClickedNameHandler}
          disabled={isDisabled}
        />
      </CollapseSideBar>
    </div>
  );
};

export default PlayerList;
