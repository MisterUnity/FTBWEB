import React, { useEffect, useRef, useState } from "react";
import { Cropper, CropperFade, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import classes from "./CropperTool.module.css";

const CropperTool = (props) => {
  const cropperRef = useRef();

  const [image, setImage] = useState("");

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      
      canvas.toBlob((image) => {
        // props.onGetImageBlob(URL.createObjectURL(image));
        props.onGetImageBlob(image);
        props.onSwichVisible(false);
      }, "image/jpeg", 0.95);
    }
  };

  const onLoadImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (props.imageURL) {
        console.log("useEffect作用");
        URL.revokeObjectURL(props.imageURL);
      }
    };
  }, [props.imageURL]);

  return (
    <div className="example">
      <div className={classes.cropperTool}>
        <Cropper
          ref={cropperRef}
          className={classes.cropperTool}
          backgroundClassName="example__cropper-background"
          src={props.imageURL}
        />
      </div>
      <div className="example__buttons-wrapper">
        <button className="example__button" onClick={onCrop}>
          確定裁剪
        </button>
      </div>
    </div>
  );
};

export default CropperTool;
