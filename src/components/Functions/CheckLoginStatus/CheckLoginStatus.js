import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";

const checkLogin = async (authCtx, navigate) => {
  let result = true;
  await CheckLogin()
    .then((res) => {
      const { StatusCode, StatusMessage } = res.data;
      //TODO Normal部分是否變成為 Normal end
      if (StatusCode && StatusMessage.includes("Normal")) {
        authCtx.onSetSignInStatus(true);
        result = true;
      } else {
        authCtx.onSetSignInStatus(false);
        alert("登入逾時，返回至首頁");
        navigate("/");
        result = false;
      }
    })
    .catch((err) => {
      authCtx.onSetSignInStatus(false);
      alert(err);
      result = false;
    });
  return result;
};

export default checkLogin;
