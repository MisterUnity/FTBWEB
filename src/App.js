/** Change History (程式更動歷史範例，每個團隊方式不同)
 * WeiCheHuang   2023/06/29  (Task-01)新增模擬登入動作
 * WeiCheHuang   2023/06/30  (通常會是組織內的任務單號)通常會是組織內的任務標題
 * WeiCheHuang   2023/07/01  (通常會是組織內的任務單號)通常會是組織內的任務標題
 */

import OverallLayout from "./components/Layout/OverallLayout/OverallLayout";
import LoadingFullPage from "./components/Functions/LoadingFullPage/LoadingFullPage";
import { useEffect, useState } from "react";
import SignIn from "./page/SignIn/SignIn";
const App = () => {
  // return <OverallLayout />; //Task-01 Mark

  // Task-01 Add Start
  const [FinalRoute, setFinalRoute] = useState(LoadingFullPage);
  useEffect(() => {
    let bLoginOK = false;
    setTimeout(() => {
      bLoginOK = false; // 待後端開發完成前，先更改此行true || false模擬登入成功或失敗
      if (bLoginOK) {
        setFinalRoute(<OverallLayout />);
      } else {
        setFinalRoute(<SignIn />);
      }
    }, 2000);
  }, []);
  return <div>{FinalRoute}</div>;
  // Task-01 Add End
};

export default App;
