import { useState, Fragment, useContext } from "react";
import { Login } from "../../API/Auth/userInfo/userInfo";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const sendUserInfoHandler = (userData) => {
    setIsLoad(true);
    // 『 1 』：輸入帳密正確，『 0 』：帳密輸入錯誤 or 無此帳號
    Login(userData)
      .then((res) => {
        if (
          res.data.StatusCode === 1 &&
          res.data.StatusMessage === "Normal end."
        ) {
          authCtx.onSetSignInStatus(true);
          navigate("/");
        } else {
          authCtx.onSetSignInStatus(false);
          setErrorMsgIsShown(true);
        }
        setIsLoad(false);
      })
      .catch((err) => {
        alert(err);
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
