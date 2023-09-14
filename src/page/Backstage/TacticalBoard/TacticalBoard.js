import React, {
  Fragment,
  useEffect,
  useState,
  // useContext,
  useRef,
} from "react";
import { faShirt } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { ListBox } from "primereact/listbox";
import { GetPlayersInfo } from "@/API/playerInfo/playerInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import Draggable from "react-draggable";
import "./style.scss";
import background from "../../../assets/tactical_board.png";
// 設定『 球員站位 』的 Flag
let bSetPositionFlag = false;

// 下拉選單：『 固定陣形 』的選單項目。
const fixedFormationItem = [
  "4-3-3",
  "4-4-2",
  "5-3-2",
  "3-5-2",
  "4-2-3-1",
  "4-5-1",
  "3-5-1",
];
// 下拉選單：『 自定陣形 』的選單項目。（從 『 LocalStorage 』裡獲取。）
const customFormationItem = [];

// 下拉選單：『 固定陣形 』的陣形位子數據。
const fixedFormationPosition = {
  "4-3-3": [
    { left: 0, top: 49 },
    { left: 21, top: 49 },
    { left: 30, top: 78 },
    { left: 31, top: 16 },
    { left: 56, top: 79 },
    { left: 54, top: 17 },
    { left: 67, top: 48 },
    { left: 79, top: 86 },
    { left: 78, top: 6 },
    { left: 87, top: 67 },
    { left: 86, top: 24 },
  ],
  "4-4-2": [
    { left: 0, top: 45 },
    { left: 33, top: 59 },
    { left: 31, top: 28 },
    { left: 50, top: 86 },
    { left: 60, top: 56 },
    { left: 59, top: 27 },
    { left: 47, top: 3 },
    { left: 80, top: 87 },
    { left: 76, top: 4 },
    { left: 84, top: 57 },
    { left: 84, top: 27 },
  ],
  "5-3-2": [
    { left: 0, top: 45 },
    { left: 30, top: 64 },
    { left: 29, top: 29 },
    { left: 49, top: 77 },
    { left: 47, top: 16 },
    { left: 57, top: 44 },
    { left: 75, top: 84 },
    { left: 70, top: 5 },
    { left: 81, top: 65 },
    { left: 79, top: 25 },
    { left: 87, top: 44 },
  ],
  "3-5-2": [
    { left: 0, top: 48 },
    { left: 27, top: 77 },
    { left: 25, top: 16 },
    { left: 43, top: 85 },
    { left: 53, top: 71 },
    { left: 39, top: 6 },
    { left: 52, top: 19 },
    { left: 59, top: 47 },
    { left: 76, top: 64 },
    { left: 75, top: 27 },
    { left: 86, top: 47 },
  ],
  "4-2-3-1": [
    { left: 0, top: 49 },
    { left: 17, top: 49 },
    { left: 32, top: 89 },
    { left: 31, top: 4 },
    { left: 43, top: 49 },
    { left: 58, top: 80 },
    { left: 56, top: 15 },
    { left: 74, top: 89 },
    { left: 70, top: 4 },
    { left: 83, top: 70 },
    { left: 82, top: 24 },
  ],
  "4-5-1": [
    { left: 0, top: 45 },
    { left: 16, top: 45 },
    { left: 29, top: 82 },
    { left: 27, top: 7 },
    { left: 42, top: 45 },
    { left: 55, top: 73 },
    { left: 53, top: 19 },
    { left: 69, top: 83 },
    { left: 66, top: 8 },
    { left: 80, top: 64 },
    { left: 80, top: 25 },
  ],
  "3-5-1": [
    { left: 0, top: 46 },
    { left: 19, top: 47 },
    { left: 47, top: 81 },
    { left: 34, top: 69 },
    { left: 31, top: 22 },
    { left: 44, top: 7 },
    { left: 61, top: 69 },
    { left: 59, top: 23 },
    { left: 77, top: 71 },
    { left: 75, top: 20 },
    { left: 87, top: 46 },
  ],
};

// 『 ListBox 』裡所需要顯示的『 所有隊伍的球員清單 』
const ayPlayerList = [];

// 給『 box 』元素用的 className
const YellowBorderClassName = "yellow-bdr";

