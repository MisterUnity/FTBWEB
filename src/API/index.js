import axios from "axios";

// API 基本配置 Start
const FTBAPI = axios.create({
  //REACT_APP_BASEURL || REACT_APP_BASEURL_PROD
  baseURL: process.env.REACT_APP_BASEURL_PROD,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
// API 基本配置 End

// 回應攔截器 Start
FTBAPI.interceptors.response.use(
  (response) => {
    console.log({ response });
    const { ErrorCode, StatusCode, ErrorMessage } = response.data;
    if (
      ErrorCode &&
      ErrorCode.includes("E") && 
      StatusCode === 0
    ) {
      throw response;
    }
    return response;
  },
  (error) => {
    console.log({ error });
    throw error;
  }
);
// 回應攔截器 End

export default FTBAPI;
