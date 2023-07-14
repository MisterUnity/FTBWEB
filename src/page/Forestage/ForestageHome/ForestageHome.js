import { Fragment, useContext } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import ForestageMenu from "../../../components/UI/Forestage/ForestageMenu/ForestageMenu";
import AuthContext from "../../../store/AuthContext";

const ForestageHome = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const viewSwitchHandler = () => {
    navigate("/signIn");
  };

  return (
    <Fragment>
      <header className="flex justify-content-end flex-none">
        {/*根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』*/}
        {authCtx.signInStatus ? (
          <ForestageMenu />
        ) : (
          <Button
            label="Sign In"
            onClick={() => {
              viewSwitchHandler();
            }}
          />
        )}
      </header>
      // TODO 製作賽程表頁面
      <main className="flex-grow-1">前台首頁</main>
    </Fragment>
  );
};
export default ForestageHome;
