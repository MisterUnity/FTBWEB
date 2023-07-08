import { useState, Fragment, useContext } from "react";
import SignInCard from "./SignInCard";
import EnterErrCard from "./EnterErrorCard";
import MsgCard from "./MsgCard";
import backDrop from "../../assets/Background.jpg";
import AuthContext from "../../store/auth-context";
import classes from "./signIn.module.css";
import { Login } from "../../API/userInfo/userInfo";

const SignIn = (props) => {
  const [errorMsgIsShown, setErrorMsgIsShown] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const authCtx = useContext(AuthContext);
  const sendUserInfoHandler = (userData) => {
    setIsLoad(true);
    // 『 1 』：輸入帳密正確，『 0 』：帳密輸入錯誤 or 無此帳號
    Login(userData).then((res) => {
      if (
        res.data.StatusCode === 1 &&
        res.data.StatusMessage === "Normal end."
      ) {
        authCtx.onSetSignInStatus(true);
        authCtx.onViewSwitch("ForestageHome");
        localStorage.setItem("signInInfo", "1");
      } else {
        authCtx.onSetSignInStatus(false);
        setErrorMsgIsShown(true);
      }
      setIsLoad(false);
    });
  };

  const hideErrorMsgHandler = () => {
    setErrorMsgIsShown(false);
  };

  return (
    <Fragment>
      <div className="top-0 left-0 w-screen h-screen z-0">
        <img className="w-full h-full" src={backDrop} alt="Backdrop" />
      </div>
      <div className={classes.signIn}>
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
