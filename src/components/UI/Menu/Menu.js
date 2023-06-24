import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRectangleList,
  faChessBoard,
  faCalendarDays,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./menu.module.css";
const menuItem = [
  {
    id: "P-1",
    itemName: "Home",
    icon: faHouse,
    path: "/",
  },
  {
    id: "P-2",
    itemName: "Player List",
    icon: faRectangleList,
    path: "playerList",
  },
  {
    id: "P-3",
    itemName: "Tactical Boad",
    icon: faChessBoard,
    path: "tacticalBoad",
  },
  {
    id: "P-4",
    itemName: "Schedule",
    icon: faCalendarDays,
    path: "schedule",
  },
  {
    id: "P-",
    itemName: "Sign Out",
    icon: faRightFromBracket,
  },
];

const Menu = () => {
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
        <Link className="text-blue-50 text-2xl no-underline" to={item.path}>
          {item.itemName}
        </Link>
      </li>
    );
  });
  return <ul className={classes.menu}>{menuList}</ul>;
};
export default Menu;
