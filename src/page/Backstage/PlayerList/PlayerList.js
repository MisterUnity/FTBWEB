import { useEffect, useState } from "react";
import PlayerListDataTable from "../../../components/UI/Backstage/PlayerListDataTable/PlayerListDataTable";
import CollapseSideBar from "../../../components/UI/Backstage/CollapseSideBar/CollapseSideBar";
import ComprehensiveDataTable from "../../../components/UI/Backstage/ComprehensiveDataTable/ComprehensiveDataTable";
import classes from "./PlayerList.module.css";
//模擬用資料
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
    ComprehensiveData: {
      mixedData: {
        ColumnName: [
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
      offensiveData: { ColumnName: [{ field: "toShoot", header: "Code" }] },
      defensiveData: `防守數據${i}`,
    },
  });
}

const PlayerList = () => {
  const [playerList, setPlayerList] = useState();
  const [isHide, setIsHide] = useState(true);
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState();
  const [name, setName] = useState();
  const [photo, setPhoto] = useState();
  const [age, setAge] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [position, setPosition] = useState();
  const [team, setTeam] = useState();
  const [comprehensiveData, setComprehensiveData] = useState();
  const [photoTransition, setPhotoTransition] = useState(true);

  // ***** 初始數據處理 *****
  useEffect(() => {
    //TODO取得所有資料
    setPlayerList(
      DUMMY_DATA.map((data) => {
        return { id: data.id, name: data.name };
      })
    );
    upDatesHandler(DUMMY_DATA);
  }, []);
  // ***

  // ***** 點擊指定選手後，資料刷新處理 *****
  useEffect(() => {
    if (playerDetailedInfo !== undefined) {
      upDatesHandler(playerDetailedInfo);
    }

    //圖片過場動畫處理（渲染時間太快會導致動畫無法呈現，要延遲處理）
    const timePhoto = setTimeout(() => {
      setPhotoTransition(true);
    }, 300);

    return () => {
      clearTimeout(timePhoto);
    };
  }, [playerDetailedInfo]);
  // ***

  // ***** 控制側邊顯示欄 *****
  const hideHandler = () => {
    setIsHide(!isHide);
  };
  // ***

  // ***** 獲取被點擊的選手詳細資訊 *****
  const getClickedNameHandler = (Name) => {
    setPlayerDetailedInfo(
      DUMMY_DATA.filter((data) => {
        return data.name === Name;
      })
    );
    setPhotoTransition(false);
  };
  // ***

  // ***** 刷新資料處理器 *****
  const upDatesHandler = (aryData) => {
    setName(aryData[0].name);
    setPhoto(aryData[0].photo);
    setAge(aryData[0].age);
    setHeight(aryData[0].height);
    setWeight(aryData[0].weight);
    setPosition(aryData[0].position);
    setTeam(aryData[0].team);
    setComprehensiveData(aryData[0].ComprehensiveData);
  };
  // ***

  return (
    <div className="w-full h-full flex">
      <div className="flex flex-column w-full bg-pink-500">
        <div className="flex justify-content-center align-items-center h-25rem bg-green-500">
          <div
            className={`${
              photoTransition ? classes.fadeIn : classes.fadeOut
            }  w-20rem h-20rem overflow-hidden border-circle shadow-8`}
          >
            <img className={` w-full h-full`} src={photo} alt="選手照片" />
          </div>
          <div>
            <div>姓名：{name}</div>
            <div>年齡：{age}</div>
            <div>身高：{height}</div>
            <div>體重：{weight}</div>
            <div>位子：{position}</div>
            <div>隊伍：{team}</div>
          </div>
        </div>
        <div className="bg-orange-400 h-25rem">
          <ComprehensiveDataTable comprehensiveData={comprehensiveData} />
        </div>
      </div>
      <CollapseSideBar
        className="h-full bg-primary-500"
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
