import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
const OverallLayout = () => {
  return (
    <div className="flex flex-column w-screen h-screen">
      <Header className="flex-none" />
      <Main className="flex-grow-1"></Main>
      <Footer className="flex-none" />
    </div>
  );
};
export default OverallLayout;
