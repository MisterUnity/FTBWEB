import { useState, Fragment } from "react";
import SignInCard from "./SignInCard";
import EnterErrCard from "./EnterErrorCard";
import MsgCard from "./MsgCard";
import backDrop from "../../assets/Background.jpg";
import classes from "./signIn.module.css";

const SignIn = () => {
  const [errorMsgIsShown, seterrorMsgIsShown] = useState(false);

  const showErrorMsgHandler = () => {
    seterrorMsgIsShown(true);
  };
  const hideErrorMsgHandler = () => {
    seterrorMsgIsShown(false);
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
        <SignInCard onShowErrorMsg={showErrorMsgHandler} />
        <MsgCard />
      </div>
    </Fragment>
  );
};
export default SignIn;
