import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

const PlayerListDataTable = React.memo(
  ({
    playersData,
    hide,
    onClickPlayer,
    disabled,
    currentTeam,
    onSwitchTeam,
  }) => {
    // 項目狀態 Start
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playersList, setPlayersList] = useState([]);
    const [team, setTeam] = useState("");
    // 項目狀態 End
    const teamItem = [
      "台北熊讚",
      "新北航源",
      "台中藍鯨",
      "高雄陽信",
      "花蓮",
      "戰神女足",
    ];
    useEffect(() => {
      setTeam(currentTeam);
    }, [currentTeam]);
    useEffect(() => {
      const newPlayerList = playersData.filter((item) => item["Team"] === team);
      if (newPlayerList.length === 0) return;
      onSwitchTeam(newPlayerList[0]["ID"], team);
      setPlayersList(newPlayerList);
    }, [team]);
    return (
      <div className="card">
        <div hidden={hide}>
          <Dropdown
            value={team}
            options={teamItem}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="請選擇隊伍"
          />
        </div>
        <DataTable
          scrollable
          scrollHeight="650px"
          hidden={hide}
          value={playersList}
          selectionMode="single"
          selection={selectedPlayer}
          rowClassName={disabled ? "p-disabled" : ""}
          onSelectionChange={(e) => {
            onClickPlayer(e.value.ID);
            setSelectedPlayer(e.value);
          }}
          dataKey="ID"
          // tableStyle={{ minWidth: "20rem" }}
        >
          <Column field="Name" header="選手"></Column>
        </DataTable>
      </div>
    );
  }
);
export default PlayerListDataTable;
