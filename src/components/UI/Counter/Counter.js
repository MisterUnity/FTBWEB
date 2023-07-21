import { useSelector, useDispatch } from "react-redux";
import { counterAction } from "../../../store/ReduxStore/counterSlice";
const Counter = () => {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter.counter);
  const show = useSelector((state) => state.counter.showCounter);

  const incrementHandler = () => {
    dispatch(counterAction.increment());
  };
  const decrementHandler = () => {
    dispatch(counterAction.decrement());
  };
  const increaseHandler = () => {
    dispatch(counterAction.increase(2));
  };
  const toggleCounterHandler = () => {
    dispatch(counterAction.toggleCounter());
  };
  return (
    <div>
      <div>{counter}</div>
      <button
        onClick={() => {
          incrementHandler();
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          decrementHandler();
        }}
      >
        -
      </button>
      <button
        onClick={() => {
          increaseHandler();
        }}
      >
        +2
      </button>
    </div>
  );
};

export default Counter;
