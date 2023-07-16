import axios from "axios";
// axios.defaults.withCredentials = true;
const FTBAPI = axios.create({
  baseURL: "https://ftb-api.azurewebsites.net/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true
});
export default FTBAPI;
