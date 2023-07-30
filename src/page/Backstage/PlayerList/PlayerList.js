import { useEffect, useState, useContext } from "react";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import PlayerListDataTable from "../../../components/UI/Backstage/PlayerListDataTable/PlayerListDataTable";
import CollapseSideBar from "../../../components/UI/Backstage/CollapseSideBar/CollapseSideBar";
import ComprehensiveDataTable from "../../../components/UI/Backstage/ComprehensiveDataTable/ComprehensiveDataTable";
import classes from "./PlayerList.module.css";
import blueWhaleLogo from "../../../assets/blue_whale_logo.png";
import AuthContext from "../../../store/AuthContext";

const DUMMY_DATA = [];
for (let i = 0; i < 16; i++) {
  DUMMY_DATA.push({
    id: i,
    name: `中村勇${i}`,
    photo: `https://picsum.photos/id/${i}/1200/600`,
    // photo:
    //   "https://fastly.picsum.photos/id/1/1200/600.jpg?hmac=7xDzyVlLdITHaM66cy-yrgS6i437QYFJJ1PNYcJTO3Y",
    age: i,
    height: i,
    weight: i,
    position: i,
    team: i,
    comprehensiveData: {
      mixedData: {
        columnName: [
          { field: "toShoot", header: "射門次數" },
          { field: "cornerBall", header: "角球" },
          { field: "goalKick", header: "球門球" },
          { field: "header", header: "頭球" },
          { field: "handBall", header: "手球" },
          { field: "penaltyKick", header: "點球" },
          { field: "freeKick", header: "自由球" },
          { field: "offside", header: "越線" },
          { field: "yellowCard", header: "黃牌" },
          { field: "readCard", header: "紅牌" },
        ],
        data: [
          {
            toShoot: i,
            cornerBall: i,
            goalKick: i,
            header: i,
            handBall: i,
            penaltyKick: i,
            freeKick: i,
            offside: i,
            yellowCard: i,
            readCard: i,
          },
        ],
      },
      offensiveData: {
        columnName: [
          { field: "toShoot", header: "射門次數" },
          { field: "cornerBall", header: "角球" },
          { field: "goalKick", header: "球門球" },
          { field: "header", header: "頭球" },
          { field: "penaltyKick", header: "點球" },
          { field: "freeKick", header: "自由球" },
        ],
        data: [
          {
            toShoot: i,
            cornerBall: i,
            goalKick: i,
            header: i,
            penaltyKick: i,
            freeKick: i,
          },
        ],
      },
      defensiveData: {
        columnName: [
          { field: "blockTackle", header: "正面搶截" },
          { field: "slideTackle", header: "鏟球" },
          { field: "toIntercept", header: "截球" },
          { field: "bodyCheck", header: "身體阻擋" },
          { field: "fairCharge", header: "合理衝撞" },
        ],
        data: [
          {
            blockTackle: i,
            slideTackle: i,
            toIntercept: i,
            bodyCheck: i,
            fairCharge: i,
          },
        ],
      },
    },
  });
}
const PlayerList = () => {
  const [playerList, setPlayerList] = useState();
  const [isHide, setIsHide] = useState(true);
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState();
  const [photoTransition, setPhotoTransition] = useState(true);
  const [dataTableType, setDataTableType] = useState();
  const [dataTableValue, setDataTableValue] = useState();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  // ***** 下拉選單選項 *****
  const dropdownItem = ["總數據", "進攻數據", "防守數據"];
  // ***

  // ***** 控制側邊顯示欄 *****
  const hideHandler = () => {
    setIsHide(!isHide);
  };
  // ***

  // ***** 初始數據處理 *****

  useEffect(() => {
    if (checkLogin(authCtx, navigate)) {
      //TODO取得所有資料

      //組建側邊欄選手名單
      setPlayerList(
        DUMMY_DATA.map((data) => {
          return { id: data.id, name: data.name };
        })
      );

      // 初始化時，顯示第一筆資料
      setPlayerDetailedInfo(DUMMY_DATA[0]);

      // 初始化時，綜合表顯示-總數據頁面
      setDataTableType("總數據");
    }
  }, []);
  // ***

  // ***** 圖片過場動畫處理器 *****
  useEffect(() => {
    //渲染時間太快會導致動畫無法呈現，要延遲處理
    const timePhoto = setTimeout(() => {
      setPhotoTransition(true);
    }, 300);

    return () => {
      clearTimeout(timePhoto);
    };
  }, [playerDetailedInfo]);
  // ***

  // ***** 數據表單切換處理器 *****
  useEffect(() => {
    if (playerDetailedInfo) {
      const { comprehensiveData } = playerDetailedInfo;
      switch (dataTableType) {
        case "總數據":
          setDataTableValue(comprehensiveData.mixedData);
          break;
        case "進攻數據":
          setDataTableValue(comprehensiveData.offensiveData);
          break;
        case "防守數據":
          setDataTableValue(comprehensiveData.defensiveData);
          break;
      }
    }
  }, [dataTableType]);

  // ***** 資料刷新處理器 *****
  const upDatesHandler = (dataName) => {
    if (playerDetailedInfo !== undefined) {
      return playerDetailedInfo[dataName];
    }
  };
  // ***

  // ***** 獲取被點擊的選手詳細資訊，及數據表單切換處理 *****
  const getClickedNameHandler = (playerName) => {
    const clickedData = DUMMY_DATA.filter((data) => {
      return data.name === playerName;
    });
    setPlayerDetailedInfo(clickedData[0]);

    /* 表單如果切換前顯示的是『總數據』頁面時，只需更換內容。
       不是的話要切回預設，顯示『總數據』頁面 */
    if (dataTableType !== "總數據") {
      setDataTableType("總數據");
    } else {
      setDataTableValue(clickedData[0].comprehensiveData.mixedData);
    }
    setPhotoTransition(false);
  };
  // ***

  return (
    <div className="w-full h-full flex absolute">
      <div className={`${classes.bg} flex flex-column w-full `}>
        <div className="flex justify-content-center align-items-center h-25rem ">
          <div
            className={`${
              photoTransition ? classes.fadeIn : classes.fadeOut
            } mr-8 w-20rem h-20rem overflow-hidden border-circle shadow-8`}
          >
            <img
              className="w-full h-full"
              src={upDatesHandler("photo")}
              alt="選手照片"
            />
          </div>
          <div className="flex align-items-center">
            <div className="text-2xl mr-8">
              <div>姓名：{upDatesHandler("name")}</div>
              <div>年齡：{upDatesHandler("age")}</div>
              <div>身高：{upDatesHandler("height")}</div>
              <div>體重：{upDatesHandler("weight")}</div>
              <div>位子：{upDatesHandler("position")}</div>
              <div>隊伍：{upDatesHandler("team")}</div>
            </div>
            <div className="w-10rem h-10rem">
              <img src={blueWhaleLogo} className="w-full h-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-column align-items-end  h-25rem">
          <Dropdown
            className="m-2 w-full md:w-14rem"
            value={dataTableType}
            onChange={(e) => setDataTableType(e.value)}
            options={dropdownItem}
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
          playersData={playerList}
          hide={isHide}
          onClickPlayer={getClickedNameHandler}
        />
      </CollapseSideBar>
    </div>
  );
};
export default PlayerList;
