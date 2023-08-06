import { useContext, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {useGlobalStore} from "../../../../store/GlobalContextProvider";
import { Logout } from "../../../../API/Auth/userInfo/userInfo";

const ForestageMenu = () => {
  const navigate = useNavigate();
  const {authContext} = useGlobalStore();
  const menuRight = useRef(null);
  const items = [
    {
      // label: <Link to="/backstageHome">Go to Backstage</Link>,
      label: 'Go to Backstage',
      command(){
        navigate('/backstageHome');
      },
    },
    {
      // label: <Link to="/">Sign Out</Link>,
      label: 'Sign Out',
      command: () => {
        Logout().then((res) => {
          if (
            res.data.StatusCode === 1 &&
            res.data.StatusMessage === "Normal end."
          ) {
            authContext.onSetSignInStatus(false);
            navigate("/");
          }
        })
        .catch((err) => {
          alert(err);
        });
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
