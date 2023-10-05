import React, { Fragment, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";
import ComprehensiveDataTable from "../../../UI/Backstage/ComprehensiveDataTable/ComprehensiveDataTable";
import CSDialog from "../../../../cs_components/CSDialog";

const GameHistoryDataTable = React.memo(
  ({ gameRecord, UpdateGameRecord, DataTableHeight }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isShowGameData, setIsShowGameData] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [dialogTitle, setDialogTitle] = useState("");

    // 資料重組，追加及修改『ID』『主客場根據 1 or 0 返回字串』 Start
    const dataReconstructionHandler = () => {
      if (gameRecord) {
        gameRecord.Data.forEach((item) => {
          item["ID"] = uuidv4();
          item["IsHome"] = item["IsHome"] === 1 ? "主場" : "客場";
        });
        return gameRecord.Data;
      }
    };
    // 資料重組，追加及修改『ID』『主客場根據 1 or 0 返回字串』 End

    // 比賽紀錄 列渲染處理 Start
    const columnData = [
      { id: "Date", filed: "Date", header: "日期" },
      { id: "Opponent", filed: "Opponent", header: "對戰隊伍" },
      { id: "Place", filed: "Place", header: "場地" },
      { id: "IsHome", filed: "IsHome", header: "主客場" },
    ];
    const columnRenderingHandler = () => {
      return columnData.map((item) => {
        return <Column key={item.id} field={item.filed} header={item.header} />;
      });
    };
    // 比賽紀錄 列渲染處理 End

    const columnsData = () => {
      const MixColumns = [
        ...gameRecord.OffColumns.map((item) => ({ ...item })),
        ...gameRecord.DefColumns.map((item) => ({ ...item })),
      ];
      const columnsData = {
        MixColumns: [...MixColumns.map((item) => ({ ...item }))],
        OffColumns: [...gameRecord.OffColumns.map((item) => ({ ...item }))],
        DefColumns: [...gameRecord.DefColumns.map((item) => ({ ...item }))],
      };
      return columnsData;
    };

    // Dialog 顯示，關閉，以及顯示的數據處理 Start
    const showGameDetailedData = (rowData) => {
      const MixData = JSON.parse(
        JSON.stringify({ ...rowData.OffensiveData, ...rowData.DefensiveData })
      );
      const _gameData = {
        MixData: JSON.parse(JSON.stringify(MixData)),
        OffensiveData: JSON.parse(JSON.stringify(rowData.OffensiveData)),
        DefensiveData: JSON.parse(JSON.stringify(rowData.DefensiveData)),
      };
      const title = (
        <div>
          <div>{`比賽日期：${rowData.Date}`}</div>
          <div>{`對戰隊伍：${rowData.Opponent}`}</div>
        </div>
      );
      // 更新比賽數據時需要的資料。
      _gameData["date"] = rowData.Date;
      _gameData["opponent"] = rowData.Opponent;

      setDialogTitle(title);
      setGameData(_gameData);
      setIsShowGameData(true);
    };
    const turnOffDialog = () => {
      setIsShowGameData(false);
    };
    // Dialog 顯示，關閉，以及顯示的數據處理 End

    return (
      <Fragment>
        <CSDialog
          header={dialogTitle}
          style={{ width: "85vw" }}
          visible={isShowGameData}
          onHide={turnOffDialog}
        >
          <ComprehensiveDataTable
            className="w-full"
            columnsInfo={columnsData()}
            gameData={gameData}
            UpdateGameRecord={UpdateGameRecord}
          />
        </CSDialog>
        <DataTable
          scrollable={true}
          scrollHeight={DataTableHeight}
          value={dataReconstructionHandler()}
          className="w-full"
          selectionMode="single"
          selection={selectedPlayer}
          onSelectionChange={(e) => {
            showGameDetailedData(e.value);
            setSelectedPlayer(e.value);
          }}
          dataKey="ID"
          tableStyle={{ minWidth: "20rem" }}
        >
          {columnRenderingHandler()}
        </DataTable>
      </Fragment>
    );
  }
);
export default GameHistoryDataTable;
