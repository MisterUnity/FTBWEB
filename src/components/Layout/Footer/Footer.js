import React from "react";
const Footer = React.memo(({ className, children }) => {
  return <footer className={className}>{children}</footer>;
});
export default Footer;
