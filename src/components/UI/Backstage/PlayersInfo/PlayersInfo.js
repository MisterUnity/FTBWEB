import React, { useState, useMemo, useEffect, Fragment } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faXmark,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { InputTextarea } from "primereact/inputtextarea";
import { PutPlayerPersonalInfo } from "../../../../API/playerInfo/playerInfo";
import { useGlobalStore } from "../../../../store/GlobalContextProvider";
import { DeletePlayerInfo } from "../../../../API/playerInfo/playerInfo";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PhotoCropper from "../../../Functions/PhotoCropper/PhotoCropper";
import useDropdownItem from "../../../../Hook/useDropdownItem/useDropdownItem";
import "./PlayersInfo.scss";
const PlayersInfo = React.memo(
  ({
    className,
    Logo,
    playerDetailedInfo,
    onDisabled,
    onLocalUpdate,
    onDelete,
  }) => {
    const { showToast, submitContext, errorHandler } = useGlobalStore();

    // 項目狀態 Start
    const [playerInfo, setPlayerInfo] = useState({});
    const [editModel, setEditModel] = useState(false);
    const [cropperVisible, setCropperVisible] = useState(false);
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState({ localUrl: "", blob: "" });
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [position, setPosition] = useState("");
    const [team, setTeam] = useState("");
    const [description, setDescription] = useState("");
    const [sb, setSb] = useState(false);
    // 項目狀態 End
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

    // 個人資訊欄渲染用資料 Start
    const renderData = [
      [
        {
          id: "position",
          header: "位置",
          placeholder: playerInfo["Position"],
          readingMode: playerInfo["Position"],
          editMode: {
            type: "dropdown",
            dropdownItem: positionItem,
            value: position,
            callBack: (newValue) => setPosition(newValue),
          },
        },
        {
          id: "height",
          header: "身高",
          placeholder: playerInfo["Height"],
          readingMode: playerInfo["Height"],
          editMode: {
            type: "dropdown",
            dropdownItem: heightItem,
            value: height,
            callBack: (newValue) => setHeight(newValue),
          },
        },
      ],
      [
        {
          id: "weight",
          header: "體重",
          placeholder: playerInfo["Weight"],
          readingMode: playerInfo["Weight"],
          editMode: {
            type: "dropdown",
            dropdownItem: weightItem,
            value: weight,
            callBack: (newValue) => setWeight(newValue),
          },
        },
        {
          id: "age",
          header: "年齡",
          placeholder: playerInfo["Age"],
          readingMode: playerInfo["Age"],
          editMode: {
            type: "dropdown",
            dropdownItem: ageItem,
            value: age,
            callBack: (newValue) => setAge(newValue),
          },
        },
      ],
      [
        {
          id: "gender",
          header: "性別",
          placeholder: playerInfo["Gender"],
          readingMode: playerInfo["Gender"],
          editMode: {
            type: "dropdown",
            dropdownItem: genderItem,
            value: gender,
            callBack: (newValue) => setGender(newValue),
          },
        },
        {
          id: "team",
          header: "隊伍",
          placeholder: playerInfo["Team"],
          readingMode: playerInfo["Team"],
          editMode: {
            type: "dropdown",
            dropdownItem: teamItem,
            value: team,
            callBack: (newValue) => setTeam(newValue),
          },
        },
      ],
      [
        {
          id: "description",
          header: "概述",
          placeholder: playerInfo["Description"],
          readingMode: playerInfo["Description"],
          editMode: {
            type: "text",
            value: description,
            callBack: (newValue) => setDescription(newValue),
          },
        },
      ],
    ];
    // 個人資訊欄渲染用資料 End

    // 資料重置處理 Start
    const dataRest = () => {
      setPhoto("");
      setName("");
      setAge("");
      setGender("");
      setHeight("");
      setWeight("");
      setPosition("");
      setTeam("");
      setDescription("");
    };
    // 資料重置處理 End

    // 取得剪裁好的圖像檔 Start
    const imagePreviewHandler = (imageLocalUrl, imageData) => {
      setPhoto({ localUrl: imageLocalUrl, blob: imageData });
    };
    // 取得剪裁好的圖像檔 End
    // 更新來源資料 Start
    useEffect(() => {
      setPlayerInfo(playerDetailedInfo);
    }, [playerDetailedInfo]);
    // 更新來源資料 End
    // 『進入編輯模式』or『刪除球員資料』處理器  Start
    const standardModeHandler = (standardStatus) => {
      if (standardStatus === "enterEdit") {
        onDisabled();
        setEditModel(true);
      } else {
        if (!submitContext.submitStatus) {
          const accept = () => {
            submitContext.onSetSubmitStatus(true);
            DeletePlayerInfo(playerInfo["ID"])
              .then((res) => {
                const { StatusCode, StatusMessage, Result } = res.data;
                if (StatusCode && StatusMessage.includes("Normal end.")) {
                  showToast("success", "資料刪除成功", 1);
                  onDelete(playerInfo["ID"]);
                  submitContext.onSetSubmitStatus(false);
                }
              })
              .catch((err) => {
                errorHandler(err);
                submitContext.onSetSubmitStatus(false);
              });
          };
          const reject = () => {
            return;
          };
          confirmDialog({
            message: "您確定刪除此球員資料嗎？",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
          });
        }
      }
    };
    // 『進入編輯模式』or『刪除球員資料』處理器  End

    // 編輯『完成』or『取消』處理器  Start
    const editModeHandler = async (editStatus) => {
      if (editStatus === "editCompleted") {
        if (!submitContext.submitStatus) {
          submitContext.onSetSubmitStatus(true);
          // 確認輸入字串值是否為空值，如果是的話就返回未更改前的值
          const strEmptyCheck = (value, propName) => {
            return value
              ? value.trim()
                ? value
                : playerInfo[propName]
              : playerInfo[propName];
          };
          console.log("age", strEmptyCheck(age, "Age"));
          let sendName = strEmptyCheck(name, "Name");
          console.log({ sendName });
          // 組件 『 Form-Data』類型資料
          const ID = playerInfo["ID"];

          let photoResource = null;

          // const blob = new Blob([playerInfo.Photo], { type: "image/jpeg" });

          if (!photo.blob) {
            await fetch(playerInfo.Photo, {
              mode: "cors",
              method: "GET",
              headers: {
                "Content-type": "image/jpeg",
              },
            })
              .then((res) => res.blob())
              .then((blob) => (photoResource = blob));
          } else {
            photoResource = photo.blob;
          }
          const formData = new FormData();
          formData.append("photo", photoResource, sendName);
          formData.append("id", ID);
          formData.append("name", sendName);
          formData.append(
            "gender",
            strEmptyCheck(gender, "Gender") === "男" ? "M" : "F"
          );
          formData.append("height", strEmptyCheck(height, "Height"));
          formData.append("weight", strEmptyCheck(weight, "Weight"));
          formData.append("position", strEmptyCheck(position, "Position"));
          // formData.append("photo", blob);
          //TODO 隊伍更改右側清單還是原隊伍
          console.log("photo.blob", photo.blob);
          console.log({ sendName });
          // formData.append("photo", photo.blob, sendName);
          formData.append("age", strEmptyCheck(age, "Age"));
          console.log({ team });

          formData.append("team", strEmptyCheck(team, "Team"));

          formData.append(
            "description",
            strEmptyCheck(description, "Description")
          );

          const putResult = await PutPlayerPersonalInfo(ID, formData)
            .then((res) => {
              const { StatusCode, StatusMessage, Result } = res.data;
              if (StatusCode && StatusMessage.includes("Normal end.")) {
                showToast("success", "資料更新成功", 1);
                return true;
              }
            })
            .catch((err) => {
              errorHandler(err);
              submitContext.onSetSubmitStatus(false);
              return false;
            });
          // 更新失敗時，跳出不繼續執行。
          if (!putResult) {
            submitContext.onSetSubmitStatus(false);
            return false;
          }
          console.log(playerInfo);
          onLocalUpdate(ID, strEmptyCheck(team, "Team"));
          onDisabled();
          dataRest();
          setEditModel(false);
          submitContext.onSetSubmitStatus(false);
        }
      } else {
        dataRest();
        onDisabled();
        setEditModel(false);
      }
    };
    // 編輯『完成』or『取消』處理器  End

    // 按鈕類型處理器 Start
    const btnTypeHandler = () => {
      if (editModel) {
        const EditModeBtn = [
          { id: "btnCompleted", icon: faCheck, editStatus: "editCompleted" },
          { id: "btnCancel", icon: faXmark, editStatus: "cancelEdit" },
        ];
        return EditModeBtn.map((btnIcon) => {
          return (
            <Button
              className="mx-1 border-none bg-pink-50"
              key={btnIcon.id}
              disabled={submitContext.submitStatus}
              onClick={editModeHandler.bind(null, btnIcon.editStatus)}
              label={
                <FontAwesomeIcon
                  icon={btnIcon.icon}
                  size="xl"
                  style={{ color: "#000000" }}
                />
              }
            />
          );
        });
      } else {
        const standardModeBtn = [
          { id: "btnEnterEdit", icon: faPenToSquare, editStatus: "enterEdit" },
          { id: "btnDelete", icon: faTrashCan, editStatus: "deleteData" },
        ];
        return standardModeBtn.map((btnIcon) => {
          return (
            <Button
              className="mx-1 border-none bg-pink-50"
              key={btnIcon.id}
              disabled={submitContext.submitStatus}
              onClick={standardModeHandler.bind(null, btnIcon.editStatus)}
              label={
                <FontAwesomeIcon
                  icon={btnIcon.icon}
                  size="xl"
                  style={{ color: "#000000" }}
                />
              }
            />
          );
        });
      }
    };
    // 按鈕類型處理器 End

    // 姓名欄處理器 Start
    const nameElementHandler = useMemo(() => {
      return editModel ? (
        <InputText
          id="playerName"
          value={name}
          placeholder={playerInfo["Name"]}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        playerInfo["Name"]
      );
    }, [name, editModel, playerInfo]);
    // 姓名欄處理器 End

    // 相片欄處理器 Start
    const photoElementHandler = () => {
      return (
        <img
          className={`w-full h-full ${editModel ? "cursor-pointer" : ""}`}
          src={
            editModel
              ? photo.localUrl
                ? photo.localUrl
                : playerInfo["Photo"]
              : playerInfo["Photo"]
          }
          alt="選手照片"
          onClick={editModel ? () => setCropperVisible(true) : () => {}}
        />
      );
    };
    // 相片欄處理器 End

    // 資料渲染處理 Start
    const renderHandler = () => {
      return renderData.map((arr) => {
        return (
          <div key={uuidv4()} className="info-block2-playerInfo">
            {arr.map((obj) => {
              return (
                <div key={uuidv4()} className="container">
                  <div
                    className={
                      editModel ? "text-yellow-500" : "text-yellow-500 m-2"
                    }
                  >
                    {obj.header}
                  </div>
                  <div>
                    {editModel ? (
                      <Fragment>
                        {obj.editMode.type === "dropdown" ? (
                          <Dropdown
                            className="w-full h-full"
                            placeholder={obj.placeholder}
                            options={obj.editMode.dropdownItem}
                            value={obj.editMode.value}
                            onChange={(e) => {
                              obj.editMode.callBack(e.target.value);
                            }}
                          />
                        ) : (
                          <InputTextarea
                            value={obj.editMode.value}
                            onChange={(e) =>
                              obj.editMode.callBack(e.target.value)
                            }
                            rows={2}
                            cols={30}
                          />
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>{obj.readingMode}</Fragment>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    };
    // 資料渲染處理 End
    return (
      <div className="playersInfo ">
        <div className="info-block1 grid grid-nogutter ">
          <div className="info-block1-main1 col-6 ">
            <div className="info-block1-img">{photoElementHandler()}</div>
            <div className="info-block1-name">{nameElementHandler}</div>
          </div>
          <div className="info-block1-main2 col-6 ">
            <div className="info-block2-logo">
              <img className="logo" src={Logo} alt="隊徽" />
            </div>
          </div>
        </div>
        <div className="info-block2 grid grid-nogutter">
          {renderHandler()}
          <div className="info-block2-edit"></div>
          <div className="">{btnTypeHandler()}</div>
        </div>
        <PhotoCropper
          visible={cropperVisible}
          onHide={() => setCropperVisible(false)}
          onGetImageBlob={imagePreviewHandler}
          header="請選擇並剪取您的相片"
        />
        <ConfirmDialog />
      </div>
    );
  }
);
export default PlayersInfo;
