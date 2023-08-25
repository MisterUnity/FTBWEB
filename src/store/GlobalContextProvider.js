import React, { useRef } from "react";
import { createContext, useContext, useState } from "react";
import { Toast } from "primereact/toast";

const GlobalStoreContext = createContext();

const GlobalContextProvider = ({ children }) => {
  // 設置目前使用者姓名 Start
  const [userName, setUserName] = useState("");
  const userNameHandler = (strUserName) => {
    setUserName(strUserName);
  };
  const userContext = {
    userName: userName,
    onSetUserName: userNameHandler,
  };
  // 設置目前使用者姓名 End

  // 吐司條功能 Start
  const toast = useRef();
  const showToast = (title, content, statusCode) => {
    let severity;
    switch (statusCode) {
      case 0:
        severity = "error";
        break;
      case 1:
        severity = "success";
        break;
      case 2:
        severity = "info";
        break;
      case 3:
        severity = "warn";
        break;
      default:
        severity = "success";
        break;
    }
    toast.current.show({
      severity: severity,
      summary: title,
      detail: content,
      life: 3000,
    });
  };
  // 吐司條功能 End

  // 登入登出狀態設置 Start
  const [signInStatus, setSignInStatus] = useState(false);
  const signInStatusHandler = (bStatus) => {
    setSignInStatus(bStatus);
  };
  const authContext = {
    signInStatus: signInStatus,
    onSetSignInStatus: signInStatusHandler,
  };
  // 登入登出狀態設置 End

  // 表單發送狀態處理 start
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitStatusHandler = (bStatus) => {
    setIsSubmitting(bStatus);
  };
  const submitContext = {
    submitStatus: isSubmitting,
    onSetSubmitStatus: submitStatusHandler,
  };
  // 表單發送狀態處理 End

  return (
    <GlobalStoreContext.Provider
      value={{
        userContext,
        authContext,
        submitContext,
        showToast,
      }}
    >
      {children}
      <Toast ref={toast}></Toast>
    </GlobalStoreContext.Provider>
  );
};
export default GlobalContextProvider;

export function useGlobalStore() {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
  }
  return context;
}
