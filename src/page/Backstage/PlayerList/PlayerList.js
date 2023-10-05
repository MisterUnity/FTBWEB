import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Fragment,
} from "react";
import { useNavigate } from "react-router-dom";
import { GetPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { GetPlayerInfo } from "../../../API/playerInfo/playerInfo";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { Button } from "primereact/button";
import { UpdateGameData } from "../../../API/playerInfo/playerInfo";
import BlockFullPage from "../../../components/Functions/BlockFullPage/BlockFullPage";
import CSDialog from "../../../cs_components/CSDialog";
import GameHistoryDataTable from "../../../components/UI/Backstage/GameHistoryDataTable/GameHistoryDataTable";
import PlayerInfo from "../../../components/UI/Backstage/PlayersInfo/PlayersInfo";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import PlayerListDataTable from "../../../components/UI/Backstage/PlayerListDataTable/PlayerListDataTable";
import CollapseSideBar from "../../../components/UI/Backstage/CollapseSideBar/CollapseSideBar";
import Taipei from "../../../assets/台北熊讚.png";
import newTaipei from "../../../assets/新北航源.png";
import Taoyuan from "../../../assets/桃園戰神.png";
import Taichung from "../../../assets/台中藍鯨.png";
import Kaohsiung from "../../../assets/高雄陽信.png";
import Hualien from "../../../assets/花蓮女足.png";

const allTeamName = [
  "台北熊讚",
  "新北航源",
  "台中藍鯨",
  "高雄陽信",
  "花蓮",
  "戰神女足",
];
const PlayerList = () => {
  const { authContext, showToast, submitContext, errorHandler } =
    useGlobalStore();
  const navigate = useNavigate();

  // 項目狀態 Start
  const [playerListData, setPlayerListData] = useState([]);
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState({});
  const [currentlyDisplayingTeam, setCurrentlyDisplayingTeam] = useState("");
  const [isHide, setIsHide] = useState(true);
  const [isDisabled, setDisabled] = useState(false);
  const [isLoad, setIsLoad] = useState(true);
  const [havePlayerList, setHavePlayerList] = useState(false);
  const [logo, setLogo] = useState("");
  const [DataTableHeight, setDataTableHeight] = useState("");
  const infoBarRef = useRef(null);

  // 項目狀態 End

  // 初始數據處理 Start
  const InitHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      // 獲取球員清單
      const listData = await GetPlayersInfo()
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setHavePlayerList(true);
            return [...Result];
          }
        })
        .catch((err) => {
          errorHandler(err);
          return false;
        });

      // 錯誤的話跳出不繼續執行
      if (!listData) return false;
      // 設置球員清單資料
      setPlayerListData(listData);

      const header = document.querySelector(".BackstageHeader");
      const footer = document.querySelector(".BackstageFooter");
      console.log(infoBarRef.current);
      const getInfoBarElement = () => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            const infoBar = document.querySelector(".infoBar");
            res(infoBar);
          }, 1000);
        });
      };
      getInfoBarElement().then((infoBar) => {
        if (!infoBar) {
          setDataTableHeight("351px");
          return false;
        } // 抓取不到元素的話跳出。
        const headerInfo = header.getBoundingClientRect();
        const footerInfo = footer.getBoundingClientRect();
        const infoBarInfo = infoBar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        setDataTableHeight(
          windowHeight -
            headerInfo.height -
            footerInfo.height -
            infoBarInfo.height +
            "px"
        );
      });

      // 獲取優先顯示隊伍的，第一筆選手資料
      GetPlayerInfo(firstDisplayDataHandler(listData))
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setPlayerDetailedInfo(Result);
            setIsLoad(false);
          }
        })
        .catch((err) => {
          errorHandler(err);
        });
    }
  };
  useEffect(() => {
    InitHandler();
  }, []);
  // 初始數據處理 End

  // 控制側邊顯示欄 Start
  const hideHandler = useCallback(() => {
    setIsHide(!isHide);
  }, [isHide]);
  // 控制側邊顯示欄 End

  // 獲取優先顯示隊伍的第一筆選手資料 Start
  const firstDisplayDataHandler = (listData) => {
    // 確認各隊伍是否有球員資料。並返回找到的第一筆球員資料
    const teamPlayerStatus = allTeamName.map((item) => {
      return listData.find((playerInfo) => playerInfo["Team"] === item);
    });

    // 根據返回結果，決定隊伍顯示優先順序。
    let firstTeamName = "";
    for (const item of teamPlayerStatus) {
      if (item["Team"]) {
        firstTeamName = item["Team"];
        break;
      }
    }

    // 設置最先顯示的隊伍名
    setCurrentlyDisplayingTeam(firstTeamName);

    // 取得優先顯示隊伍的球員名單
    const priorityDisplayPlayList = listData.filter(
      (item) => item["Team"] === firstTeamName
    );
    return priorityDisplayPlayList[0].ID;
  };
  // 獲取優先顯示隊伍的第一筆選手資料 End

  // disabled球員清單 Start
  const disabledHandler = useCallback(() => {
    setDisabled(!isDisabled);
  }, [isDisabled]);
  // disabled球員清單 End

  // 獲取被點擊的選手個人『 資訊 』及『 比賽數據 』的詳細資料 Start
  const getPlayerDetails = useCallback(
    (playerID) => {
      GetPlayerInfo(playerID)
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setPlayerDetailedInfo(Result);
          }
        })
        .catch((err) => {
          errorHandler(err);
        });
    },
    [playerDetailedInfo]
  );
  // 獲取被點擊的選手個人『 資訊 』及『 比賽數據 』的詳細資料 End

  //
  const getPlayerDataHandler = async (playerID, teamName) => {
    const result = await GetPlayerInfo(playerID)
      .then((res) => {
        const { StatusCode, StatusMessage, Result } = res.data;
        if (StatusCode && StatusMessage.includes("Normal end.")) {
          setPlayerDetailedInfo(Result);
          showToast("成功", "成功取得最新資料", 1);
          return true;
        }
      })
      .catch((err) => {
        submitContext.onSetSubmitStatus(false);
        errorHandler(err);
        return false;
      });
    if (!result) return;
    console.log({ teamName });
    // 隊徽切換處理
    let logo = "";
    switch (teamName) {
      case "台北熊讚":
        logo = Taipei;
        break;
      case "新北航源":
        logo = newTaipei;
        break;
      case "戰神女足":
        logo = Taoyuan;
        break;
      case "台中藍鯨":
        logo = Taichung;
        break;
      case "高雄陽信":
        logo = Kaohsiung;
        break;
      case "花蓮":
        logo = Hualien;
        break;
    }
    setLogo(logo);
  };

  // 刪除選手資料處理 Start
  const deleteHandler = (deleteID) => {
    const listData = playerListData.map((item) => ({ ...item }));
    const newListData = listData.filter((item) => item["ID"] !== deleteID);

    // 已無選手資料可以顯示
    if (newListData.length === 0) {
      setHavePlayerList(false);
      return;
    }
    setPlayerListData(newListData);

    // 如果刪除了目前所選隊伍最後一筆，要顯示其他隊伍的第一筆選手資料。
    GetPlayerInfo(firstDisplayDataHandler(newListData))
      .then((res) => {
        const { StatusCode, StatusMessage, Result } = res.data;
        if (StatusCode && StatusMessage.includes("Normal end.")) {
          setPlayerDetailedInfo(Result);
        }
      })
      .catch((err) => {
        errorHandler(err);
      });
  };
  // 刪除選手資料處理 End

  const UpdateGameRecordHandler = async (dataInfo) => {
    //追加ID資料
    const id = playerDetailedInfo["ID"];
    dataInfo["ID"] = id;
    console.log({ dataInfo });
    // 送要更新的資料
    if (Object.keys(dataInfo).length <= 3) {
      showToast("訊息", "無資料待更新", 2);
      return;
    }
    const result = await UpdateGameData(id, dataInfo)
      .then((res) => {
        const { StatusCode, StatusMessage, Result } = res.data;
        return true;
      })
      .catch((err) => {
        errorHandler(err);
        return false;
      });

    if (!result) {
      return false;
    }

    // 取已更新過的球員比賽數據（和更新的『 ID 』同一筆）
    GetPlayerInfo(id)
      .then((res) => {
        const { StatusCode, StatusMessage, Result } = res.data;
        if (StatusCode && StatusMessage.includes("Normal end.")) {
          setPlayerDetailedInfo(Result);
          showToast("狀態提示", "成功更新比賽數據", 1);
        }
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  return (
    <Fragment>
      {isLoad ? (
        <div
          className="flex justify-content-start align-items-center 
                     w-full h-full bg-bluegray-200 opacity-70"
        >
          <ProgressSpinner />
        </div>
      ) : havePlayerList ? (
        //TODO
        <BlockFullPage
          blocked={submitContext.submitStatus}
          className="w-full h-full flex absolute"
        >
          {/*主要資料顯示區塊 */}
          <div className="flex flex-column align-items-center w-full">
            {/*個人資訊顯示部分 */}
            <div
              ref={infoBarRef}
              className="infoBar flex justify-content-center align-items-center w-full h-25rem "
            >
              {/*個人資訊背景設定 */}

              {/*個人資訊 */}
              {
                <PlayerInfo
                  playerDetailedInfo={playerDetailedInfo}
                  onDisabled={disabledHandler}
                  onLocalUpdate={getPlayerDataHandler}
                  onDelete={deleteHandler}
                  Logo={logo}
                />
              }
            </div>

            {/*對戰紀錄表 */}
            <div className="m-2 w-11 ">
              {DataTableHeight === "" ? (
                <></>
              ) : (
                <GameHistoryDataTable
                  gameRecord={playerDetailedInfo.GameHistory}
                  UpdateGameRecord={UpdateGameRecordHandler}
                  DataTableHeight={DataTableHeight}
                />
              )}
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
              onClickPlayer={getPlayerDetails}
              disabled={isDisabled}
              currentTeam={currentlyDisplayingTeam}
              onSwitchTeam={getPlayerDataHandler}
            />
          </CollapseSideBar>
        </BlockFullPage>
      ) : (
        <div className=" w-full h-full bg-bluegray-200 opacity-70">
          <CSDialog
            header="提示"
            visible={isHide}
            onHide={() => {
              setIsHide(false);
            }}
          >
            <div className="flex flex-column">
              <div className="text-2xl m-3">無球員資料。</div>
              <Button
                label="點此切換至『 新增球員頁面 』"
                onClick={() => {
                  navigate("/backstageHome/addPlayersInfo");
                }}
              />
            </div>
          </CSDialog>
        </div>
      )}
    </Fragment>
  );
};
export default PlayerList;
