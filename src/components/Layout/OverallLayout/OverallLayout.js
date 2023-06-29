import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";

// Main 的『 relative 』是為了給『 TacticalBoad 』組件的元素拖曳限制範圍用
const OverallLayout = () => {
  return (
    <div className="flex flex-column w-screen h-screen ">
      <Header className="flex-none" />
      <Main className="flex-grow-1 relative " />
      <Footer className="flex-none" />
    </div>
  );
};
export default OverallLayout;
