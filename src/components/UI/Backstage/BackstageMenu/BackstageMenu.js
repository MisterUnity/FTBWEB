import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRectangleList,
  faAddressBook,
  faChessBoard,
  faCalendarDays,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./BackstageMenu.module.css";

// 後台選單目錄 Start
const menuItem = [
  {
    id: "P-1",
    itemName: "Backstage Home",
    icon: faHouse,
    path: "/backstageHome ",
  },
  {
    id: "P-2",
    itemName: "Player List",
    icon: faRectangleList,
    path: "playerList ",
  },
  {
    id: "P-3",
    itemName: "Add Players Info",
    icon: faAddressBook,
    path: "addPlayersInfo",
  },
  {
    id: "P-4",
    itemName: "Tactical Board",
    icon: faChessBoard,
    path: "tacticalBoard",
  },
  {
    id: "P-5",
    itemName: "Edit Comprehensive Data Table",
    icon: faCalendarDays,
    path: "editComprehensiveDataTable",
  },
  {
    id: "P-6",
    itemName: "Add Schedule",
    icon: faCalendarDays,
    path: "addSchedule",
  },
  {
    id: "P-7",
    itemName: "Sign Out",
    icon: faRightFromBracket,
    path: "/",
  },
];
// 後台選單目錄 End

const BackstageMenu = React.memo(() => {
  // 登出後台處理 Start
  const signOutHandler = () => {
    <Link to="/signIn" />;
  };
  // 登出後台處理 Start

  // li 項目處理 Start
  const menuList = menuItem.map((item) => {
    return (
      <li className="my-6 cursor-pointer" key={item.id}>
        <span className="m-4">
          <FontAwesomeIcon
            icon={item.icon}
            size="2xl"
            style={{ color: "#ffffff" }}
          />
        </span>
        <Link
          className="text-blue-50 text-2xl no-underline"
          to={item.path}
          onClick={item.itemName === "Sign Out" ? signOutHandler : null}
        >
          {item.itemName}
        </Link>
      </li>
    );
  });
  // li 項目處理 End

  return <ul className={classes.BackstageMenu}>{menuList}</ul>;
});
export default BackstageMenu;
