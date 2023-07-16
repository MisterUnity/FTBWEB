import { useState, Fragment, useContext } from "react";
import { Login, Register } from "../../API/Auth/userInfo/userInfo";
import { useNavigate } from "react-router-dom";
import SignInCard from "./SignInCard";
import EnterErrCard from "./EnterErrorCard";
import MsgSlice from "@/components/UI/MsgSlice/MsgSlice";
import backDrop from "../../assets/Background.jpg";
import AuthContext from "../../store/AuthContext";
import classes from "./signIn.module.css";

const SignIn = (props) => {

  const [strTitle, setTitle] = useState("Sign In");
  const [strSignInOrRegis, setTitle2] = useState("Create an account");
  const [errorMsgIsShown, setErrorMsgIsShown] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const ChangeTitle = () => {
    setTitle((strOldTitle)=>{
      if (strOldTitle === "Sign In"){
        setTitle2("Sign In");
        return "Register";
      }
      setTitle2("Create an account");
      return "Sign In";
    });
  };

  const DoLogin = (userData) => {
    return Login(userData)
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
      setIsLoad(false);
      alert(err);
    });
  }

  const sendUserInfoHandler = (userData) => {
    setIsLoad(true);
    if (strTitle === "Sign In") {
      DoLogin(userData);
    } else {
      Register(userData)
      .then((res) => {
        if (
          res.data.StatusCode === 1 &&
          res.data.StatusMessage === "Normal end."
        ) {
          authCtx.onSetSignInStatus(true);
          navigate("/");
          DoLogin(userData);
        } else {
          authCtx.onSetSignInStatus(false);
          setErrorMsgIsShown(true);
        }
        setIsLoad(false);
      })
      .catch((err) => {
        setIsLoad(false);
        alert(err);
      });
    }
  };

  const hideErrorMsgHandler = () => {
    setErrorMsgIsShown(false);
  };

  const showNewToHere = strTitle === 'Sign In' ? <p className="mr-2 text-green-50 opacity-100">New to here ?</p> : <></>;

  return (
    <Fragment>
      <div className="top-0 left-0 w-screen h-screen z-0">
        <img className="w-full h-full" src={backDrop} alt="Backdrop" />
      </div>
      <div className={classes.signIn}>
        {errorMsgIsShown && (
          <EnterErrCard onHideErrorMsg={hideErrorMsgHandler} />
        )}
        <SignInCard onSendUserInfo={sendUserInfoHandler} isLoad={isLoad} strTitle={strTitle}/>
        <MsgSlice className="flex justify-content-center bg-gray-900 opacity-90 mt-3">
          {showNewToHere}
          <p className="cursor-pointer text-yellow-400" onClick={ChangeTitle}>{strSignInOrRegis}</p>
        </MsgSlice>
      </div>
    </Fragment>
  );
};
export default SignIn;
