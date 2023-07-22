import { Fragment, useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import ForestageMenu from "../../../components/UI/Forestage/ForestageMenu/ForestageMenu";
import AuthContext from "../../../store/AuthContext";
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
import "./ForestageHome.scss";

const ForestageHome = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const viewSwitchHandler = () => {
    navigate("/signIn");
  };
  const [bShowAuthController, setController] = useState(false);

  useEffect(() => {
    CheckLogin()
      .then((res) => {
        const { StatusCode, StatusMessage } = res.data;
        setController(true); //真正決定顯示的時機在確認登入完之後
        if (StatusCode && StatusMessage.includes("Normal")) {
          authCtx.onSetSignInStatus(true);
        } else {
          authCtx.onSetSignInStatus(false);
        }
      })
      .catch((err) => {
        authCtx.onSetSignInStatus(false);
        alert(err);
      });
  }, []);

  const controllerResult = !bShowAuthController ? (
    <></>
  ) : authCtx.signInStatus ? (
    <ForestageMenu />
  ) : (
    <Button label="Sign In" onClick={viewSwitchHandler} />
  );

  return (
    <Fragment>
      <header className="homepage-header surface-600 text-100">
        <div>FTB WEB</div>
        {/*根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』*/}
        <div className="nav-wrapper">{controllerResult}</div>
      </header>
      // TODO 製作賽程表頁面
      <main className="flex-grow-1">前台首頁</main>
    </Fragment>
  );
};
export default ForestageHome;
