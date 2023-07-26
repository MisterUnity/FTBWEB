import { useContext } from "react";
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
import AuthContext from "../../../../store/AuthContext";
import classes from "./BackstageMenu.module.css";

// 後台選單的顯示項目
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
    itemName: "Edit Schedule",
    icon: faCalendarDays,
    path: "editSchedule",
  },
  {
    id: "P-7",
    itemName: "Sign Out",
    icon: faRightFromBracket,
    path: "/",
  },
];
const BackstageMenu = () => {
  const authCtx = useContext(AuthContext);

  // 登出處理
  const signOutHandler = () => {
    <Link to="/signIn" />;
  };

  // li 項目處理
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
  return <ul className={classes.BackstageMenu}>{menuList}</ul>;
};
export default BackstageMenu;
