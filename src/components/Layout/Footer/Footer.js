import classes from "./Footer.module.css";
const Footer = (props) => {
  return (
    <footer className={`${classes.footer} ${props.className} bg-bluegray-900 `}>
      <h3 className="text-center">
        Copyright © 2023 - 2050 . All rights reserved.
      </h3>
    </footer>
  );
};
export default Footer;
