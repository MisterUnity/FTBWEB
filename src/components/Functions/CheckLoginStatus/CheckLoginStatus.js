import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";

const checkLogin = async (authCtx, navigate) => {
  let result = true;
  await CheckLogin()
    .then((res) => {
      const { StatusCode, StatusMessage } = res.data;
      if (StatusCode && StatusMessage.includes("Normal end.")) {
        authCtx.onSetSignInStatus(true);
        result = true;
      }
    })
    .catch((err) => {
      if (err.data.ErrorCode) {
        if ((err.data.ErrorCode = "E0004")) {
          alert("登入逾時，返回至首頁");
          navigate("/");
        } else {
          alert(err.data.ErrorMessage);
        }
      } else {
        alert(err.message);
      }

      authCtx.onSetSignInStatus(false);
      result = false;
    });
  return result;
};

export default checkLogin;
