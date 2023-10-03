import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import UserNameBar from "../../UserNameBar/UserNameBar";
import BackstageMenu from "../BackstageMenu/BackstageMenu";
const SideBar = React.memo(() => {
  // 項目狀態 Start
  const [isVisible, setIsVisible] = useState(false);
  // 項目狀態 End

  return (
    <div className="card flex justify-content-center">
      <Sidebar
        className="bg-bluegray-900"
        visible={isVisible}
        onHide={() => setIsVisible(false)}
      >
        <UserNameBar />
        <BackstageMenu />
      </Sidebar>
      <Button
        className="bg-bluegray-900 border-none"
        icon={<FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />}
        onClick={() => setIsVisible(true)}
      />
    </div>
  );
});

export default SideBar;
