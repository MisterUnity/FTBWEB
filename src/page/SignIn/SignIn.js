import { useState, Fragment, useContext } from "react";
import SignInCard from "./SignInCard";
import EnterErrCard from "./EnterErrorCard";
import MsgCard from "./MsgCard";
import backDrop from "../../assets/Background.jpg";
import AuthContext from "../../store/auth-context";
import classes from "./signIn.module.css";

const SignIn = (props) => {
  const [errorMsgIsShown, setErrorMsgIsShown] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const authCtx = useContext(AuthContext);
  const sendUserInfoHandler = (userData) => {
    //加密處理
    let userName = btoa(userData.user);
    let userPassword = btoa(userData.password);
    // TODO 送去後端處理
    setIsLoad(true);
    authCtx.onSetSignInStatus(true); // 模擬後台傳回的值 true: 登入成功 || false: 登入失敗

    //TODO timeout如不清除掉的話可以嗎？
    setTimeout(() => {
      if (authCtx.signInStatus) {
        authCtx.onViewSwitch("ForestageHome");
      } else {
        setErrorMsgIsShown(true);
      }
      setIsLoad(false);
    }, 500);
  };

  const hideErrorMsgHandler = () => {
    setErrorMsgIsShown(false);
  };

  return (
    <Fragment>
      <div className="top-0 left-0 w-screen h-screen z-0">
        <img className="w-full h-full" src={backDrop} alt="Backdrop" />
      </div>
      <div className={`${classes.signIn}`}>
        {errorMsgIsShown && (
          <EnterErrCard onHideErrorMsg={hideErrorMsgHandler} />
        )}
        <SignInCard onSendUserInfo={sendUserInfoHandler} isLoad={isLoad} />
        <MsgCard />
      </div>
    </Fragment>
  );
};
export default SignIn;
