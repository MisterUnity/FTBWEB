import React, { useState } from "react";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import classes from "./CollapseSideBar.module.css";
const CollapseSideBar = React.memo(
  ({ children, className, collapse, onSetIsHide }) => {
    return (
      <div
        className={`${collapse ? classes.collapse : classes.normal}
                  ${classes.collapseSideBar} ${className}`}
      >
        <div className="flex justify-content-end ">
          <Button
            label={
              <FontAwesomeIcon
                icon={faBars}
                size="xl"
                style={{ color: "#ffffff" }}
              />
            }
            onClick={onSetIsHide}
          />
        </div>
        <div className="children">{children}</div>
      </div>
    );
  }
);
export default CollapseSideBar;
