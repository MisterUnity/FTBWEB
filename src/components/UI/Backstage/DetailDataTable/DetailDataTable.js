import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";

const DetailDataTable = (props) => {
  const [data, setData] = useState();

  useEffect(() => {
    setData(props.detailData);
  }, [props.detailData]);
  const columns = [
    { field: "toShoot", header: "toShoot" },
    { field: "cornerBall", header: "CornerBall" },
    { field: "goalKick", header: "Goal Kick" },
    { field: "header", header: "Header" },
    { field: "handBall", header: "Hand Ball" },
    { field: "penaltyKick", header: "Penalty Kick" },
    { field: "freeKick", header: "Free Kick" },
    { field: "offside", header: "offside" },
    { field: "yellowCard", header: "Yellow Card" },
    { field: "readCard", header: "Read Card" },
  ];
  return (
    <div className="card">
      <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
        {columns.map((data) => {
          return (
            <Column
              key={uuidv4()}
              field={data.field}
              header={data.header}
            ></Column>
          );
        })}
      </DataTable>
    </div>
  );
};
export default DetailDataTable;
