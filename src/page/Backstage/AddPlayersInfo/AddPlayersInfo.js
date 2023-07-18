import React, { useEffect, useState, Fragment } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { PostPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { useNavigate } from "react-router-dom";
import ShowCropper from "../../../components/UI/ShowCropper/ShowCropper";
import photo from "../../../assets/photo.svg";

import useDropdownItem from "../../../Hook/useDropdownItem/useDropdownItem";

const AddPlayerInfo = () => {
  const navigate = useNavigate();
  const [cropperVisible, setCropperVisible] = useState(false);
  // ***** 下拉式表單選項處理 *****
  const genderItem = ["男", "女", "其他"];
  const ageItem = useDropdownItem(1, 41, "歲");
  const heightItem = useDropdownItem(150, 200, "cm");
  const weightItem = useDropdownItem(50, 100, "kg");
  const positionItem = [
    "右邊鋒",
    "左邊鋒",
    "二前鋒",
    "前鋒",
    "中場",
    "右中場",
    "左中場",
    "中後衛",
    "右後衛",
    "左後衛",
    "防守型中場",
    "進攻型中場",
    "守門員",
  ];
  const teamItem = ["1隊", "2隊"];
  // ***

  // ***** 各項狀態 *****
  const [playersInfo, setPlayersInfo] = useState([]);
  const [gender] = useState(genderItem);
  const [age] = useState(ageItem);
  const [height] = useState(heightItem);
  const [weight] = useState(weightItem);
  const [team] = useState(teamItem);
  const [position] = useState(positionItem);
  const [imageURL, setImageURL] = useState();
  const [rowIndex, setrowIndex] = useState();
  const [rowData, setrowData] = useState();
  // ***

  // *****scrollBar自動跳轉至底*****
  useEffect(() => {
    const div = document.getElementById("dataTableContainer");
    div.scrollTop = div.scrollHeight;
  }, [playersInfo]);
  // ***

  // *****上傳的圖片做預覽處理*****
  const imagePreviewHandler = (imageData) => {
    // console.log(`獲取到的${imageData}`);
    const img = document.getElementById("playerImage");
    img.src = imageData;
    rowData.image = imageData;

    // *****圖片url追加至相對應rowData裡*****
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo[rowIndex].image = imageData;
      return _playersInfo;
    });
  };
  // ***
  const visibleHandler = (status) => {
    setCropperVisible(status);
  };

  const imageCropperHandler = (e, options) => {
    const imageFile = e.target.files[0];
    const imageURL = URL.createObjectURL(imageFile);
    setImageURL(imageURL);
    setrowIndex(options.rowIndex);
    setrowData(options.rowData);
    visibleHandler(true);
  };

  // ***** Column渲染資料準備 *****
  const columnsData = [
    {
      id: "column1",
      field: "image",
      header: "Image",
      width: "10",
      editorCallBack: (options) => {
        return (
          <div>
            <label className="cursor-pointer" htmlFor="image">
              選擇檔案
              <input
                id="image"
                className="hidden"
                type="file"
                onChange={(e) => {
                  imageCropperHandler(e, options);
                }}
              />
            </label>
            <img
              id="playerImage"
              src={options.value}
              className="w-6rem h-5rem border-round"
              alt="playerimage"
            />
          </div>
        );
      },
      BodyCallBack: (rowData, context) => {
        return (
          <img
            src={playersInfo[context.rowIndex].image}
            alt={rowData.name}
            className="w-6rem h-5rem  border-round"
          />
        );
      },
    },
    {
      id: "column2",
      field: "name",
      header: "Name",
      width: "10",
      editorCallBack: (options) => {
        return (
          <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.name;
      },
    },
    {
      id: "column3",
      field: "gender",
      header: "Gender",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={gender}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Gender"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.gender;
      },
    },
    {
      id: "column4",
      field: "age",
      header: "Age",
      width: "5",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={age}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Age"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.age;
      },
    },
    {
      id: "column5",
      field: "height",
      header: "Height",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={height}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Height"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.height;
      },
    },
    {
      id: "column6",
      field: "weight",
      header: "Weight",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={weight}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Weight"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.weight;
      },
    },
    {
      id: "column7",
      field: "position",
      header: "Position",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={position}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Position"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.position;
      },
    },
    {
      id: "column8",
      field: "team",
      header: "Team",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={team}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Team"
          />
        );
      },
      BodyCallBack: (rowData) => {
        return rowData.team;
      },
    },
    {
      id: "column9",
      field: "delete",
      header: "Delete",
      width: "10",
      editorCallBack: () => {
        return "";
      },
      BodyCallBack: (rowData, context) => {
        return (
          <Button
            label={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={() => {
              deleteHandler(context);
            }}
          />
        );
      },
    },
  ];
  // ***

  // *****列-刪除處理 *****
  const deleteHandler = (context) => {
    console.log(context.rowIndex);
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo.splice(context.rowIndex, 1);
      return _playersInfo;
    });
  };
  /// ***

  // ***** 追加新列處理 *****
  const addNewRowHandler = () => {
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo.push({
        // id: new Date().toLocaleString(),
        id: uuidv4(),
        name: "ex:陳小明",
        image: "https://fastly.picsum.photos/id/1/1200/600.jpg?hmac=7xDzyVlLdITHaM66cy-yrgS6i437QYFJJ1PNYcJTO3Y",
        gender: "ex:男",
        age: "ex:20",
        height: "ex:180cm",
        weight: "ex:75kg",
        position: "ex:前鋒",
        team: "ex:1隊",
        delete: "",
      });
      return _playersInfo;
    });
  };
  // ***

  // ***** 列-編輯處理 *****
  const onRowEditCompleteHandler = (e) => {
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      let { newData, index } = e;
      _playersInfo[index] = newData;
      return _playersInfo;
    });
  };
  // ***

  // ***** 渲染各行處理 *****
  const column = columnsData.map((data) => {
    return (
      <Column
        key={data.id}
        field={data.field}
        header={data.header}
        editor={data.editorCallBack}
        body={data.BodyCallBack}
      />
    );
  });

  // ***** 送出表單處理 *****
  const sendDataHandler = () => {
    PostPlayersInfo(playersInfo);
    console
      .log(playersInfo)
      .then((res) => {
        if (
          res.data.StatusCode === 1 &&
          res.data.StatusMessage === "Normal end."
        ) {
          navigate("playerList");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  // ***

  return (
    <div
      id="dataTableContainer"
      className="card p-fluid w-full h-full absolute overflow-auto"
    >
      <DataTable
        key="id"
        value={playersInfo}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditCompleteHandler}
        tableStyle={{ minWidth: "50rem" }}
      >
        {column}
        <Column
          rowEditor
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
      </DataTable>
      <div className="flex justify-content-end">
        <Button
          className="w-2 bg-bluegray-700"
          label="＋"
          icon="pi pi-plus"
          onClick={addNewRowHandler}
        />
        <Button
          className="w-2 ml-2 bg-bluegray-700"
          label="送出表單"
          icon="pi pi-plus"
          onClick={sendDataHandler}
        />
      </div>
      {cropperVisible && (
        <ShowCropper
          visible={cropperVisible}
          onSwichVisible={visibleHandler}
          rowIndex={rowIndex}
          imageURL={imageURL}
          onGetImageBlob={imagePreviewHandler}
        />
      )}
    </div>
  );
};
export default AddPlayerInfo;
