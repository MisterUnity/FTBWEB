import { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleList,
  faChessBoard,
  faCalendarDays,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../../../store/auth-context";
import classes from "./BackstageMenu.module.css";

// 後台選單的顯示項目
const menuItem = [
  {
    id: "P-1",
    itemName: "Player List",
    icon: faRectangleList,
    path: "/",
  },
  {
    id: "P-2",
    itemName: "Tactical Boad",
    icon: faChessBoard,
    path: "tacticalBoad",
  },
  {
    id: "P-3",
    itemName: "Schedule",
    icon: faCalendarDays,
    path: "schedule",
  },
  {
    id: "P-4",
    itemName: "Sign Out",
    icon: faRightFromBracket,
    path: "signOut",
  },
];
const BackstageMenu = () => {
  const authCtx = useContext(AuthContext);

  // 登出處理
  const signOutHandler = () => {
    authCtx.onViewSwitch("SignOut");
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
