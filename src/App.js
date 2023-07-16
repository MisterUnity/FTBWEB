/** Change History (程式更動歷史範例，每個團隊方式不同)
 * WeiCheHuang   2023/06/29  (Task-01)新增模擬登入動作
 * JungShengLiu  2023/06/30  (Task-02)新增AuthContext,全局變數及函數，用於切換頁面
 */

import { Fragment } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
const App = () => {
  // Task-01 Add Start
  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
  // Task-01 Add End
  // Task-02 Add End
};

export default App;
