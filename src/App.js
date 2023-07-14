/** Change History (程式更動歷史範例，每個團隊方式不同)
 * WeiCheHuang   2023/06/29  (Task-01)新增模擬登入動作
 * JungShengLiu  2023/06/30  (Task-02)新增AuthContext,全局變數及函數，用於切換頁面
 */

import { useEffect, useContext, Fragment } from "react";
import { RouterProvider } from "react-router-dom";
import AuthContext from "./store/AuthContext";
import router from "./router/router";
const App = () => {
  // Task-01 Add Start
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      // Task-02 Add 更改signIn狀態，以及調用全局函數切換顯示頁面。
      authCtx.onSetSignInStatus(false); // 待後端開發完成前，先更改此行true || false模擬登入成功或失敗
    }, 1500);
  }, []);

  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
  // Task-01 Add End
  // Task-02 Add End
};

export default App;
