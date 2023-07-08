import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import UserNameBa from "../../UserNameBar/UserNameBar";
import BackstageMenu from "../BackstageMenu/BackstageMenu";
const SideBar = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="card flex justify-content-center">
      <Sidebar
        className="bg-bluegray-900"
        visible={isVisible}
        onHide={() => setIsVisible(false)}
      >
        <UserNameBa />
        <BackstageMenu />
      </Sidebar>
      <Button
        className="bg-bluegray-900 border-none"
        icon={<FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />}
        onClick={() => setIsVisible(true)}
      />
    </div>
  );
};

export default SideBar;
