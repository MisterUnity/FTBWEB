import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PlayerListDataTable = ({ playersData, hide, onClickPlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  return (
    <div className="card">
      <DataTable
        hidden={hide}
        value={playersData}
        selectionMode="single"
        selection={selectedPlayer}
        onSelectionChange={(e) => {
          onClickPlayer(e.value.name);
          setSelectedPlayer(e.value);
        }}
        dataKey="id"
        tableStyle={{ minWidth: "20rem" }}
      >
        <Column field="name" header="選手"></Column>
      </DataTable>
    </div>
  );
};
export default PlayerListDataTable;
