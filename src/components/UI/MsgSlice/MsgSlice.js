import classes from "./MsgSlice.module.css";
const MsgSlice = (props) => {
  return (
    <div className={`${classes.slice} ${props.className}`}>{props.children}</div>
  );
};
export default MsgSlice;
