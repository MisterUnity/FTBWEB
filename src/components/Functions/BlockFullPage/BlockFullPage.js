import React from "react";
import { BlockUI } from "primereact/blockui";
import { ProgressSpinner } from "primereact/progressspinner";

const BlockFullPage = React.memo(({ className, blocked, children }) => {
  return (
    <BlockUI blocked={blocked} containerClassName={`h-full ${className}`}>
      {children}
      {blocked ? (
        <ProgressSpinner
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      ) : (
        <></>
      )}
    </BlockUI>
  );
});
export default BlockFullPage;
