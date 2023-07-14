import { createBrowserRouter } from "react-router-dom";
import SignIn from "../page/SignIn/SignIn";
import Error from "../page/Error/Error";
import ForestageHome from "../page/Forestage/ForestageHome/ForestageHome";
import BackstageHome from "../page/Backstage/BackstageHome/BackstageHome";
import EditSchedule from "../page/Backstage/EditSchedule/EditSchedule";
import PlayerList from "../page/Backstage/PlayerList/PlayerList";
import AddPlayersInfo from "../page/Backstage/AddPlayersInfo/AddPlayersInfo";
import TacticalBoard from "../page/Backstage/TacticalBoard/TacticalBoard";

const router = createBrowserRouter([
  { path: "/", element: <ForestageHome />/*, errorElement: <Error />*/ },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/backstageHome",
    element: <BackstageHome />,
    children: [
      { index: true, path: "playerList", element: <PlayerList /> },
      { path: "addPlayersInfo", element: <AddPlayersInfo /> },
      { path: "tacticalBoard", element: <TacticalBoard /> },
      { path: "editSchedule", element: <EditSchedule /> },
    ],
  },
]);

export default router;
