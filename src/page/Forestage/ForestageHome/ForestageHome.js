import { Fragment, useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";
import { GetSchedule } from "../../../API/schedule/schedule";
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
    filed: "schedule",
    header: "賽程",
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
const headerMsg = "Football Tactical Plan";
const footerMsg = "Copyright © 2023 - 2050 . All rights reserved.";

const ForestageHome = (props) => {
  const { authContext, showToast, errorHandler } = useGlobalStore();

  const navigate = useNavigate();
  // 項目狀態 Start
  const [team, setTeam] = useState("台北熊讚");
  const [dataTableValue, setDataTableValue] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [dataTableHeight, setDataTableHeight] = useState("");

  // 項目狀態 End

  // 切換頁面處理 Start
  const SkipToLogin = () => {
    navigate("/signIn");
  };
  // 切換頁面處理 End

  // 確認登入狀態 Start
  useEffect(() => {
    const initHandler = async () => {
      await GetSchedule()
        .then((res) => {
          const { StatusCode, StatusMessage, Result } = res.data;
          if (StatusCode && StatusMessage.includes("Normal end.")) {
            setSchedule(Result);
            setDataTableValue(scheduleHandler(Result, team));
          }
        })
        .catch((err) => {
          const Error = errorHandler(err);
          if (!Error) return false;
        });
      // 動態設定dataTable顯示height超計算值後顯示scrollBar option
      const header = document.querySelector(".homepage-header");
      const footer = document.querySelector(".homepage-footer");
      const option = document.querySelector(".option");
      if (!header) return false; // 抓取不到元素的話跳出。
      const headerInfo = header.getBoundingClientRect();
      const footerInfo = footer.getBoundingClientRect();
      const optionInfo = option.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setDataTableHeight(
        windowHeight -
          headerInfo.height -
          footerInfo.height -
          optionInfo.height +
          "px"
      );
      await CheckLogin()
        .then((res) => {
          authContext.onSetSignInStatus(true);
          showToast("success", "登入成功", 1);
          return true;
        })
        .catch((err) => {
          authContext.onSetSignInStatus(false);
          const Error = errorHandler(err);
          if (!Error) return false;
        });
    };
    initHandler();
  }, []);
  // 確認登入狀態 End

  // 切換各隊賽程表 Start
  useEffect(() => {
    if (schedule) {
      setDataTableValue(scheduleHandler(schedule, team));
    }
  }, [team]);
  // 切換各隊賽程表 End

  //  各隊隊徽處理 Start
  const logoHandler = (logoName) => {
    switch (logoName) {
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
      default:
        break;
    }
  };
  //  各隊隊徽處理 End

  const scheduleHandler = (scheduleData, teamName) => {
    const result = scheduleData.filter(
      (object) => object["Team1"] === teamName || object["Team2"] === teamName
    );
    const logoStyle = "col-4 flex flex-column align-items-center";
    const logoSize = "w-4rem h-4rem";
    if (result.length > 0) {
      return result.map((object) => {
        return {
          schedule: (
            <div key={uuidv4()} className="grid grid-nogutter">
              <div className={logoStyle}>
                <div className={logoSize}>
                  <img
                    className="w-full h-full"
                    src={logoHandler(object["Team1"])}
                  />
                </div>
                <div className="text-green-50">{object["Team1"]}</div>
              </div>
              <div className="col-4 flex flex-column justify-content-center align-items-center">
                <div className="text-xl text-green-50">
                  {object["Date"].split("T")[0]}
                </div>
                <div className="text-2xl text-green-50">{object["Field"]}</div>
              </div>
              <div className={logoStyle}>
                <div className={logoSize}>
                  <img
                    className="w-full h-full"
                    src={logoHandler(object["Team2"])}
                  />
                </div>
                <div className="text-green-50 text-center">
                  {object["Team2"]}
                </div>
              </div>
            </div>
          ),
        };
      });
    } else {
      return [
        {
          schedule: (
            <div className="text-center">{`『 ${teamName} 』目前無任何賽程`}</div>
          ),
        },
      ];
    }
  };

  // 根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』 Start
  const controllerResult = authContext.signInStatus ? (
    <ForestageMenu />
  ) : (
    <Button
      className="border-none bg-green-300 text-green-50"
      label="Sign In"
      onClick={SkipToLogin}
    />
  );
  // 根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』 End

  const columns = () => {
    return columnsInfo.map((item) => {
      return <Column key={uuidv4()} field={item.filed} header={item.header} />;
    });
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div>{headerMsg}</div>
        <div className="nav-wrapper">{controllerResult}</div>
      </header>
      <main className="homepage-main">
        <div className="option">
          <Dropdown
            className="m-0 w-full md:w-14rem"
            options={dropdownItem}
            value={team}
            onChange={(e) => setTeam(e.value)}
          />
        </div>
        <div className="page-forestageHome ">
          <DataTable
            scrollable
            scrollHeight={dataTableHeight}
            value={dataTableValue}
          >
            {columns()}
          </DataTable>
        </div>
      </main>
      <footer className="homepage-footer">{footerMsg}</footer>
    </div>
  );
};
export default ForestageHome;
