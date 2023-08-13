import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GetPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { GetPlayerInfo } from "../../../API/playerInfo/playerInfo";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import GameHistoryDataTable from "../../../components/UI/Backstage/GameHistoryDataTable/GameHistoryDataTable";
import PlayerInfo from "../../../components/UI/Backstage/PlayersInfo/PlayersInfo";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import PlayerListDataTable from "../../../components/UI/Backstage/PlayerListDataTable/PlayerListDataTable";
import CollapseSideBar from "../../../components/UI/Backstage/CollapseSideBar/CollapseSideBar";
import classes from "./PlayerList.module.css";

const PlayerList = () => {
  const { authContext } = useGlobalStore();
  const navigate = useNavigate();
  // 項目狀態 Start
  const [isHide, setIsHide] = useState(true);
  const [playerListData, setPlayerListData] = useState("總數據");
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [isLoad, setIsLoad] = useState(true);
  // 項目狀態 End

  // 控制側邊顯示欄 Start
  const hideHandler = useCallback(() => {
    setIsHide(!isHide);
  }, [isHide]);
  // 控制側邊顯示欄 End

  // 個人資訊更新完處理 Start
  const updateHandler = (newDetailedInfo) => {
    // TODO 個人資訊更新完處理未完
    const newData = [...newDetailedInfo];
    setPlayerDetailedInfo();
  };
  // 個人資訊更新完處理 End

  // 刪除選手資料處理 Start
  const deleteHandler = (deleteID) => {
    const newPlayerList = playerListData.filter(
      (item) => item["ID"] !== deleteID
    );
    console.log(newPlayerList);
    setPlayerListData(newPlayerList);
    GetPlayerInfo(playerListData[0].ID)
      .then((res) => {
        const { StatusCode, StatusMessage, Result } = res.data;
        if (StatusCode && StatusMessage.includes("Normal end.")) {
          setPlayerDetailedInfo(Result);
          setIsLoad(false);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  // 刪除選手資料處理 End

  // 編輯模式下，disabled球員清單 Start
  const disabledHandler = useCallback(() => {
    setDisabled(!isDisabled);
  }, [isDisabled]);
  // 編輯模式下，disabled球員清單 End

  // 初始數據處理 Start
  const InitHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      const playerListData = await GetPlayersInfo()
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            // 側邊欄選手清單;
            return [...Result];
          } else {
            console.log("傳送無錯誤，但沒取得資料 from PlayerList Page");
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
        // GetPlayerInfo("b4d1715b-c0de-4313-9d82-106b86f54ec8") //測試用
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setPlayerDetailedInfo(Result);
            setIsLoad(false);
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
  // 初始數據處理 End

  // 獲取被點擊的選手詳細資訊，及數據表單切換處理 Start
  const getClickedNameHandler = useCallback(
    (playerID) => {
      GetPlayerInfo(playerID)
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setPlayerDetailedInfo(Result);
          } else {
            console.log(
              "傳送無錯誤，但沒取得資料 from PlayerList Page (切換選手時)"
            );
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    [playerDetailedInfo]
  );
  // 獲取被點擊的選手詳細資訊，及數據表單切換處理 End

  return (
    <Fragment>
      {isLoad ? (
        <div
          className="flex justify-content-start align-items-center 
                        w-full h-full bg-bluegray-200 opacity-70"
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="w-full h-full flex absolute">
          {/*主要資料顯示區塊 */}
          <div
            className={`${classes.bg} flex flex-column align-items-center w-full `}
          >
            {/*個人資訊顯示部分 */}
            <div className="flex justify-content-center align-items-center w-full h-25rem ">
              {/*個人資訊背景設定 */}
              <div
                className={`${classes.infoBG} w-11 h-21rem flex justify-content-center 
                                              align-items-center`}
              >
                {/*個人資訊 */}
                {
                  <PlayerInfo
                    className={`${classes.info}  h-19rem bg-gray-50`}
                    playerDetailedInfo={playerDetailedInfo}
                    onDisabled={disabledHandler}
                    onUpdate={updateHandler}
                    onDelete={deleteHandler}
                  />
                }
              </div>
            </div>

            {/*對戰紀錄表 */}
            <div className=" w-11 h-25rem">
              {
                <GameHistoryDataTable
                  gameRecord={playerDetailedInfo.GameHistory}
                />
              }
            </div>
          </div>

          {/*側邊欄（顯示選手清單）*/}
          <CollapseSideBar
            className="h-full bg-primary-500 opacity-60  "
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
      )}
    </Fragment>
  );
};
export default PlayerList;
