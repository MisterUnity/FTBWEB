import { Fragment, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";
import { GetSchedule } from "../../../API/schedule/schedule";
import CustomDialog from "../../../components/CustomDialog/CustomDialog";
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
// const teamWebHandler = (team) => {
//   switch (team) {
//     case "新北航源":
//       return "https://www.facebook.com/HANGYUANFC/";
//     case "台北熊讚":
//       return "https://www.facebook.com/Taipei.bravo.football/";
//     case "台中藍鯨":
//       return "https://www.facebook.com/tbwfc/?locale=zh_TW";
//     case "高雄陽信":
//       return "http://sunny-women.tw/";
//     case "花蓮":
//       return "https://www.facebook.com/hualienfootball/";
//     case "戰神女足":
//       return "https://www.facebook.com/profile.php?id=100076107110949&locale=zh_TW";
//     default: break;
//   }
// };

const ForestageHome = (props) => {
  const { authContext, showToast, dialogResult, errorHandler, confirmDialog } =
    useGlobalStore();
  const navigate = useNavigate();
  // 項目狀態 Start
  // const [bShowAuthController, setController] = useState(false);
  const [team, setTeam] = useState("台北熊讚");
  const [dataTableValue, setDataTableValue] = useState(null);
  const [schedule, setSchedule] = useState(null);
  // 項目狀態 End

  // 切換頁面處理 Start
  const SkipToLogin = () => {
    navigate("/signIn");
  };
  // 切換頁面處理 End

  // 確認登入狀態 Start
  useEffect(() => {
    const initHandler = async () => {
      await CheckLogin()
        .then((res) => {
          // setController(true); //真正決定顯示的時機在確認登入完之後
          authContext.onSetSignInStatus(true);
          showToast("success", "登入成功", 1);
          return true;
        })
        .catch((err) => {
          // setController(true); //真正決定顯示的時機在確認登入完之後
          authContext.onSetSignInStatus(false);
          const Error = errorHandler(err);
          if (!Error) return false;
        });

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
    if (result.length > 0) {
      return result.map((object) => {
        return {
          schedule: (
            <div key={uuidv4()} className=" col-12 flex ">
              <div className="col-4">
                <div className="flex flex-column align-items-center ">
                  <div className="w-7rem h-7rem">
                    <img
                      className="w-full h-full"
                      src={logoHandler(object["Team1"])}
                    />
                  </div>
                  <div className="mt-3 text-green-50">{object["Team1"]}</div>
                </div>
              </div>
              <div className="col-4 flex flex-column justify-content-center align-items-center">
                <div className="my-4 text-xl text-green-50">
                  {object["Date"].split("T")[0]}
                </div>
                <div className="text-2xl text-green-50">{object["Field"]}</div>
              </div>
              <div className="col-4 flex flex-column align-items-center">
                <div className="w-7rem h-7rem">
                  <img
                    className="w-full h-full"
                    src={logoHandler(object["Team2"])}
                  />
                </div>
                <div className="mt-3 text-green-50">{object["Team2"]}</div>
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
    <Button label="Sign In" onClick={SkipToLogin} />
  );
  // 根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』 End

  const columns = () => {
    return columnsInfo.map((item) => {
      return <Column key={uuidv4()} field={item.filed} header={item.header} />;
    });
  };
  const dialogHandler = async () => {
    setDialogVisible(true);
    const res = await dialogResult();
    console.log({ res });
  };
  const [dialogVisible, setDialogVisible] = useState(false);
  return (
    <Fragment>
      <header className="homepage-header surface-600 text-100">
        <div>FTB WEB</div>
        <div className="nav-wrapper">{controllerResult}</div>
        {authContext.signInStatus.toString()}
      </header>
      <main className="flex-grow-1">
        <Button
          label="測試"
          onClick={() =>
            confirmDialog({
              message: "測試訊息",
              header: "Header",
              icon: "pi pi-info-circle",
              acceptClassName: "p-button-danger",
              accept: function () {
                console.log(true);
              },
              reject: function () {
                console.log(false);
              },
            })
          }
        />
        <CustomDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          header="測試"
          ConfirmButton={true}
          overwriteMode={true}
        >
          <div>測試</div>
        </CustomDialog>
        <div className="page-forestageHome">
          <Dropdown
            className="m-2 w-full md:w-14rem"
            options={dropdownItem}
            value={team}
            onChange={(e) => setTeam(e.value)}
          />
          <DataTable scrollable scrollHeight="700px" value={dataTableValue}>
            {columns()}
          </DataTable>
        </div>
      </main>
    </Fragment>
  );
};
export default ForestageHome;
