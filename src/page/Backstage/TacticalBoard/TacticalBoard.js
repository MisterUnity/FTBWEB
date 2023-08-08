import Draggable from "react-draggable";
import classes from "./TacticalBoard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";

const TacticalBoard = () => {
  //  被拖動元素資料 Start
  const emptyAry = new Array(13);
  for (let i = 1; i < emptyAry.length; i++) {
    emptyAry[i] = { id: `player${i}`, name: `${i}` };
  }
  //  被拖動元素資料 End

  // 渲染可被拖動元素 Start
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
  // 渲染可被拖動元素 End

  return <div className="absolute w-full h-full flex">{players}</div>;
};
export default TacticalBoard;
