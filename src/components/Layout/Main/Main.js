import React from "react";
const Main = React.memo(({ className, children }) => {
  return <div className={className}>{children}</div>;
});
export default Main;
