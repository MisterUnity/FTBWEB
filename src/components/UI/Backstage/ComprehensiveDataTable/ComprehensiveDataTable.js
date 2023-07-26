import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

const ComprehensiveDataTable = ({ comprehensiveData }) => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  let _mixedData = null;
  let _offensiveData = null;
  let _defensiveData = null;

  const dataType = [
    { name: "總數據", code: "mixedData" },
    { name: "進攻數據", code: "offensiveData" },
    { name: "防守數據", code: "defensiveData" },
  ];

  useEffect(() => {
    if (comprehensiveData !== undefined) {
      const { mixedData, offensiveData, defensiveData } = comprehensiveData;
      _mixedData = mixedData;
      _offensiveData = offensiveData;
      _defensiveData = defensiveData;
      setData(_mixedData);
    }
  }, [comprehensiveData]);

  const selectedDataHandler = (e) => {
    console.log(e);
  };

  return (
    <div className="card">
      <Dropdown
        value={selectedData}
        onChange={selectedDataHandler}
        options={dataType}
        optionLabel="name"
        placeholder="Select a City"
        className="w-full md:w-14rem"
      />
      <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
};
export default ComprehensiveDataTable;
