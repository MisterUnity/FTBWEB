import { useContext, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AuthContext from "../../../../store/AuthContext";

const ForestageMenu = () => {
  const authCtx = useContext(AuthContext);
  const menuRight = useRef(null);
  const items = [
    {
      label: <Link to="/backstageHome">Go to Backstage</Link>,
    },
    {
      label: <Link to="/">Sign Out</Link>,
      command: () => {
        authCtx.onSetSignInStatus(false);
      },
    },
  ];

  return (
    <div className="card flex justify-content-center">
      <Menu
        model={items}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
      />
      <Button
        label={<FontAwesomeIcon icon={faBars} />}
        className="mr-2"
        onClick={(event) => menuRight.current.toggle(event)}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
    </div>
  );
};
export default ForestageMenu;
