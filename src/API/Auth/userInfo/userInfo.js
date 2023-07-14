import FTBAPI from "../../index";

// Creact New Account and Password
export const Register = () => {
  return FTBAPI.post("/auth/Register")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Login Check
export const Login = (userInfo) => {
  return FTBAPI.post("/auth/Login", userInfo)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
