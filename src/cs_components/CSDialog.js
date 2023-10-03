import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
// 之後待製作的組件
const CSDialog = React.memo(({ header, visible, style, onHide, children }) => {
  const oDefaultStyle = {
    width: "50vw",
  };
  return (
    <Dialog
      header={header}
      visible={visible}
      style={style ? style : oDefaultStyle}
      onHide={onHide}
    >
      {children}
    </Dialog>
  );
});
export default CSDialog;
