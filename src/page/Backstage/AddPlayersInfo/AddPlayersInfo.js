import { useEffect, useState, Fragment, useRef } from "react";
import { BlockUI } from "primereact/blockui";
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
import { Tooltip } from "primereact/tooltip";
import { ProgressSpinner } from "primereact/progressspinner";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import PhotoCropper from "@/components/Functions/PhotoCropper/PhotoCropper";
import useDropdownItem from "../../../Hook/useDropdownItem/useDropdownItem";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import "primeicons/primeicons.css";

const AddPlayerInfo = () => {
  const navigate = useNavigate();
  const { authContext, submitContext, showToast, errorHandler } =
    useGlobalStore();
  // 下拉式表單選項處理 Start
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
  const teamItem = [
    "台北熊讚",
    "新北航源",
    "台中藍鯨",
    "高雄陽信",
    "花蓮",
    "戰神女足",
  ];
  // 下拉式表單選項處理 End

  // 項目狀態 Start
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
  const [blocked, setBlocked] = useState(false);
  // 項目狀態 End

  // 登入逾時確認 Start
  useEffect(() => {
    checkLogin(authContext, navigate);
  }, []);
  // 登入逾時確認 End

  // scrollBar自動跳轉至底 Start
  useEffect(() => {
    const div = document.getElementById("dataTableContainer");
    div.scrollTop = div.scrollHeight;
  }, [playersInfo]);
  // scrollBar自動跳轉至底 End

  // 裁切器顯示處理器 Start
  const imageCropperHandler = (rowIndex, rowData) => {
    setRowIndex(rowIndex);
    setRowData(rowData);
    setCropperVisible(true);
  };
  // 裁切器顯示處理器 End

  //上傳的圖片做預覽處理 Start
  const imagePreviewHandler = (imageLocalUrl, imageData) => {
    // ***** 以裁切好的圖片追加至相對應 rowData 裡 *****
    //WEICHE: 因為 API 要傳送的是 Blob File，不是本地創建的地址資源 (URL.createObjectURL)
    rowData.photo = imageData; //WEICHE: 所以這邊新增一個 photoUrl 用來本地顯示
    rowData.photoUrl = imageLocalUrl; //WEICHE ADD
    setPlayersInfo((prevPlayersInfo) => {
      let _playersInfo = [...prevPlayersInfo];
      _playersInfo[rowIndex].photo = imageData;
      _playersInfo[rowIndex].photoUrl = imageLocalUrl; //WEICHE ADD
      return _playersInfo;
    });
  };
  // 上傳的圖片做預覽處理 End

  // 列-刪除處理 Start
  const deleteRowHandler = (context) => {
    setPlayersInfo((prevPlayersInfo) => {
      let _playersInfo = JSON.parse(JSON.stringify(prevPlayersInfo));
      _playersInfo.splice(context.rowIndex, 1);
      return _playersInfo;
    });
  };
  // 列-刪除處理 End

  // 追加新列處理 Start
  const addRowHandler = () => {
    setPlayersInfo((prevPlayersInfo) => {
      let _playersInfo = JSON.parse(JSON.stringify(prevPlayersInfo));
      _playersInfo.push({
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
        // delete: "",
        // description: "備註" => 目前使用不到
      });
      return _playersInfo;
    });
  };
  // 追加新列處理 End

  // Column渲染資料準備 Start
  const columnsData = [
    {
      id: "column1",
      field: "photo",
      header: "照片",
      width: "10",

      BodyCallBack: (rowData, context) => {
        const strLocalImageUrl = playersInfo[context.rowIndex].photoUrl;
        const UploadOK = (
          <i
            className={`custom-tooltip-btn-${context.rowIndex} pi pi-check cursor-pointer`}
            style={{ fontSize: "1rem" }}
            onClick={() => {
              imageCropperHandler(context.rowIndex, rowData);
            }}
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
          <Fragment>
            <Tooltip
              target={`.custom-tooltip-btn-${context.rowIndex}`}
              autoHide={false}
            >
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
      header: "姓名",
      width: "10",
      editorCallBack: (options) => {
        return (
          <div className="w-6rem">
            <InputText
              type="text"
              value={options.value}
              onChange={(e) => {
                playersInfo[options.rowIndex][options.field] = e.target.value;
                return options.editorCallback(e.target.value);
              }}
            />
          </div>
        );
      },
    },
    {
      id: "column3",
      field: "gender",
      header: "性別",
      width: "5",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={gender}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Gender"
          />
        );
      },
    },
    {
      id: "column4",
      field: "age",
      header: "年齡",
      width: "5",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={age}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Age"
          />
        );
      },
    },
    {
      id: "column5",
      field: "height",
      header: "身高",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={height}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Height"
          />
        );
      },
    },
    {
      id: "column6",
      field: "weight",
      header: "體重",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={weight}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Weight"
          />
        );
      },
    },
    {
      id: "column7",
      field: "position",
      header: "目前位子",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={position}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Position"
          />
        );
      },
    },
    {
      id: "column8",
      field: "team",
      header: "隊伍",
      width: "10",
      editorCallBack: (options) => {
        return (
          <Dropdown
            value={options.value}
            options={team}
            onChange={(e) => {
              playersInfo[options.rowIndex][options.field] = e.value;
              return options.editorCallback(e.value);
            }}
            placeholder="Select a Team"
          />
        );
      },
    },
    // {
    //   這組目前用不到
    //   id: "column9",
    //   field: "description",
    //   header: "備註事項",
    //   width: "10",
    //   editorCallBack: (options) => {
    //     return (
    //       <div className="w-6rem">
    //         <InputText
    //           type="text"
    //           value={options.value}
    //           onChange={(e) => {
    //   playersInfo[options.rowIndex][options.field] = e.target.value;
    //   return options.editorCallback(e.target.value);
    // }}
    //         />
    //       </div>
    //     );
    //   },
    // },
    {
      id: "column10",
      field: "delete",
      header: "",
      width: "5",

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
  // Column渲染資料準備 End

  // 渲染各行處理 Start
  const columnRenderHandler = columnsData.map((data) => {
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
  // 渲染各行處理 End

  // 送出表單處理 Start
  const sendDataHandler = async () => {
    if (!submitContext.submitStatus) {
      if (await checkLogin(authContext, navigate)) {
        submitContext.onSetSubmitStatus(true);
        const playersData = playersInfo.map((item) => ({ ...item }));

        // 確認資料不為空
        if (playersData.length <= 0) {
          showToast("警告", "資料不可為空", 3);
          submitContext.onSetSubmitStatus(false);
          return false;
        }
        // 查找空欄位的部分
        for (const [index, item] of playersData.entries()) {
          for (const props in item) {
            if (item.hasOwnProperty.call(item, props)) {
              console.log(item[props]);
              if (props === "photo" && item[props] === "") {
                showToast(
                  "訊息",
                  `第${index + 1}行，的『 ${props} 』值不可為空`,
                  3
                );
                submitContext.onSetSubmitStatus(false);
                return;
              }
              // 『 photo 』為blob類型，無法使用『 includes 』方法所以要先判斷類型。
              else if (
                typeof item[props] === "string" &&
                item[props].includes("ex")
              ) {
                showToast(
                  "訊息",
                  `第${index + 1}行，的『 ${props} 』值不可為空`,
                  3
                );
                submitContext.onSetSubmitStatus(false);
                return;
              }
            }
          }
        }
        setBlocked(true);
        PostPlayersInfo(playersInfo)
          .then((res) => {
            setBlocked(false);
            const { StatusCode, StatusMessage, Result } = res.data;
            if (StatusCode === 1 && StatusMessage === "Normal end.") {
              showToast(
                "狀態提示",
                "資料追加成功，3秒後將切換至選手清單頁面",
                1
              );
              setTimeout(() => {
                submitContext.onSetSubmitStatus(false);
                navigate("/backstage/playerList");
              }, 3000);
            } else {
              Result.forEach((msg) => {
                showToast(`Name: ${msg.name}`, msg.statusMsg, msg.status);
              });
              submitContext.onSetSubmitStatus(false);
            }
          })
          .catch((err) => {
            errorHandler(err);
            setBlocked(false);
            submitContext.onSetSubmitStatus(false);
          });
      }
    }
  };
  // 送出表單處理 End

  return (
    <BlockUI blocked={blocked} containerClassName="h-full">
      <div
        id="dataTableContainer"
        className="page-add-player card p-fluid w-full h-full absolute overflow-auto "
      >
        <DataTable
          value={playersInfo}
          editMode="cell"
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          {columnRenderHandler}
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
            disabled={submitContext.submitStatus}
            onClick={sendDataHandler}
          />
        </div>
        <PhotoCropper
          visible={cropperVisible}
          onHide={() => setCropperVisible(false)}
          rowIndex={rowIndex}
          onGetImageBlob={imagePreviewHandler}
          header="請選擇並剪取您的相片"
        />
        {blocked ? (
          <ProgressSpinner
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        ) : (
          <></>
        )}
      </div>
    </BlockUI>
  );
};
export default AddPlayerInfo;
