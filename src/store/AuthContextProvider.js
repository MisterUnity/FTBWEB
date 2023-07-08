import { useState, useEffect } from "react";
import LoadingFullPage from "../components/Functions/LoadingFullPage/LoadingFullPage";
import AuthContext from "./auth-context";
import SignIn from "../page/SignIn/SignIn";
import ForestageHome from "../page/Forestage/ForestageHome/ForestageHome";
import BackstageHome from "../page/Backstage/BackstageHome/BackstageHome";
const AuthContextProvider = (props) => {
  const [finalRoute, setFinalRoute] = useState(LoadingFullPage);
  const [signInStatus, setSignInStatus] = useState(false);

  useEffect(() => {
    const userSignInfo = localStorage.getItem("signInInfo");
    if (userSignInfo === 1) {
      setSignInStatus(true);
    }
  }, []);

  //change Sign In Status
  const signInStatusHandler = (status) => {
    setSignInStatus(status);
  };

  const pageHandler = (viewName) => {
    localStorage.setItem("viewInfo", viewName);
  };

  const viewHandler = (viewName) => {
    switch (viewName) {
      case "SignIn":
        setFinalRoute(<SignIn />);
        break;
      case "SignOut":
        setSignInStatus(false);
        localStorage.removeItem("viewInfo");
        localStorage.removeItem("signInInfo");
        setFinalRoute(<ForestageHome />);
        break;
      case "ForestageHome":
        setFinalRoute(<ForestageHome />);
        break;
      case "BackstageHome":
        setFinalRoute(<BackstageHome />);
        break;
    }
  };
  const authContext = {
    signInStatus: signInStatus,
    finalRoute: finalRoute,
    onViewSwitch: viewHandler,
    onSetSignInStatus: signInStatusHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
