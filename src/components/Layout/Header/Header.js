import { useState } from "react";
import SidebarMenu from "../../UI/SidebarMenu/SidebarMenu";
import classes from "./header.module.css";

// TODO 顯示用戶名稱以及顯示左側目錄欄按鈕
const Header = (props) => {
  return (
    <header
      className={`${classes.header} ${props.className} flex justify-content-between align-items-center bg-bluegray-900`}
    >
      <SidebarMenu />
      <h1 className="mr-3">Football Tactical Plan</h1>
    </header>
  );
};
export default Header;
