import axios from "axios";

const FTBAPI = axios.create({
  baseURL: process.env.REACT_APP_BASEURL_PROD,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

//回應攔截器
FTBAPI.interceptors.response.use(
  (response) => {
    const { ErrorCode, StatusCode } = response.data;
    if (ErrorCode && ErrorCode.includes("E") && StatusCode === 0) {
      throw response;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default FTBAPI;
