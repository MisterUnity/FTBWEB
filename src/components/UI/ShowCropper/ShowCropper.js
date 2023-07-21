import { Dialog } from "primereact/dialog";
import CropperTool from "../Backstage/CropperTool/CropperTool";
const ShowCropper = (props) => {
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Header"
        visible={props.visible}
        style={{ width: "50vw" }}
        onHide={() => props.onSwitchVisible(false)}
      >
        {
          <CropperTool
            onGetImageBlob={props.onGetImageBlob}
            onSwitchVisible={props.onSwitchVisible}
          />
        }
      </Dialog>
    </div>
  );
};
export default ShowCropper;
