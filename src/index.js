import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./store/AuthContextProvider";
import App from "./App";
import "./index.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  // </React.StrictMode>
);
