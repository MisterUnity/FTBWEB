import Draggable from "react-draggable";
import classes from "./TacticalBoad.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";

const TacticalBoad = (props) => {
  // TODO 重疊處理：新元素疊舊元素
  const emptyAry = new Array(13);
  for (let i = 1; i < emptyAry.length; i++) {
    emptyAry[i] = { id: `player${i}`, name: `${i}` };
  }

  const players = emptyAry.map((item) => {
    return (
      <Draggable
        // onDrag={dragHandler}
        // onStop={dragHandlers}
        key={item.id}
        bounds="parent"
        defaultPosition={{ x: 0, y: 0 }}
      >
        <div className={`${classes.box} `}>
          <FontAwesomeIcon icon={faPerson} size="2xl" />
        </div>
      </Draggable>
    );
  });

  return <div className="absolute w-full h-full flex">{players}</div>;
};
export default TacticalBoad;
