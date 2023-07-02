import { useState } from "react";
import LoadingFullPage from "../components/Functions/LoadingFullPage/LoadingFullPage";
import AuthContext from "./auth-context";
import SignIn from "../page/SignIn/SignIn";
import ForestageHome from "../page/ForestageHome/ForestageHome";
import OverallLayout from "../components/Layout/OverallLayout/OverallLayout";
const AuthContextProvider = (props) => {
  const [finalRoute, setFinalRoute] = useState(LoadingFullPage);
  const [signInStatus, setSignInStatus] = useState(false);

  //change Sign In Status
  const signInStatusHandler = (status) => {
    setSignInStatus(status);
  };

  const viewHandler = (viewName) => {
    switch (viewName) {
      case "SignIn":
        setFinalRoute(<SignIn />);
        break;
      case "SignOut":
        setFinalRoute(<ForestageHome />);
        break;
      case "ForestageHome":
        setFinalRoute(<ForestageHome />);
        break;
      case "BackstageHome":
        setFinalRoute(<OverallLayout />);
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
