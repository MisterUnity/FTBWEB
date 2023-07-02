import { Routes, Route } from "react-router-dom";
import Home from "../../UI/Home/Home";
import PlayerList from "../../UI/playerList/PlayerList";
import TacticalBoad from "../../UI/TacticalBoad/TacticalBoad";
import Schedule from "../../UI/Schedule/Schedule";

const Main = (props) => {
  const router = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="playerList" element={<PlayerList />} />
      <Route path="tacticalBoad" element={<TacticalBoad />} />
      <Route path="Schedule" element={<Schedule />} />
    </Routes>
  );

  return <div className={props.className}>{router}</div>;
};
export default Main;
