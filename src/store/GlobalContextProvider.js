import React, { useRef } from "react";
import { createContext, useContext, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

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

  // 預置主題選擇功能(開發中) Start
  const [currentTheme, setTheme] = useState("default");
  const themeContext = { currentTheme, setTheme };
  // 預置主題選擇功能 End

  let dialogResultStatus = undefined;
  const dialogResult = async () => {
    if (dialogResultStatus === undefined || dialogResultStatus === null) {
      return new Promise((res, rej) => {
        let timeoutId;
        const checkStatus = () => {
          if (dialogResultStatus !== undefined && dialogResultStatus !== null) {
            res(dialogResultStatus);
            dialogResultStatus = undefined;
          } else {
            timeoutId = setTimeout(checkStatus, 100);
          }
        };
        checkStatus();

        return () => {
          clearTimeout(timeoutId);
        };
      });
    }
  };

  const dialogResultHandler = (boolean) => {
    dialogResultStatus = boolean;
  };

  const errorHandler = (objError) => {
    const errorMsg = objError?.data?.ErrorMessage
      ? objError.data.ErrorMessage
      : objError.message;
    showToast("Error", `錯誤訊息：${errorMsg}`, 0);
    return false;
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        userContext,
        authContext,
        submitContext,
        themeContext,
        showToast,
        dialogResult,
        dialogResultHandler,
        errorHandler,
        confirmDialog,
      }}
    >
      {children}
      <Toast data-theme={`${currentTheme}`} ref={toast}></Toast>
      <ConfirmDialog />
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
