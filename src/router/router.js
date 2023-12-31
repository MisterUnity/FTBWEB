import { createBrowserRouter } from "react-router-dom";
import SignIn from "../page/SignIn/SignIn";
import Error from "../page/Error/Error";
import ForestageHome from "../page/Forestage/ForestageHome/ForestageHome";
import Backstage from "../page/Backstage/Backstage/Backstage";
import AddSchedule from "../page/Backstage/AddSchedule/AddSchedule";
import PlayerList from "../page/Backstage/PlayerList/PlayerList";
import AddPlayersInfo from "../page/Backstage/AddPlayersInfo/AddPlayersInfo";
import TacticalBoard from "../page/Backstage/TacticalBoard/TacticalBoard";
import BackstageHome from "../page/Backstage/BackstageHome/BackstageHome";
import EditComprehensiveDataTable from "../page/Backstage/EditComprehensiveDataTable/EditComprehensiveDataTable";
const router = createBrowserRouter([
  { path: "/", element: <ForestageHome />, errorElement: <Error /> },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/backstage",
    element: <Backstage />,
    children: [
      { index: true, path: "BackstageHome", element: <BackstageHome /> },
      { path: "playerList", element: <PlayerList /> },
      { path: "addPlayersInfo", element: <AddPlayersInfo /> },
      { path: "tacticalBoard", element: <TacticalBoard /> },
      {
        path: "editComprehensiveDataTable",
        element: <EditComprehensiveDataTable />,
      },
      { path: "addSchedule", element: <AddSchedule /> },
    ],
  },
]);

export default router;
