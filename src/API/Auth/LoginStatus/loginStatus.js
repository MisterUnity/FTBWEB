import FTBAPI from "../../index";

// Check Login Status
export const CheckLogin = () => {
  return FTBAPI.get("/auth/CheckLogin")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
