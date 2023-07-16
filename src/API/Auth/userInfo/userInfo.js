import FTBAPI from "../../index";

// Creact New Account and Password
export const Register = (userInfo) => {
  return FTBAPI.post("/auth/Register", userInfo)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Login
export const Login = (userInfo) => {
  return FTBAPI.post("/auth/Login", userInfo)
    .then((res) => {
      console.log(res.headers['set-cookie'])
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Logout
export const Logout = () => {
  return FTBAPI.delete("/auth/Logout")
    .then((res) => res).catch((err) => { throw err; });
};

// Check Login Status
export const CheckLogin = (act) => {
  return FTBAPI.get("/auth/CheckLogin", {
    params: { act }
  })
    .then((res) => res).catch((err) => { throw err; });
};
