import { useState, useEffect, useReducer } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faSpinner } from "@fortawesome/free-solid-svg-icons";
import MsgSlice from "../../components/UI/MsgSlice/MsgSlice";
import classes from "./signInCard.module.css";

const initialState = { value: "", isValid: null };
const SignInCard = ({ strTitle }) => {
  // 表單標題處理 Start
  if (!strTitle) strTitle = "Sign In";
  // 表單標題處理 End

  // 項目狀態 Start
  const [formIsValid, setFormIsValid] = useState(false);
  // 項目狀態 End

  // 個輸入內容用Reducer來處理狀態 Start
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
      case "NICKNAME":
        return {
          value: action.nickname,
          isValid: action.nickname.trim().length > 0,
        };
      default:
        return state;
    }
  };
  const [userNameState, dispatchUserName] = useReducer(
    SignInCardReducer,
    initialState
  );
  const [passwordState, dispatchPassword] = useReducer(
    SignInCardReducer,
    initialState
  );
  const [nickNameState, dispatchNickname] = useReducer(
    SignInCardReducer,
    initialState
  );
  // 個輸入內容用Reducer來處理狀態 End

  // 姓名，密碼，暱稱處理器 Start
  const userNameChangeHandler = (e) => {
    dispatchUserName({ type: "USER_NAME", userName: e.target.value });
  };
  const passwordChangeHandler = (e) => {
    dispatchPassword({ type: "PASSWORD", password: e.target.value });
  };
  const nicknameChangeHandler = (e) => {
    dispatchNickname({ type: "NICKNAME", nickname: e.target.value });
  };
  // 姓名，密碼，暱稱處理器 End

  // useEffect的依賴項 Start
  const { isValid: userNameIsValid } = userNameState;
  const { isValid: passwordIsValid } = passwordState;
  const { isValid: nicknameIsValid } = nickNameState;
  const { value: userName } = userNameState;
  const { value: userPassword } = passwordState;
  const { value: nickname } = nickNameState;
  // useEffect的依賴項 End

  // 確認userName和password是否有效，有效的話開放『 LogIn 』按鈕 Start
  useEffect(() => {
    const identifier = setTimeout(() => {
      if (strTitle === "Register") {
        setFormIsValid(userNameIsValid && passwordIsValid && nicknameIsValid);
      } else {
        setFormIsValid(userNameIsValid && passwordIsValid);
      }
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [userNameIsValid, passwordIsValid, nicknameIsValid, strTitle]);
  // 確認userName和password是否有效，有效的話開放『 LogIn 』按鈕 End

  // 依據表單狀態更改『 Button 』樣式  Start
  const btnValid = props.isLoad ? (
    <Button
      label={
        <FontAwesomeIcon icon={faSpinner} spin style={{ color: "#ffffff" }} />
      }
      disabled
    />
  ) : formIsValid ? (
    <Button label={strTitle} />
  ) : (
    <Button label={strTitle} disabled />
  );
  // 依據表單狀態更改『 Button 』樣式  End

  // 送出表單資料處理 Start
  const sendFormHandler = (e) => {
    e.preventDefault();
    if (strTitle === "Sign In") {
      props.onSendUserInfo({
        act: userName,
        pwd: userPassword,
      });
    } else {
      props.onSendUserInfo({
        act: userName,
        pwd: userPassword,
        name: nickname,
      });
    }
  };
  // 送出表單資料處理 End

  // 姓名欄根據strTitle回傳不同組件 Start
  const nameBar =
    strTitle === "Register" ? (
      <div className="m-3">
        <span>
          <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
        </span>
        <span className="p-float-label">
          <InputText
            id="Nickname"
            onChange={nicknameChangeHandler}
            className="w-full"
          />
          <label className="ml-3" htmlFor="Nickname">
            Nickname
          </label>
        </span>
      </div>
    ) : (
      <></>
    );
  // 姓名欄根據strTitle回傳不同組件 End

  return (
    <MsgSlice className={`${props.className} ${classes.SignInCard} `}>
      <form
        onSubmit={sendFormHandler}
        className="flex flex-column justify-content-center"
      >
        <div className="text-yellow-300">{strTitle}</div>

        {/* userName Bar*/}
        <div className="m-3">
          <span>
            <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} />
          </span>
          <span className="p-float-label">
            <InputText
              id="username"
              onChange={userNameChangeHandler}
              className="w-full"
            />
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

        {/* Nickname bar */}
        {nameBar}

        {/* sendForm Button*/}
        {btnValid}
      </form>
    </MsgSlice>
  );
};
export default SignInCard;
