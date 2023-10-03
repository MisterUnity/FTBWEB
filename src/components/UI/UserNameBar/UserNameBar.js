import React from "react";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import classes from "./userNameBar.module.css";
const UserNameBar = React.memo((props) => {
  const { userContext } = useGlobalStore();
  return (
    <div className="flex align-items-center">
      <div className={`${classes.userNameBar} mx-3`}>
        <img
          className="w-full h-full"
          src="https://fastly.picsum.photos/id/1/1200/600.jpg?hmac=7xDzyVlLdITHaM66cy-yrgS6i437QYFJJ1PNYcJTO3Y"
          alt="userImage"
        />
      </div>
      <span className="text-xl text-bluegray-50">{userContext.userName}</span>
    </div>
  );
});
export default UserNameBar;
