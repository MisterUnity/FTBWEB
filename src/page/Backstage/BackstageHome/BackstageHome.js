import { Outlet } from "react-router-dom";
import Header from "../../../components/Layout/Header/Header";
import Main from "../../../components/Layout/Main/Main";
import Footer from "../../../components/Layout/Footer/Footer";
import SideBar from "../../../components/UI/Backstage/SideBar/SideBar";
import BackstageHeader from "../../../components/Layout/Header/header.module.css";
import BackstageFooter from "../../../components/Layout/Footer/Footer.module.css";

// Main 的『 relative 』是為了給『 TacticalBoad 』組件的元素拖曳限制範圍用
const BackstageHome = () => {
  return (
    <div className="flex flex-column w-screen h-screen ">
      <Header
        className={`
        ${BackstageHeader.BackstageHeader} flex flex-none justify-content-between 
                                           align-items-center w-full bg-bluegray-900`}
      >
        <SideBar />
        <h1 className="mr-3">Football Tactical Plan</h1>
      </Header>

      <Main className="flex-grow-1 relative w-full">
        <Outlet />
      </Main>

      <Footer
        className={`${BackstageFooter.BackstageFooter} flex-none w-full bg-bluegray-900`}
      >
        <h3 className="text-center">
          Copyright © 2023 - 2050 . All rights reserved.
        </h3>
      </Footer>
    </div>
  );
};
export default BackstageHome;
