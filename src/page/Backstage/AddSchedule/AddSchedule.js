import React, { useState, useEffect } from "react";
import { BlockUI } from "primereact/blockui";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "primereact/calendar";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { PostSchedule } from "../../../API/schedule/schedule";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";

const teamInit = [
  "台北熊讚",
  "新北航源",
  "台中藍鯨",
  "高雄陽信",
  "花蓮",
  "戰神女足",
];

const AddSchedule = (props) => {
  const { authContext, submitContext, showToast } = useGlobalStore();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState([]);
  const [blocked, setBlocked] = useState();
  // const [team] = useState(teamItem);

  // 登入逾時確認 Start
  useEffect(() => {
    checkLogin(authContext, navigate);
  }, []);
  // 登入逾時確認 End

  // 列-刪除處理 Start
  const deleteRowHandler = (context) => {
    setSchedule((prevSetSchedule) => {
      let _setSchedule = JSON.parse(JSON.stringify(prevSetSchedule));
      _setSchedule.splice(context.rowIndex, 1);
      return _setSchedule;
    });
  };
  // 列-刪除處理 End

  // 追加新列處理 Start
  const addRowHandler = () => {
    setSchedule((prevSetSchedule) => {
      let _schedule = JSON.parse(JSON.stringify(prevSetSchedule));
      _schedule.push({
        id: uuidv4(),
        date: "請選擇日期",
        team1: "請選擇隊伍",
        team2: "請選擇隊伍",
        field: "請輸入場地",
      });
      return _schedule;
    });
  };
  // 追加新列處理 End

  // cell-編輯完處理 Start
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    rowData[field] = newValue;
  };
  // cell-編輯完處理 End

  // 解構『 DATE 』類型資料，組成字串 Start
  const dateConvert = (date) => {
    if (typeof date === "object") {
      let _date;
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      _date = `${year}-${month}-${day}`;
      return _date;
    } else {
      return "";
    }
  };
  // 解構『 DATE 』類型資料，組成字串 End

  // 防止選到同一個隊伍 Start
  const duplicatePreventionHandler = (options, value) => {
    if (
      options.rowData["team1"] === value ||
      options.rowData["team2"] === value
    ) {
      showToast("訊息", `『 ${value} 』隊伍重複`, 3);
      // 返回舊值
      return options.value;
    }
    // 返回新值
    return value;
  };
  // 防止選到同一個隊伍 End

  // Column渲染資料準備 Start
  const columnsData = [
    {
      id: "column1",
      field: "date",
      header: "日期",
      width: "20",
      editorCallBack: (options) => {
        return (
          <div className="w-8rem">
            <Calendar
              value={options.value}
              onChange={(e) => options.editorCallback(dateConvert(e.value))}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </div>
        );
      },
    },
    {
      id: "column2",
      field: "team1",
      header: "隊伍1",
      width: "20",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={teamInit}
            onChange={(e) =>
              options.editorCallback(
                duplicatePreventionHandler(options, e.value)
              )
            }
            placeholder="Select a opponent"
          />
        );
      },
    },
    {
      id: "column2",
      field: "team2",
      header: "隊伍2",
      width: "20",
      editorCallBack: (options) => {
        return (
          <Dropdown
            appendTo={"self"}
            value={options.value}
            options={teamInit}
            onChange={(e) =>
              options.editorCallback(
                duplicatePreventionHandler(options, e.value)
              )
            }
            placeholder="Select a opponent"
          />
        );
      },
    },
    {
      id: "column3",
      field: "field",
      header: "場地",
      width: "20",
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
    },
    {
      id: "column4",
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
        onCellEditComplete={onCellEditComplete}
      />
    );
  });
  // 渲染各行處理 End

  // 送出表單處理 Start
  const sendDataHandler = async () => {
    if (!submitContext.submitStatus) {
      if (await checkLogin(authContext, navigate)) {
        submitContext.onSetSubmitStatus(true);
        let scheduleData = {};
        scheduleData = schedule.map((item) => ({ ...item }));
        console.log({ scheduleData });
        if (scheduleData.length <= 0) {
          showToast("警告", "資料不可為空", 3);
          submitContext.onSetSubmitStatus(false);
          return false;
        }

        // 查找值為空的欄位
        for (const [index, item] of scheduleData.entries()) {
          for (const props in item) {
            if (item.hasOwnProperty.call(item, props)) {
              let status;
              if (item[props].includes("請選擇日期")) status = 1;
              else if (item[props].includes("請選擇隊伍")) status = 2;
              else if (item[props].includes("請輸入場地")) status = 3;
              switch (status) {
                case 1:
                  showToast("訊息", `第${index + 1}行，日期不可為空`, 3);
                  submitContext.onSetSubmitStatus(false);
                  return;
                case 2:
                  showToast("訊息", `第${index + 1}行，隊伍不可為空`, 3);
                  submitContext.onSetSubmitStatus(false);
                  return;
                case 3:
                  showToast("訊息", `第${index + 1}行，場地不可為空`, 3);
                  submitContext.onSetSubmitStatus(false);
                  return;
                default:
                  // 刪除不必要資料（『 ID 』只有在渲染時所需要）
                  delete item["id"];
                  break;
              }
            }
          }
        }
        console.log({ scheduleData });
        return;
        setBlocked(true);
        PostSchedule(scheduleData)
          .then((res) => {
            const { StatusCode, StatusMessage, Result } = res.data;
            if (StatusCode === 1 && StatusMessage === "Normal end.") {
              showToast("狀態提示", "賽程追加成功", 1);
              setBlocked(false);
              submitContext.onSetSubmitStatus(false);
            }
          })
          .catch((err) => {
            showToast("錯誤", `錯誤訊息：${err}`, 0);
            setBlocked(false);
            submitContext.onSetSubmitStatus(false);
          });
      }
    }
  };
  // 送出表單處理 End

  return (
    <BlockUI blocked={blocked} containerClassName="h-full">
      <div className="page-add-schedule w-full h-full absolute overflow-auto">
        <DataTable
          value={schedule}
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
      </div>
    </BlockUI>
  );
};
export default AddSchedule;
