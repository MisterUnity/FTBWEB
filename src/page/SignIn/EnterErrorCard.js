import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/UI/Card/Card";
const EnterError = (props) => {
  return (
    <Card className="flex bg-red-900 opacity-90">
      <p className="mr-2 text-green-50 opacity-100">
        Incorrect username or password
      </p>
      <span className="cursor-pointer" onClick={props.onHideErrorMsg}>
        <FontAwesomeIcon
          icon={faXmark}
          beat
          size="xl"
          style={{ color: "#ff0000" }}
        />
      </span>
    </Card>
  );
};
export default EnterError;
