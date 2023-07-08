import { Routes, Route } from "react-router-dom";
import PlayerList from "../../../page/Backstage/PlayerList/PlayerList";
import TacticalBoad from "../../../page/Backstage/TacticalBoad/TacticalBoad";
import Schedule from "../../../page/Backstage/Schedule/Schedule";

const BackstageRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<PlayerList />} />
      <Route path="tacticalBoad" element={<TacticalBoad />} />
      <Route path="Schedule" element={<Schedule />} />
      <Route path="signOut" element={<Schedule />} />
    </Routes>
  );
};
export default BackstageRoute;
