import { useState, useEffect, useReducer } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/UI/Card/Card";
import classes from "./signInCard.module.css";

const initialState = { value: "", isValid: null };
const SignInCardReducer = (state, action) => {
  switch (action.type) {
    case "USER_NAME":
      return {
        value: action.userName,
        isValid: action.userName.trim().length > 0,
      };
    case "PASSWORD":
      return {
        value: action.password,
        isValid: action.password.trim().length > 0,
      };
    default:
      return state;
  }
};

const SignInCard = (props) => {
  // Check Enter Value is Valid
  const [formIsValid, setFormIsValid] = useState(false);

  // userName輸入內容狀態
  const [userNameState, dispatchUserName] = useReducer(
    SignInCardReducer,
    initialState
  );

  // password輸入內容狀態
  const [passwordState, dispatchPassword] = useReducer(
    SignInCardReducer,
    initialState
  );

  //
  const userNameChangeHandler = (e) => {
    dispatchUserName({ type: "USER_NAME", userName: e.target.value });
  };
  const passwordChangeHandler = (e) => {
    dispatchPassword({ type: "PASSWORD", password: e.target.value });
  };

  // useEffect的依賴項
  const { isValid: userNameIsValid } = userNameState;
  const { isValid: passwordIsValid } = passwordState;
  const { value: userName } = userNameState;
  const { value: userPassword } = passwordState;

  // 確認userName和password是否有效，有效的話開放『 LogIn 』按鈕
  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(userNameIsValid && passwordIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [userNameIsValid, passwordIsValid]);

  // 依據表單狀態更改『 Button 』樣式
  const btnValid = props.isLoad ? (
    <Button
      label={
        <FontAwesomeIcon icon={faSpinner} spin style={{ color: "#ffffff" }} />
      }
      disabled
    />
  ) : formIsValid ? (
    <Button label="LogIn" />
  ) : (
    <Button label="LogIn" disabled />
  );

  // Send Form Data Handler
  const sendFormHandler = (e) => {
    e.preventDefault();
    props.onSendUserInfo({
      act: userName,
      pwd: userPassword,
    });
  };

  return (
    <Card className={`${props.className} ${classes.SignInCard} `}>
      <form
        onSubmit={sendFormHandler}
        className="flex flex-column justify-content-center"
      >
        {/* userName Bar*/}
        <div className="m-3">
          <span>
            <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
          </span>
          <span className="p-float-label">
            <InputText id="username" onChange={userNameChangeHandler} />
            <label className="ml-3" htmlFor="username">
              Username
            </label>
          </span>
        </div>

        {/* password Bar*/}
        <div className="m-3">
          <span>
            <FontAwesomeIcon icon={faKey} style={{ color: "#ffffff" }} />
          </span>
          <span className="p-float-label">
            <Password
              className={classes.input}
              toggleMask
              feedback={false}
              onChange={passwordChangeHandler}
            />
            <label className="ml-3" htmlFor="password">
              Password
            </label>
          </span>
        </div>

        {/* sendForm Button*/}
        {btnValid}
      </form>
    </Card>
  );
};
export default SignInCard;
