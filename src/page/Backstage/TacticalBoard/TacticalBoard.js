import React, {
  Fragment,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { v4 as uuidv4 } from "uuid";
import { useGlobalStore } from "../../../store/GlobalContextProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import checkLogin from "../../../components/Functions/CheckLoginStatus/CheckLoginStatus";
import classes from "./TacticalBoard.module.css";
import { Tooltip } from 'primereact/tooltip';
import { ListBox } from 'primereact/listbox';
import "./style.scss"
import { GetPlayersInfo } from "@/API/playerInfo/playerInfo";
import Draggable from "react-draggable";
let bSetPostionFlag = false;
const fixedFormationItem = [
  "4-3-3",
  "4-4-2",
  "5-3-2",
  "3-5-2",
  "4-2-3-1",
  "4-5-1",
  "3-5-1",
];
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
const tempCustomPosition = [];
const customFormationItem = [];

const YellowBorderClassName = 'yellow-bdr';
const ayPlayerList = [];

//TODO 陣形固定模式，自定義模式（用radio按鈕）
const TacticalBoard = () => {
  const [formationType, setFormationType] = useState("4-3-3");
  const [customFormationType, setCustomFormationType] = useState("");
  const [formation, setFormation] = useState(null);
  const [customPositionData, setCustomPositionData] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [custom, setCustom] = useState(false);
  const [fatherContainerInfo, setFatherContainerInfo] = useState(null);
  const [currentType, setCurrentType] = useState(1);
  const { authContext, submitContext, showToast } = useGlobalStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [boxStyle, setBoxStyle] = useState(null);
  const [positionLabel, setPositionLabel] = useState("設定球員站位");

  // 初始處理 Start
  const intiHandler = async () => {
    if (await checkLogin(authContext, navigate)) {
      //取得球員清單
      const res = await GetPlayersInfo().then(res=>{
        const {Result} = res.data;
        Result.forEach(ele=>{
          ayPlayerList.push({
            name: ele.Name
          });
        });
      }).catch(err=>{
        showToast("錯誤", "獲取球員清單發生不明原因錯誤。", 0);
      });

      if (!res) return false;

      // 取得目前父元素視窗大小
      handleResize();

      // 優先顯示固定陣形的第一筆數據。
      // 單位轉換『 百分比 』to 『 px 』
      const firstData = pctConvertPx(fixedFormationPosition[formationType]);
      setFormation(formationRenderHandler(firstData));

      // 獲取『 Local Storage 』已儲存的自訂義陣型數據。
      const customFormation = localStorage.getItem("customFormation");
      if (customFormation) {
        // 數據解析
        const customData = JSON.parse(customFormation);

        // 深度複製數據（物件裡各屬性包著陣列類型的數據）。
        const _customFormation = JSON.parse(JSON.stringify(customData));

        // 『 自定義陣形 』的下拉選單項目初始化。
        customFormationItem.length = 0;

        // 追加『 自定義陣形 』下拉選單項目。
        for (const props in _customFormation) {
          if (_customFormation.hasOwnProperty.call(_customFormation, props)) {
            customFormationItem.push(props);
          }
        }

        // 儲存從『 LocalStorage 』裡取得的所有自定義陣形位子數據。
        setCustomPositionData(_customFormation);
      } else {
        console.log("無自定義陣型資料");
      }
    }
  };
  useEffect(() => {
    intiHandler();
  }, []);
  // 初始處理 End

  // 單位轉換 『 百分比 』轉換成『 px 』並返回一個陣列 Start
  const pctConvertPx = (objectArray) => {
    // 渲染因素最初 『 fatherContainerInfo 』會為空。
    const containerSizeInfo = fatherContainerInfo
      ? fatherContainerInfo
      : containerRef.current.getBoundingClientRect();
    const position = [];
    // 把數據單位從『 百分比 』轉換成『 px 』
    objectArray.forEach((object) => {
      position.push({
        left: Math.round((object["left"] / 100) * containerSizeInfo.width),
        top: Math.round((object["top"] / 100) * containerSizeInfo.height),
        name: ''
      });
    });
    // 返回一個新『 objectArray 』陣列類型數據。
    return position;
  };
  // 單位轉換 『 百分比 』轉換成『 px 』 並返回一個陣列 End

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
              size="2xl"
              style={{ color: "#ffffff" }}
            />
            <div className={'box--playerName'}>名字放這裡</div>
          </div>
          {bSetPostionFlag ? <Tooltip target={`.row-${index}`} autoHide={false}>
            <ListBox filter onChange={(e) => console.log('需要更新"名字放這裡"的值，且要儲存進localStorage')}
              options={ayPlayerList} optionLabel="name" className="w-full md:w-14rem"
              virtualScrollerOptions={{ itemSize: 30 }}
              listStyle={{ height: '250px' }}
            />
          </Tooltip>:<></>}
          
        </Fragment>
      );
    });
  };
  // 陣形渲染處理 End

  // 取得父元素視窗大小 Start
  const handleResize = () => {
    const container = containerRef.current.getBoundingClientRect();
    setFatherContainerInfo(container);
  };
  // 取得父元素視窗大小 End

  // 監聽父元素視窗變動 Start
  useEffect(() => {
    // 添加事件监听
    window.addEventListener("resize", handleResize);

    // 在组件卸载时移除事件监听
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // 監聽父元素視窗變動 End

  // 父元素的視窗大小變動後所做處理 Start
  useEffect(() => {
    // 1 = 固定陣形，0 = 自定義陣形
    let firstData;
    if (currentType === 1) {
      firstData = pctConvertPx(fixedFormationPosition[formationType]);
    } else {
      firstData = pctConvertPx(customPositionData[customFormationType]);
    }
    setFormation(formationRenderHandler(firstData));
  }, [fatherContainerInfo]);
  // 父元素的視窗大小變動後所做處理 End

  // 固定陣形變換後重新渲染 Start
  useEffect(() => {
    // 獲取指定自定義陣形數據
    const positionsData = fixedFormationPosition[formationType];
    // 單位轉換 『 百分比 』to『 px 』
    const position = pctConvertPx(positionsData);
    setFormation(formationRenderHandler(position));
  }, [formationType, boxStyle]);
  // 陣形變換後重新渲染 End

  // 自定義陣形變換後重新渲染 Start
  useEffect(() => {
    if (customFormationType) {
      // 獲取指定自定義陣形數據
      const positionsData = customPositionData[customFormationType];

      // 單位轉換 『 百分比 』to『 px 』
      const position = pctConvertPx(positionsData);
      setFormation(formationRenderHandler(position));
    }
  }, [customFormationType]);
  // 自定義陣形變換後重新渲染 End

  // - - - - - - - - - - 自定義陣列 - - - - - - - - - - -
  // 創建帶有 『 useRef 』的陣列 Start
  /* 創建11組帶有『 useRef 』的陣列。
     因『 useRef 』無法直接放在Push方法裡面，所以用物件形式來包裝，在加至陣列裡 */
  const ref = { ref: useRef(null) };
  const divRefs = [];
  for (let i = 0; i < 11; i++) {
    const _ref = JSON.parse(JSON.stringify(ref));
    divRefs.push(_ref);
  }
  // 創建帶有 『 useRef 』的陣列 End

  // 取得元素在父容器的相對位子 Start
  const getPositionHandler = (index) => {
    const element = divRefs[index]["ref"].current.getBoundingClientRect();

    // 取得元素在父容器的相對位子，並把單位『 px 』轉換成『 百分比 』
    const position = {
      left: Math.round(
        ((element.left - fatherContainerInfo.left) /
          fatherContainerInfo.width) *
          100
      ),
      top: Math.round(
        ((element.top - fatherContainerInfo.top) / fatherContainerInfo.height) *
          100
      ),
    };
    return position;
  };
  // 取得元素在父容器的相對位子  End

  // 取得自訂義元素位子數據 Start
  const getCustomPosition = () => {
    // 取得元素位子數據
    const customPosition = [];
    divRefs.forEach((ref, index) => {
      customPosition.push(getPositionHandler(index));
    });

    //  深度複製舊資料，並追加新的屬性數據。(為了不去動到『 址類型 』的原始資料。)
    let customFormation = JSON.parse(JSON.stringify(customPositionData));
    const formationName = textRef.current.value;

    console.log(formationName.trim());
    console.log(customFormation.hasOwnProperty(formationName));

    if (formationName.trim() && !customFormation[formationName]) {
      customFormation[formationName] = customPosition;
      // 更新 『 localStorage 』資料。
      localStorage.setItem("customFormation", JSON.stringify(customFormation));

      // 更新 『 本地State 』狀態。
      setCustomPositionData(customFormation);

      // 追加下拉選單 『 自定義陣形 』選單項目。
      customFormationItem.push(formationName);

      showToast("訊息", `${formationName}陣形儲存成功`, 1);
      // 自定義陣形名稱初始化
      textRef.current.value = "";
      // 關閉『 自定義陣形模式 』，以及開啟『 Disabled 』
      setCustom(false);
      setDisabled(true);
      console.log({ tempCustomPosition });
    } else {
      showToast("訊息", "陣形名稱不可為空 or 陣形名稱重複", 0);
    }
  };
  // 取得自訂義元素位子數據 End

  // 創建在『 自定義模式 』下可隨意拉動的元素 Start
  const customFormationRenderHandler = divRefs.map((ref, index) => {
    const uuid = uuidv4();
    return (
      <Draggable
        // onDrag={dragHandler}
        // onStop={dragHandler}
        key={uuid}
        bounds="parent"
        defaultPosition={{x:0, y:0}}
      >
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
  // 創建在『 自定義模式 』下可隨意拉動的元素 End

  // WEICHE ADD START
  // function dragHandler () {
  //   const customPosition = [];
  //   divRefs.forEach((ref, index) => {
  //     customPosition.push(getPositionHandler(index));
  //   });
  //   setPositionRecord(customPosition);
  // }

  function SetCircleStyle () {
    if (!bSetPostionFlag) {
      bSetPostionFlag = true;
      setBoxStyle(YellowBorderClassName);
      setPositionLabel("儲存球員站位");
    }else{
      bSetPostionFlag = false;
      setBoxStyle('');
      setPositionLabel("設定球員佔位");
    }
  }

  function SetName(object, name) {
    console.log('找到object的位置灌入名字', object, name)
  }
  // WEICHE ADD END

  return (
    <Fragment>
      <div className="absolute w-full h-full flex TaticalBoard">
        <div className="relative w-11 h-full bg-primary-700 flex-grow-1">
          <div
            ref={containerRef}
            className={`${classes.bg} absolute w-full h-full flex`}
          >
            {custom ? customFormationRenderHandler : formation}
          </div>
        </div>

        <div className="flex-grow-0">
          <div>
            <div className="w-16rem">
              <p className="m-2 text-xl ">請選擇陣型</p>
              <Dropdown
                className="w-16rem m-2"
                disabled={custom}
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
                className="w-16rem m-2"
                disabled={custom}
                value={customFormationType}
                options={customFormationItem}
                onChange={(e) => {
                  setCurrentType(0);
                  setCustomFormationType(e.target.value);
                }}
                placeholder="請選擇陣形"
              />
            </div>
          </div>
          <div className="m-2">
            <Button
              className="ml-2"
              label="自定義陣形"
              onClick={() => {
                setCustom(true);
                setDisabled(false);
              }}
            />
            <Button
              className="ml-2"
              disabled={disabled}
              label="儲存陣形"
              onClick={() => getCustomPosition()}
            />
            <Button
              className="ml-2"
              disabled={disabled}
              label="返回"
              onClick={() => {
                setCustom(false);
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
