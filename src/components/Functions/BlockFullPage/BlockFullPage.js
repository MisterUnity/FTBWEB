import React from "react";
import { BlockUI } from "primereact/blockui";
const BlockFullPage = React.memo(({ blocked, children }) => {
  return (
    <BlockUI blocked={blocked} containerClassName="h-full">
      {{ children }}
    </BlockUI>
  );
});
export default BlockFullPage;
