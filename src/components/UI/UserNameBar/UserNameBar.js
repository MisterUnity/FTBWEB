import classes from "./userNameBar.module.css";
// TODO 要抓取到userName
const UserNameBar = (props) => {
  return (
    <div className="flex align-items-center">
      <div className={`${classes.userNameBar} mx-3`}>
        <img
          className="w-full h-full"
          src="https://fastly.picsum.photos/id/1/1200/600.jpg?hmac=7xDzyVlLdITHaM66cy-yrgS6i437QYFJJ1PNYcJTO3Y"
          alt="userImage"
        />
      </div>
      <span className="text-xl text-bluegray-50">userName</span>
    </div>
  );
};
export default UserNameBar;
