import { Fragment, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";

import ForestageMenu from "../../../components/UI/Forestage/ForestageMenu/ForestageMenu";
import Taipei from "../../../assets/台北熊讚.png";
import newTaipei from "../../../assets/新北航源.png";
import Taoyuan from "../../../assets/桃園戰神.png";
import Taichung from "../../../assets/台中藍鯨.png";
import Kaohsiung from "../../../assets/高雄陽信.png";
import Hualien from "../../../assets/花蓮女足.png";
import "./ForestageHome.scss";

const columnsInfo = [
  {
    filed: "date",
    header: "日期",
  },
  {
    filed: "opponent",
    header: "對手",
  },
  {
    filed: "logo",
    header: "Logo",
  },
  {
    filed: "field",
    header: "場地",
  },
];
const dropdownItem = [
  "台北熊讚",
  "新北航源",
  "台中藍鯨",
  "高雄陽信",
  "花蓮",
  "戰神女足",
];
const logoHandler = (opponent) => {
  switch (opponent) {
    case "新北航源":
      return newTaipei;
    case "台北熊讚":
      return Taipei;
    case "台中藍鯨":
      return Taichung;
    case "高雄陽信":
      return Kaohsiung;
    case "花蓮":
      return Hualien;
    case "戰神女足":
      return Taoyuan;
  }
};
const teamWebHandler = (team) => {
  switch (team) {
    case "新北航源":
      return "https://www.facebook.com/HANGYUANFC/";
    case "台北熊讚":
      return "https://www.facebook.com/Taipei.bravo.football/";
    case "台中藍鯨":
      return "https://www.facebook.com/tbwfc/?locale=zh_TW";
    case "高雄陽信":
      return "http://sunny-women.tw/";
    case "花蓮":
      return "https://www.facebook.com/hualienfootball/";
    case "戰神女足":
      return "https://www.facebook.com/profile.php?id=100076107110949&locale=zh_TW";
  }
};
//測試用假資料
const DUMMY_DATA = [
  {
    newTaipei: [
      {
        date: "2023-09-04",
        opponent: "台北熊讚",
        field: "台北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台中藍鯨",
        field: "台中體育館",
      },
      {
        date: "2023-09-06",
        opponent: "高雄陽信",
        field: "高雄體育館",
      },
      {
        date: "2023-09-07",
        opponent: "花蓮",
        field: "花蓮體育館",
      },
      {
        date: "2023-09-07",
        opponent: "戰神女足",
        field: "桃園體育館",
      },
    ],
  },
  {
    taipei: [
      {
        date: "2023-09-04",
        opponent: "新北航源",
        field: "新北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台中藍鯨",
        field: "台中體育館",
      },
      {
        date: "2023-09-06",
        opponent: "高雄陽信",
        field: "高雄體育館",
      },
      {
        date: "2023-09-07",
        opponent: "花蓮",
        field: "花蓮體育館",
      },
      {
        date: "2023-09-07",
        opponent: "戰神女足",
        field: "桃園體育館",
      },
    ],
  },
  {
    taichung: [
      {
        date: "2023-09-04",
        opponent: "新北航源",
        field: "新北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台北熊讚",
        field: "台北體育館",
      },
      {
        date: "2023-09-06",
        opponent: "高雄陽信",
        field: "高雄體育館",
      },
      {
        date: "2023-09-07",
        opponent: "花蓮",
        field: "花蓮體育館",
      },
      {
        date: "2023-09-07",
        opponent: "戰神女足",
        field: "桃園體育館",
      },
    ],
  },
  {
    kaohsiung: [
      {
        date: "2023-09-04",
        opponent: "新北航源",
        field: "新北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台北熊讚",
        field: "台北體育館",
      },
      {
        date: "2023-09-06",
        opponent: "台中藍鯨",
        field: "台中體育館",
      },
      {
        date: "2023-09-07",
        opponent: "花蓮",
        field: "花蓮體育館",
      },
      {
        date: "2023-09-07",
        opponent: "戰神女足",
        field: "桃園體育館",
      },
    ],
  },
  {
    Hualien: [
      {
        date: "2023-09-04",
        opponent: "新北航源",
        field: "新北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台北熊讚",
        field: "台北體育館",
      },
      {
        date: "2023-09-06",
        opponent: "台中藍鯨",
        field: "台中體育館",
      },
      {
        date: "2023-09-07",
        opponent: "高雄陽信",
        field: "高雄體育館",
      },
      {
        date: "2023-09-07",
        opponent: "戰神女足",
        field: "桃園體育館",
      },
    ],
  },
  {
    mars: [
      {
        date: "2023-09-04",
        opponent: "新北航源",
        field: "新北體育館",
      },
      {
        date: "2023-09-05",
        opponent: "台北熊讚",
        field: "台北體育館",
      },
      {
        date: "2023-09-06",
        opponent: "台中藍鯨",
        field: "台中體育館",
      },
      {
        date: "2023-09-07",
        opponent: "高雄陽信",
        field: "高雄體育館",
      },
      {
        date: "2023-09-07",
        opponent: "花蓮",
        field: "花蓮體育館",
      },
    ],
  },
];
// 把根據對戰對手追加對手logo屬性進去
for (const item of DUMMY_DATA) {
  for (const props in item) {
    if (item.hasOwnProperty.call(item, props)) {
      for (const subItem of item[props]) {
        subItem["logo"] = (
          <div className="w-7rem h-7rem">
            <a href={teamWebHandler(subItem["opponent"])}>
              <img
                className="w-full h-full"
                src={logoHandler(subItem["opponent"])}
              />
            </a>
          </div>
        );
      }
    }
  }
}

const ForestageHome = (props) => {
  const { authContext, showToast } = useGlobalStore();
  const navigate = useNavigate();
  // 項目狀態 Start
  const [bShowAuthController, setController] = useState(false);
  const [team, setTeam] = useState("台北熊讚");
  const [tableData, setTableData] = useState([]);
  // 項目狀態 End

  // 切換頁面處理 Start
  const SkipToLogin = () => {
    navigate("/signIn");
  };
  // 切換頁面處理 End

  // 確認登入狀態 Start
  useEffect(() => {
    CheckLogin()
      .then((res) => {
        setController(true); //真正決定顯示的時機在確認登入完之後
        const { StatusCode, StatusMessage } = res.data;
        if (StatusCode && StatusMessage.includes("Normal")) {
          authContext.onSetSignInStatus(true);
          showToast("success", "登入成功", 1);
        } else {
          authContext.onSetSignInStatus(false);
        }
      })
      .catch((err) => {
        setController(true); //真正決定顯示的時機在確認登入完之後
        authContext.onSetSignInStatus(false);
        showToast("錯誤", `${err.data.ErrorMessage}`, 0);
      });
  }, []);
  // 確認登入狀態 End

  // 切換各隊賽程表 Start
  useEffect(() => {
    switch (team) {
      case "新北航源":
        setTableData(DUMMY_DATA[0]["newTaipei"]);
        break;
      case "台北熊讚":
        setTableData(DUMMY_DATA[1]["taipei"]);
        break;
      case "台中藍鯨":
        setTableData(DUMMY_DATA[2]["taichung"]);
        break;
      case "高雄陽信":
        setTableData(DUMMY_DATA[3]["kaohsiung"]);
        break;
      case "花蓮":
        setTableData(DUMMY_DATA[4]["Hualien"]);
        break;
      case "戰神女足":
        setTableData(DUMMY_DATA[5]["mars"]);
        break;
    }
  }, [team]);
  // 切換各隊賽程表 End

  // 根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』 Start
  const controllerResult = !bShowAuthController ? (
    <></>
  ) : authContext.signInStatus ? (
    <ForestageMenu />
  ) : (
    <Button label="Sign In" onClick={SkipToLogin} />
  );
  // 根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』 End
  const columns = () => {
    return columnsInfo.map((item) => {
      return <Column key={uuidv4()} field={item.filed} header={item.header} />;
    });
  };
  return (
    <Fragment>
      <header className="homepage-header surface-600 text-100">
        <div>FTB WEB</div>
        <div className="nav-wrapper">{controllerResult}</div>
      </header>
      <main className="flex-grow-1 ">
        <div>
          <div>賽程表</div>
          <div className="">
            <Dropdown
              className="m-2 w-full md:w-14rem"
              options={dropdownItem}
              value={team}
              onChange={(e) => setTeam(e.value)}
            />
            <DataTable scrollable scrollHeight="400px" value={tableData}>
              {columns()}
            </DataTable>
          </div>
        </div>
      </main>
    </Fragment>
  );
};
export default ForestageHome;
