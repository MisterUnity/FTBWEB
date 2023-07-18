import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CropperTool from "../Backstage/CropperTool/CropperTool";
const ShowCropper = (props) => {
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Header"
        visible={props.visible}
        style={{ width: "50vw" }}
        onHide={() => props.onSwichVisible(false)}
      >
        {
          <CropperTool
            imageURL={props.imageURL}
            onGetImageBlob={props.onGetImageBlob}
            onSwichVisible={props.onSwichVisible}
          />
        }
      </Dialog>
    </div>
  );
};
export default ShowCropper;
