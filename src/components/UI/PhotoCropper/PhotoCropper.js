import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import classes from "./CropperTool.module.css";

// import { Dialog } from "primereact/dialog";
// import CropperTool from "../Backstage/CropperTool/CropperTool"; Deleted
import CSDialog from "../../../cs_components/CSDialog";

const PhotoCropper = ({header, onHide, visible, onGetImageBlob}) => {
  const cropperRef = useRef();

  // ***** 各項狀態 *****
  const [image, setImage] = useState();
  // ***

  // ***** 釋放之前已存在的 URL *****
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);
  // ***

  // ***** 圖片上傳處理 *****
  const onLoadImageHandler = (e) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
    // 重複上傳同一張圖片時要重置Value，不然傳一樣的圖片時會無法觸發事件
    e.target.value = "";
  };
  // ***

  // ***** 圖片裁切處理 *****
  const onCropHandler = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      canvas.toBlob((image) => {
        // props.onGetImageBlob(URL.createObjectURL(image));
        // props.onSwitchVisible(false);
        onGetImageBlob(URL.createObjectURL(image), image);
        onHide();
      });
    }
  };
  // ***

  return (
    <CSDialog
      // header="Header"
      // visible={props.visible}
      // style={{ width: "50vw" }}
      // onHide={() => props.onSwitchVisible(false)}
      header={header}
      visible={visible}
      onHide={onHide}
    >
      
      {/* <CropperTool
        // onGetImageBlob={props.onGetImageBlob}
        // onSwitchVisible={props.onSwitchVisible}
        onGetImageBlob={onGetImageBlob}
      /> */}
      {/** 原本CropperTool的內容，去掉了Fragment */}
      <div className={classes.cropperWrapper}>
        <Cropper
          className={classes.cropper}
          ref={cropperRef}
          backgroundClassName={classes.cropperBackground}
          src={image}
        />
      </div>
      <div className="flex align-items-center">
        <label
          className=" p-1 text-2xl border-round-md 
                    border-solid cursor-pointer 
                    text-blue-50 bg-bluegray-600"
          htmlFor="upLoad"
        >
          選擇檔案
        </label>
        <input
          id="upLoad"
          hidden={true}
          type="file"
          onChange={onLoadImageHandler}
        />
        {image && (
          <Button
            className="m-1 text-2xl border-round-md 
                      border-solid bg-bluegray-600"
            label="確定"
            onClick={onCropHandler}
          />
        )}
      </div>
    </CSDialog>
  );
};
export default PhotoCropper;
