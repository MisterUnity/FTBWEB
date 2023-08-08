import React from "react";
import classes from "./MsgSlice.module.css";
const MsgSlice = React.memo(({ className, children }) => {
  return <div className={`${classes.slice} ${className}`}>{children}</div>;
});
export default MsgSlice;