const TacticalBoard = () => {
  const [formationType, setFormationType] = useState("4-3-3");
  const [customFormationType, setCustomFormationType] = useState("");
  const [formation, setFormation] = useState(null);
  const [customPositionData, setCustomPositionData] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [isCustom, setIsCustom] = useState(false);
  const [fatherContainerInfo, setFatherContainerInfo] = useState(null);
  const [currentType, setCurrentType] = useState(1); // 1 = 固定陣形，0 = 自定義陣形
  const [boxStyle, setBoxStyle] = useState(null);
  const [positionLabel, setPositionLabel] = useState("設定球員站位");
  const [labelPosition, setLabelPosition] = useState({});

  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { authContext, showToast, errorHandler } = useGlobalStore();
  const navigate = useNavigate();

  const ref = { ref: useRef(null) };
  const divRefs = []; // 陣形站位用
  const namesRef = []; // 球員名站位用
  /* 創建11組帶有『 useRef 』的陣列。
     因『 useRef 』無法直接放在Push方法裡面，所以用物件形式來包裝，在加至陣列裡 */
  for (let i = 0; i < 11; i++) {
    const _ref = JSON.parse(JSON.stringify(ref));
    divRefs.push(_ref);
    namesRef.push(_ref);
  }

  // 初始處理 Start
  const intiHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      const res = await GetPlayersInfo() // 取得所有隊伍的球員清單
        .then((res) => {
          const { Result } = res.data;
          Result.forEach((ele) => {
            ayPlayerList.push({
              name: ele.Name,
            });
          });
          return true;
        })
        .catch((err) => {
          errorHandler(err);
          return false;
        });

      if (!res) return false;

      handleResize(); // 取得目前父元素視窗大小

      // - - - 初始化時，優先顯示固定陣形的第一筆數據。 - - -
      // 單位轉換『 百分比 』to 『 px 』
      const firstData = pctConvertPx(fixedFormationPosition[formationType]);
      // 陣形渲染處理
      const firstRenderData = formationRenderHandler(firstData);
      // 設置陣形
      setFormation(firstRenderData);

      // - - - 從『 LocalStorage 』獲取球員名站位數據。 - - -
      const _labelPosition = localStorage.getItem("labelPosition");
      if (_labelPosition) {
        setLabelPosition(JSON.parse(_labelPosition));
      } else {
        console.log("無球員名站位數據");
      }

      // 從『 Local Storage 』獲取自訂義陣型數據。
      const customFormation = localStorage.getItem("customFormation");
      if (customFormation) {
        // 數據解析
        const customData = JSON.parse(customFormation);

        // 『 自定義陣形 』的下拉選單項目初始化。
        customFormationItem.length = 0;

        // 追加『 自定義陣形 』下拉選單項目。
        for (const props in customData) {
          if (customData.hasOwnProperty.call(customData, props)) {
            customFormationItem.push(props);
          }
        }
        // 設置從『 LocalStorage 』裡取得的所有自定義陣形位子數據。
        setCustomPositionData(customData);
      } else {
        console.log("無自定義陣型數據");
      }
      // 添加視窗事件监听
      window.addEventListener("resize", handleResize);

      // 在组件卸载时移除事件监听
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  };
  useEffect(() => {
    intiHandler();
  }, []);
  // 初始處理 End

  // 單位轉換 『 百分比 』轉換成『 px 』並返回一個陣列 Start
  const pctConvertPx = (objectArray) => {
    // 渲染時差因素，導致父元素容器還未被渲染出來，所以最初 『 fatherContainerInfo 』會為空。
    const contSizeInfo = fatherContainerInfo
      ? fatherContainerInfo
      : containerRef.current.getBoundingClientRect();

    // 把數據單位從『 百分比 』轉換成『 px 』
    const arrElemsPosition = [];
    objectArray.forEach((object, index) => {
      arrElemsPosition.push({
        left: Math.round((object["left"] / 100) * contSizeInfo.width),
        top: Math.round((object["top"] / 100) * contSizeInfo.height),
        nameRef: namesRef[index], // 球員名站位用。
        labelPosition: object["left"], // 依據這筆資料來判斷，球員名站位的位子。
      });
    });
    // 返回一個新『 objectArray 』陣列類型數據。
    return arrElemsPosition;
  };
  // 單位轉換 『 百分比 』轉換成『 px 』 並返回一個陣列 End

  // 設置球員姓名站位。 Start
  function SetName(index, name, position) {
    // 姓名站位重複確認
    let bDupConfResult = false;
    namesRef.forEach((object) => {
      if (object["ref"]["current"]["innerText"] === name) {
        showToast("訊息", `${name}已被選取。`, 3);
        bDupConfResult = true;
      }
    });

    if (!bDupConfResult) {
      // 設置站位球員姓名。
      namesRef[index]["ref"].current.innerText = name;
      // 設置各陣形，各站位的球員名數據
      setLabelPosition((prevLabelPosition) => {
        const _labelPosition = JSON.parse(JSON.stringify(prevLabelPosition));

        // 確認目前所顯示的陣形是『 固定 or 自定義 』，並返回相對應的陣形名稱。
        const currentFormationType =
          currentType === 1 ? formationType : customFormationType;

        // 確認是否有此陣形的站位名數據。
        if (_labelPosition[currentFormationType]) {
          // 確認此陣形數據裡是否已有儲存，此球員名站位的位子數據。
          const objResult = _labelPosition[currentFormationType].find(
            (object) => object["labelPosition"] === position
          );
          if (objResult) {
            // 覆蓋之前的球員名
            objResult["name"] = name;
          } else {
            // 在此陣形數據裡，新增一筆球員站位數據資料。
            _labelPosition[currentFormationType].push({
              name: name,
              labelPosition: position,
            });
          }
        } else {
          // 新增一筆新的陣形站位數據，內包含球員名站位數據。
          _labelPosition[currentFormationType] = [
            { name: name, labelPosition: position },
          ];
        }
        return _labelPosition;
      });
    }
  }
  // 設置站位的球員姓名。 End

  // 設置『 設定球員佔位 』and 『 儲存球員站位 』模式時的組件樣式。
  function SetCircleStyle() {
    if (!bSetPositionFlag) {
      bSetPositionFlag = true;
      setBoxStyle(YellowBorderClassName);
      setPositionLabel("儲存球員站位");
    } else {
      bSetPositionFlag = false;
      setBoxStyle("");
      setPositionLabel("設定球員佔位");
      // 儲存各陣形的球員站位數據資料。
      localStorage.setItem("labelPosition", JSON.stringify(labelPosition));
    }
  }

  // 獲取站位球員名 Start
  const getLabelNameHandler = (_labelPosition) => {
    // 確認目前所顯示的陣形是『 固定 or 自定義 』，並返回相對應的陣形名稱。
    const _currentType =
      currentType === 1 ? formationType : customFormationType;

    // 確認是否有此陣形的站位名數據。
    if (labelPosition[_currentType]) {
      // 確認此陣形數據裡是否已有儲存，此球員名站位的位子數據。
      const objResult = labelPosition[_currentType].find(
        (object) => object["labelPosition"] === _labelPosition
      );
      // 有數據的話，返回站位的球員姓名，不然返回提示字串
      return objResult ? objResult["name"] : "名字放這裡";
    } else {
      return "名字放這裡";
    }
  };
  // 獲取站位球員名 End

  // 陣形渲染處理 Start
  const formationRenderHandler = (objectArray) => {
    return objectArray.map((object, index) => {
      const uuidForDrag = uuidv4();
      return (
        <Fragment key={uuidv4()}>
          <div
            key={uuidForDrag}
            className={`box--static row-${index} ${boxStyle}`}
            style={{
              position: "absolute",
              left: object["left"] + "px",
              top: object["top"] + "px",
            }}
          >
            <FontAwesomeIcon
              icon={faShirt}
              size="xl"
              style={{ color: "#ffffff" }}
            />
            <div ref={object["nameRef"]["ref"]} className={"box--playerName"}>
              {getLabelNameHandler(objectArray[index]["labelPosition"])}
            </div>
          </div>
          {bSetPositionFlag ? (
            <Tooltip target={`.row-${index}`} autoHide={false}>
              <ListBox
                filter
                onChange={(e) =>
                  SetName(
                    index,
                    e.value.name,
                    objectArray[index]["labelPosition"]
                  )
                }
                options={ayPlayerList}
                optionLabel="name"
                className="w-full md:w-14rem"
                virtualScrollerOptions={{ itemSize: 30 }}
                listStyle={{ height: "250px" }}
              />
            </Tooltip>
          ) : (
            <></>
          )}
        </Fragment>
      );
    });
  };
  // 陣形渲染處理 End

  // 取得父元素視窗大小 Start
  const handleResize = () => {
    const containerInfo = containerRef.current.getBoundingClientRect();
    setFatherContainerInfo(containerInfo);
  };
  // 取得父元素視窗大小 End

  // 獲取待渲染數據 Start
  const getRenderData = () => {
    // 1 = 固定陣形，0 = 自定義陣形
    let renderData;
    // 根據目前顯示的陣形『 固定 or 自定義』返回已單位轉換完的數據。
    if (currentType === 1) {
      renderData = pctConvertPx(fixedFormationPosition[formationType]);
    } else {
      renderData = pctConvertPx(customPositionData[customFormationType]);
    }
    return renderData;
  };
  // 獲取待渲染數據 End

  // 父元素的視窗大小變動後所做處理 Start
  useEffect(() => {
    const data = getRenderData(); // 獲取待渲染數據
    const renderedData = formationRenderHandler(data); // 渲染處理
    setFormation(renderedData); // 重新設置陣形
  }, [fatherContainerInfo]);
  // 父元素的視窗大小變動後所做處理 End

  // 固定陣形變換後重新渲染 Start
  useEffect(() => {
    const data = getRenderData(); // 獲取待渲染數據
    const renderedData = formationRenderHandler(data); // 渲染處理
    setFormation(renderedData); // 設置陣形
  }, [formationType, customFormationType, currentType, boxStyle]);
  // 陣形變換後重新渲染 End

  // 取得陣形站位元素在父容器的相對位子 Start
  const getElemsPosition = (index) => {
    const elementInfo = divRefs[index]["ref"].current.getBoundingClientRect();

    // 取得元素在父容器的相對位子，並把單位『 px 』轉換成『 百分比 』
    const objElemsPositionData = {
      left: Math.round(
        ((elementInfo.left - fatherContainerInfo.left) /
          fatherContainerInfo.width) *
          100
      ),
      top: Math.round(
        ((elementInfo.top - fatherContainerInfo.top) /
          fatherContainerInfo.height) *
          100
      ),
    };
    return objElemsPositionData;
  };
  // 取得陣形站位元素在父容器的相對位子  End

  // 取得自訂義元素位子數據 Start
  const getCustomElemsPosition = () => {
    // 取得所有元素站位數據
    const arrCustomFormationPositionData = [];
    divRefs.forEach((ref, index) => {
      const objElemsPosition = getElemsPosition(index);
      arrCustomFormationPositionData.push(objElemsPosition);
    });

    //  深度複製舊自定義站位數據，並追加新的屬性數據。(為了不去動到『 址類型 』的原始資料。)
    let objCustomFormation = JSON.parse(JSON.stringify(customPositionData));
    const customFormationName = textRef.current.value;

    // 檢查去除空格後是否為空，以及自定義陣形數據裡是否已有此陣形名稱。
    if (
      customFormationName.trim() &&
      !objCustomFormation[customFormationName]
    ) {
      // 新增此『 自定義陣形 』站位資料。
      objCustomFormation[customFormationName] = arrCustomFormationPositionData;

      // 更新 『 localStorage 』資料。
      localStorage.setItem(
        "customFormation",
        JSON.stringify(objCustomFormation)
      );

      // 更新 『 自定義陣形 』站位資料。
      setCustomPositionData(objCustomFormation);

      // 追加下拉選單： 『 自定義陣形 』的選單項目。
      customFormationItem.push(customFormationName);
      showToast("訊息", `${customFormationName}陣形儲存成功`, 1);

      // 自定義陣形名稱初始化
      textRef.current.value = "";
      // 關閉『 自定義陣形模式 』，以及開啟在『 自定義陣形模式 』時會啟用的相關組件的『 Disabled 』
      setIsCustom(false);
      setDisabled(true);
    } else {
      showToast("訊息", "陣形名稱不可為空 or 陣形名稱重複", 0);
    }
  };
  // 取得自訂義元素位子數據 End

  // 渲染在『 自定義陣形模式 』下可隨意拉動的元素 Start
  const customFormationRenderHandler = divRefs.map((ref, index) => {
    const uuid = uuidv4();
    return (
      <Draggable key={uuid} bounds="parent" defaultPosition={{ x: 0, y: 0 }}>
        <div className={`box--moveable`} ref={ref["ref"]}>
          <FontAwesomeIcon
            icon={faShirt}
            size="2xl"
            style={{ color: "#ffffff" }}
          />
        </div>
      </Draggable>
    );
  });
  // 渲染在『 自定義陣形模式 』下可隨意拉動的元素 End

  // 點擊『 確認刪除 』後處理動作 Start
  const accept = () => {
    const index = customFormationItem.indexOf(customFormationType);
    if (index != -1) {
      // 刪除『 自定義陣形 』下拉選單項目
      customFormationItem.splice(index, 1);

      // 刪除『 自定義陣形 』指定陣形的陣形位子數據。
      let newCustomPositionData = JSON.parse(
        JSON.stringify(customPositionData)
      );
      delete newCustomPositionData[customFormationType];
      setCustomPositionData(newCustomPositionData);

      // 刪除匹配的球員站位資料
      let newLabelPosition = JSON.parse(JSON.stringify(labelPosition));
      // 球員名站位資料不像陣形資料是一每個陣形都有一定有一比數據，所以要追加判斷。
      if (newLabelPosition[customFormationType]) {
        delete newLabelPosition[customFormationType];
        setLabelPosition(newLabelPosition);
      }

      // 當『 customFormationItem 』陣列為空的時候，刪除『 localStorage 』的『 customFormation 』項目。
      if (customFormationItem.length === 0) {
        console.log("刪除customFormation");
        localStorage.removeItem("customFormation");
        setCustomFormationType("");
      }
      // 更新『 localStorage 』的『 customFormation 』的項目資料。
      else {
        console.log("更新customFormation");
        localStorage.setItem(
          "customFormation",
          JSON.stringify(newCustomPositionData)
        );
      }

      // 固定陣形都沒有儲存球員站位資料，只有自定義陣形有球員站位資料時，條件才會成立。
      if (Object.keys(newLabelPosition).length === 0) {
        console.log("刪除球員站位");
        localStorage.removeItem("labelPosition");
      } else if (newLabelPosition) {
        console.log("更新球員站位");
        localStorage.setItem("labelPosition", JSON.stringify(newLabelPosition));
      }

      // 刪除完後都會顯示回固定陣形第一筆資料
      setCurrentType(1);
      setFormationType("4-3-3");
      showToast("訊息", `刪除『 ${customFormationType} 』陣形成功`, 1);
    }
  };
  // 點擊『 確認刪除 』後處理動作 End

  const reject = () => {};
  // 點擊『 刪除按鈕 』時顯示的提示訊息 Start
  const deleteConfirm = () => {
    // 提示訊息顯示位子，在指定元素之下。
    const elems = document.querySelector(".cus");
    confirmPopup({
      target: elems,
      message: `確定要刪除『 ${customFormationType} 』陣形嗎？`,
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };
  // 點擊『 刪除按鈕 』時顯示的提示訊息 End

  return (
    <Fragment>
      <div className="absolute w-full h-full flex TaticalBoard">
        <div className={` relative w-11 h-full  flex-grow-1`}>
          <div ref={containerRef} className="absolute w-full h-full flex">
            {isCustom ? customFormationRenderHandler : formation}
          </div>
          <img className="w-full h-full" src={background} alt="background" />
        </div>

        <div className="flex-grow-0">
          <div>
            <div className="w-16rem">
              <p className="m-2 text-xl ">請選擇陣型</p>
              <Dropdown
                className="w-16rem m-2"
                disabled={isCustom}
                value={formationType}
                options={fixedFormationItem}
                onChange={(e) => {
                  setCurrentType(1);
                  setFormationType(e.target.value);
                }}
              />
            </div>
            <div>
              <p className="m-2 text-xl">已儲存陣型</p>
              <Dropdown
                className="cus w-16rem m-2"
                disabled={isCustom}
                value={customFormationType}
                options={customFormationItem}
                onChange={(e) => {
                  setCurrentType(0);
                  setCustomFormationType(e.target.value);
                }}
                placeholder="請選擇陣形"
              />
              <ConfirmPopup />
              {customFormationItem.length > 0 ? (
                <i>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faTrashCan}
                    size="xl"
                    onClick={() => deleteConfirm()}
                  />
                </i>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="m-2">
            <Button
              className="ml-2"
              label="自定義陣形"
              onClick={() => {
                setIsCustom(true);
                setDisabled(false);
              }}
            />
            <Button
              className="ml-2"
              disabled={disabled}
              label="儲存陣形"
              onClick={() => getCustomElemsPosition()}
            />
            <Button
              className="ml-2"
              disabled={disabled}
              label="返回"
              onClick={() => {
                setIsCustom(false);
                setDisabled(true);
              }}
            />
          </div>
          <div className="m-1">
            <i className={`m-1 text-xl ${disabled ? "text-bluegray-300" : ""}`}>
              輸入自定義陣形名稱：
            </i>
            <InputText
              className="ml-2"
              disabled={disabled}
              type="text"
              ref={textRef}
            />
          </div>
          <div className="m-2">
            <Button
              className="ml-2"
              label={positionLabel}
              disabled={!disabled}
              onClick={() => {
                SetCircleStyle();
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default TacticalBoard;
