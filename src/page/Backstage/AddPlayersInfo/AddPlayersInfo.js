import React, { useEffect, useState, useContext, Fragment } from "react";
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
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
import AuthContext from "../../../store/AuthContext";
import PhotoCropper from "../../../components/UI/PhotoCropper/PhotoCropper";
import useDropdownItem from "../../../Hook/useDropdownItem/useDropdownItem";
import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import "./AddPlayersInfo.scss";

const AddPlayerInfo = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
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
  const [cropperVisible, setCropperVisible] = useState(false);
  const [playersInfo, setPlayersInfo] = useState([]);
  const [gender] = useState(genderItem);
  const [age] = useState(ageItem);
  const [height] = useState(heightItem);
  const [weight] = useState(weightItem);
  const [team] = useState(teamItem);
  const [position] = useState(positionItem);
  const [rowIndex, setRowIndex] = useState();
  const [rowData, setRowData] = useState();
  const [bHoverOnUploadOKFlag, setHoverOnUploadOKFlag] = useState(false); //WEICHE:
  // ***

  // ***** 登入逾時確認 *****
  useEffect(() => {
    CheckLogin()
      .then((res) => {
        const { StatusCode, StatusMessage } = res.data;
        if (StatusCode && StatusMessage.includes("Normal")) {
          authCtx.onSetSignInStatus(true);
        } else {
          authCtx.onSetSignInStatus(false);
        }
      })
      .catch((err) => {
        authCtx.onSetSignInStatus(false);
        alert(err);
      });
  }, []);
  // ***

  // ***** scrollBar自動跳轉至底 *****
  useEffect(() => {
    const div = document.getElementById("dataTableContainer");
    div.scrollTop = div.scrollHeight;
  }, [playersInfo]);
  // ***

  // // ***** 畫面跳轉處理器 *****
  // const viewSwitchHandler = (viewName) => {
  //   navigate(viewName);
  // };
  // // ***

  // // ***** 裁切器顯示處理器 *****
  // const visibleHandler = (status) => {
  //   setCropperVisible(status);
  // };
  // // ***

  // ***** 裁切器顯示處理器 *****
  const imageCropperHandler = (rowIndex, rowData) => {
    setRowIndex(rowIndex);
    setRowData(rowData);
    // visibleHandler(true); //WEICHE:
    setCropperVisible(true); //WEICHE:
  };
  // ***

  // *****上傳的圖片做預覽處理*****
  const imagePreviewHandler = (imageLocalUrl, imageData) => {
    // ***** 以裁切好的圖片追加至相對應 rowData 裡 *****  //WEICHE: 因為 API 要傳送的是 Blob File，不是本地創建的地址資源 (URL.createObjectURL)
    rowData.photo = imageData; //WEICHE: 所以這邊新增一個 photoUrl 用來本地顯示
    rowData.photoUrl = imageLocalUrl; //WEICHE ADD
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo[rowIndex].photo = imageData;
      _playersInfo[rowIndex].photoUrl = imageLocalUrl; //WEICHE ADD
      return _playersInfo;
    });
  };
  // ***

  // *****列-刪除處理 *****
  const deleteRowHandler = (context) => {
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo.splice(context.rowIndex, 1);
      return _playersInfo;
    });
  };
  // ***

  // ***** 追加新列處理 *****
  const addRowHandler = () => {
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo.push({
        // id: new Date().toLocaleString(),
        id: uuidv4(),
        name: "ex:陳小明",
        photo: "", //WEICHE:這個用來儲存Blob File
        photoUrl: "", //WEICHE:這格之後再取一個專有的圖片
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

  // ***** 列-編輯完處理 *****
  // const onRowEditCompleteHandler = (e) => {
  //   setPlayersInfo((prevrPlayersInfo) => {
  //     let _playersInfo = [...prevrPlayersInfo];
  //     let { newData, index } = e;
  //     _playersInfo[index] = newData;
  //     return _playersInfo;
  //   });
  // };
  //***** 改成cell-編輯完處理 *****
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    rowData[field] = newValue;
  };
  // ***

  // ***** Column渲染資料準備 *****
  const columnsData = [
    {
      id: "column1",
      field: "photo",
      header: "Image",
      width: "10",
      // editorCallBack: (options) => {
      //   return (
      //     <div className="flex flex-column justify-content-center">
      //       <label
      //         className="mb-1 cursor-pointer bg-bluegray-600
      //                    text-blue-50 text-center"
      // onClick={() => {
      //   imageCropperHandler(options.rowIndex, options.rowData);
      // }}
      //       >
      //         編輯圖片
      //       </label>
      //       <div className="w-6rem h-6rem">
      //         <img
      //           className="w-full h-full"
      //           id="playerImage"
      //           src={playersInfo[options.rowIndex].photoUrl}
      //           alt=""
      //         />
      //       </div>
      //     </div>
      //   );
      // },
      BodyCallBack: (rowData, context) => {
        const strLocalImageUrl = playersInfo[context.rowIndex].photoUrl;
        const UploadOK = (
          <i
            className={`custom-tooltip-btn-${context.rowIndex} pi pi-check cursor-pointer`}
            style={{ fontSize: "1rem" }}
          ></i>
        );
        const UploadWaiting = (
          <i
            className={`custom-tooltip-btn-${context.rowIndex} pi pi-upload cursor-pointer`}
            style={{ fontSize: "1rem" }}
            onClick={() => {
              imageCropperHandler(context.rowIndex, rowData);
            }}
          ></i>
        );
        let IconUploadStatus = strLocalImageUrl ? UploadOK : UploadWaiting;

        return (
          // <img
          //   src={playersInfo[context.rowIndex].photoUrl}
          //   alt={rowData.name}
          //   className="w-6rem h-5rem border-round"
          // />
          <Fragment>
            <Tooltip target={`.custom-tooltip-btn-${context.rowIndex}`}>
              {strLocalImageUrl ? (
                <img
                  alt="logo"
                  src={strLocalImageUrl}
                  height="80px"
                  width="80px"
                />
              ) : (
                "尚未上傳圖片"
              )}
            </Tooltip>
            {IconUploadStatus}
          </Fragment>
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
          <div className="w-6rem">
            <InputText
              type="text"
              value={options.value}
              onChange={(e) => options.editorCallback(e.target.value)}
            />
          </div>
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.name;
      // },
    },
    {
      id: "column3",
      field: "gender",
      header: "Gender",
      width: "5",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={gender}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Gender"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.gender;
      // },
    },
    {
      id: "column4",
      field: "age",
      header: "Age",
      width: "5",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={age}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Age"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.age;
      // },
    },
    {
      id: "column5",
      field: "height",
      header: "Height",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={height}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Height"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.height;
      // },
    },
    {
      id: "column6",
      field: "weight",
      header: "Weight",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={weight}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Weight"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.weight;
      // },
    },
    {
      id: "column7",
      field: "position",
      header: "Position",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={position}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Position"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.position;
      // },
    },
    {
      id: "column8",
      field: "team",
      header: "Team",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={team}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Team"
          />
        );
      },
      // BodyCallBack: (rowData) => {
      //   return rowData.team;
      // },
    },
    {
      id: "column9",
      field: "delete",
      header: "Delete",
      width: "10",
      // editorCallBack: () => {
      //   return "";
      // },
      BodyCallBack: (rowData, context) => {
        return (
          <Button
            label={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={() => {
              deleteRowHandler(context);
            }}
          />
        );
      },
    },
  ];
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
        onCellEditComplete={onCellEditComplete} //WEICHE:
      />
    );
  });

  // ***** 送出表單處理 *****
  //TODO  待測（送出表單）
  const sendDataHandler = () => {
    if (authCtx.signInStatus === true) {
      PostPlayersInfo(playersInfo)
        .then((res) => {
          const { StatusCode, StatusMessage } = res.data;
          if (StatusCode === 1 && StatusMessage === "Normal end.") {
            navigate("playerList");
          }
        })
        .catch((err) => {
          alert(`ERROR：${err}`);
        });
    } else {
      alert("登入逾時，將回首頁");
      navigate("/");
    }
  };
  // ***

  return (
    <div
      id="dataTableContainer"
      className="card p-fluid w-full h-full absolute overflow-auto"
    >
      <DataTable
        value={playersInfo}
        // editMode="row"
        editMode="cell"
        dataKey="id"
        // onRowEditComplete={onRowEditCompleteHandler}
        tableStyle={{ minWidth: "50rem" }}
        // className="min-h-screen" //WEICHE:
      >
        {column}
        {/* <Column
          rowEditor
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        /> */}
      </DataTable>
      <div className="flex justify-content-end">
        <Button
          className="w-1 bg-bluegray-700"
          label="＋"
          onClick={addRowHandler}
        />
        <Button
          className="w-2 ml-2 bg-bluegray-700"
          label="送出表單"
          onClick={sendDataHandler}
        />
      </div>
      {/* {cropperVisible && (
        <PhotoCropper
          visible={cropperVisible}
          onSwitchVisible={visibleHandler}
          rowIndex={rowIndex}
          onGetImageBlob={imagePreviewHandler}
        />
      )} */}
      <PhotoCropper
        visible={cropperVisible}
        // onSwitchVisible={visibleHandler}
        onHide={() => setCropperVisible(false)}
        rowIndex={rowIndex}
        onGetImageBlob={imagePreviewHandler}
        header="請選擇並剪取您的相片"
      />
    </div>
  );
};
export default AddPlayerInfo;
