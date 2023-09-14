import React, { useState, Fragment } from "react";
import { Login, Register } from "../../API/Auth/userInfo/userInfo";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../store/GlobalContextProvider";
import SignInCard from "./SignInCard";
import MsgSlice from "@/components/UI/MsgSlice/MsgSlice";
import backDrop from "../../assets/Background.jpg";
import classes from "./signIn.module.css";

const SignIn = React.memo((props) => {
  const { userContext, authContext, errorHandler } = useGlobalStore();
  const navigate = useNavigate();

  // 項目狀態 Start
  const [strTitle, setTitle] = useState("Sign In");
  const [strSignInOrRegis, setTitle2] = useState("Create an account");
  const [isLoad, setIsLoad] = useState(false);
  // 項目狀態 End

  // 切換表單顯示名稱 Start
  const ChangeTitle = () => {
    setTitle((strOldTitle) => {
      if (strOldTitle === "Sign In") {
        setTitle2("Sign In");
        return "Register";
      }
      setTitle2("Create an account");
      return "Sign In";
    });
  };
  // 切換表單顯示名稱 End

  // 登入處理 Start
  const DoLogin = (userData) => {
    return Login(userData)
      .then((res) => {
        authContext.onSetSignInStatus(true);
        userContext.onSetUserName(userData.act);
        navigate("/");
        setIsLoad(false);
      })
      .catch((err) => {
        setIsLoad(false);
        errorHandler(err);
      });
  };
  // 登入處理 End

  const sendUserInfoHandler = (userData) => {
    setIsLoad(true);
    if (strTitle === "Sign In") {
      DoLogin(userData);
    } else {
      //TODO 創建帳號時沒有再次確認是否有同樣的
      Register(userData)
        .then((res) => {
          authContext.onSetSignInStatus(true);
          navigate("/");
          DoLogin(userData);
          setIsLoad(false);
        })
        .catch((err) => {
          setIsLoad(false);
          errorHandler(err);
        });
    }
  };

  const showNewToHere =
    strTitle === "Sign In" ? (
      <p className="mr-2 text-green-50 opacity-100">New to here ?</p>
    ) : (
      <></>
    );

  return (
    <Fragment>
      <div className="top-0 left-0 w-screen h-screen z-0">
        <img className="w-full h-full" src={backDrop} alt="Backdrop" />
      </div>
      <div className={classes.signIn}>
        <SignInCard
          onSendUserInfo={sendUserInfoHandler}
          isLoad={isLoad}
          strTitle={strTitle}
        />
        <MsgSlice className="flex justify-content-center bg-gray-900 opacity-90 mt-3">
          {showNewToHere}
          <p className="cursor-pointer text-yellow-400" onClick={ChangeTitle}>
            {strSignInOrRegis}
          </p>
        </MsgSlice>
      </div>
    </Fragment>
  );
});
export default SignIn;
