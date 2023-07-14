import { useState } from "react";
import LoadingFullPage from "../components/Functions/LoadingFullPage/LoadingFullPage";
import AuthContext from "./AuthContext";
import SignIn from "../page/SignIn/SignIn";
import ForestageHome from "../page/Forestage/ForestageHome/ForestageHome";
import BackstageHome from "../page/Backstage/BackstageHome/BackstageHome";
const AuthContextProvider = (props) => {
  const [signInStatus, setSignInStatus] = useState(false);

  //change Sign In Status
  const signInStatusHandler = (status) => {
    setSignInStatus(status);
  };

  const authContext = {
    signInStatus: signInStatus,
    onSetSignInStatus: signInStatusHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
