import axios from "axios";
const FTBAPI = axios.create({
  baseURL: "https://ftb-api.azurewebsites.net/api",
  timeout: 10000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },

  //   headers: { "X-Custom-Header": "foobar" },
});
export default FTBAPI;
