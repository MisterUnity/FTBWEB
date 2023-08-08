import FTBAPI from "../../index";

// 創建新帳號 Start
export const Register = (userInfo) => {
  return FTBAPI.post("/auth/Register", userInfo)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 創建新帳號 End

// 登入處理 Start
export const Login = (userInfo) => {
  return FTBAPI.post("/auth/Login", userInfo)
    .then((res) => {
      console.log(res.headers["set-cookie"]);
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 登入處理 End

// 登出處理 Start
export const Logout = () => {
  return FTBAPI.delete("/auth/Logout")
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
// 登出處理 End

// 登入狀態確認 Start
export const CheckLogin = (act) => {
  return FTBAPI.get("/auth/CheckLogin", {
    params: { act },
  })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
// 登入狀態確認 End
