import { Fragment, useContext } from "react";
import { Button } from "primereact/button";
import ShowMenu from "../../components/UI/ShowMenu/ShowMenu";
import AuthContext from "../../store/auth-context";

const ForestageHome = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <Fragment>
      // TODO 製作賽程表頁面
      <header className="flex justify-content-end flex-none">
        {/*根據登入狀態顯示『 登入鈕 』 or 『 小漢堡 』*/}
        {authCtx.signInStatus ? (
          <ShowMenu />
        ) : (
          <Button
            label="Sign In"
            onClick={() => {
              authCtx.onViewSwitch("SignIn");
            }}
          />
        )}
      </header>
      <main className="flex-grow-1">前台首頁</main>
    </Fragment>
  );
};
export default ForestageHome;
