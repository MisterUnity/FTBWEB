import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PlayerListDataTable = React.memo(
  ({ playersData, hide, onClickPlayer, disabled }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    return (
      <div className="card">
        <DataTable
          hidden={hide}
          value={playersData}
          selectionMode="single"
          selection={selectedPlayer}
          rowClassName={disabled ? "p-disabled" : ""}
          onSelectionChange={(e) => {
            onClickPlayer(e.value.ID);
            setSelectedPlayer(e.value);
          }}
          dataKey="ID"
          tableStyle={{ minWidth: "20rem" }}
        >
          <Column field="Name" header="選手"></Column>
        </DataTable>
      </div>
    );
  }
);
export default PlayerListDataTable;
