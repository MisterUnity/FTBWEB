import React from "react";
const Header = React.memo(({ className, children }) => {
  return <header className={className}>{children}</header>;
});
export default Header;
