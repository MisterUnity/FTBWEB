import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useGlobalStore } from "../../store/GlobalContextProvider";

const CustomDialog = ({
  header,
  visible,
  onHide,
  overwriteMode,
  ConfirmButton,
  style,
  children,
}) => {
  const { dialogResultHandler } = useGlobalStore();

  const actionHandler = (actionType) => {
    dialogResultHandler(actionType ? true : false);
    onHide();
  };

  const confirmHandler = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => actionHandler(0)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => actionHandler(1)}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={header}
      modal={overwriteMode}
      visible={visible}
      style={style ? style : { width: "50vw" }}
      onHide={onHide}
      footer={ConfirmButton ? confirmHandler : () => {}}
    >
      {children}
    </Dialog>
  );
};
export default CustomDialog;
