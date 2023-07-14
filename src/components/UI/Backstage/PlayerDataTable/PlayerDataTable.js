import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PlayerDataTable = (props) => {
  const columns = [
    { field: "photo", header: "Photo" },
    { field: "name", header: "Name" },
    { field: "gender", header: "Gender" },
    { field: "age", header: "Age" },
    { field: "height", header: "Height" },
    { field: "weight", header: "Weight" },
    { field: "position", header: "Position" },
    { field: "team", header: "Team" },
    { field: "delete", header: "" },
  ];
  const columnData = columns.map((column, i) => {
    return (
      <Column key={column.field} field={column.field} header={column.header} />
    );
  });

  return (
    <div className="card">
      <DataTable value={props.playersInfo} tableStyle={{ minWidth: "50rem" }}>
        {columnData}
      </DataTable>
    </div>
  );
};
export default PlayerDataTable;
