import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../../store/GlobalContextProvider";
import { Logout } from "../../../../API/Auth/userInfo/userInfo";

const ForestageMenu = React.memo(() => {
  const navigate = useNavigate();
  const { authContext } = useGlobalStore();
  const menuRight = useRef(null);

  // 前台目錄選單處理 Start
  const items = [
    {
      label: "Go to Backstage",
      command() {
        navigate("/backstageHome");
      },
    },
    {
      label: "Sign Out",
      command: () => {
        Logout()
          .then((res) => {
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
  // 前台目錄選單處理 End

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
});
export default ForestageMenu;
