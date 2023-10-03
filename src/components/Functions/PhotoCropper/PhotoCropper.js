import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import classes from "./CropperTool.module.css";
import CSDialog from "../../../cs_components/CSDialog";

const PhotoCropper = React.memo(
  ({ header, onHide, visible, onGetImageBlob }) => {
    const cropperRef = useRef();

    // 各項狀態  Start
    const [image, setImage] = useState();
    // 各項狀態  End

    // 釋放之前已存在的 URL Start
    useEffect(() => {
      return () => {
        if (image) {
          URL.revokeObjectURL(image);
        }
      };
    }, [image]);
    // 釋放之前已存在的 URL End

    // 圖片上傳處理 Start
    const onLoadImageHandler = (e) => {
      const file = e.target.files && e.target.files[0];

      if (file) {
        setImage(URL.createObjectURL(file));
      }
      // 重複上傳同一張圖片時要重置Value，不然傳一樣的圖片時會無法觸發事件
      e.target.value = "";
    };
    // 圖片上傳處理 End

    // 圖片裁切處理 Start
    const onCropHandler = () => {
      const cropper = cropperRef.current;
      if (cropper) {
        const canvas = cropper.getCanvas();
        canvas.toBlob((image) => {
          onGetImageBlob(URL.createObjectURL(image), image);
          onHide();
        });
      }
    };
    // 圖片裁切處理 End

    return (
      <CSDialog header={header} visible={visible} onHide={onHide}>
        <div className={classes.cropperWrapper}>
          <Cropper
            className={classes.cropper}
            ref={cropperRef}
            backgroundClassName={classes.cropperBackground}
            src={image}
            stencilProps={{ aspectRatio: 1 }}
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
  }
);
export default PhotoCropper;
