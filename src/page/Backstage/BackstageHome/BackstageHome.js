import "./BackstageHome.scss";
import img1 from "../../../assets/0402-1.webp";
import img2 from "../../../assets/木蘭0416mars-3.webp";
import img3 from "../../../assets/news-mlc.webp";
const BackstageHome = () => {
  return (
    <div className="Info">
      <div className="news">
        <div>
          <div>
            <img src={img1} alt="" />
          </div>
          <p>{"2022台灣木蘭足球聯賽公告。\n 2023台灣木蘭足球聯賽資格賽。"}</p>
        </div>
        <div>
          <div>
            <img src={img2} alt="" />
          </div>
          <p>2022台灣運彩木蘭聯賽盃延賽公告。</p>
        </div>
        <div>
          <div>
            <img src={img3} alt="" />
          </div>
          <p>台灣運彩木蘭聯賽盃 藍鯨PK大戰險勝奪冠</p>
        </div>
      </div>
      <div className="bulletin-board">
        <ul>
          網站更新 _ _ _ _ _ _ _ _ _ _ _ _{" "}
          <li>2023/10/04 : i18n語言切換製作中 </li>
          <li>2023/9/04 : 修改球員清單排版</li>
          <li>2023/9/28 : 戰術板新增陣形，站位</li>
          <li>2023/9/11 : 戰術板拖移修復</li>
          <li>2023/8/16 : 修復套件版本問題</li>
          <li>2023/8/04 : 新增球員API修改</li>
          <li>2023/8/04 : 修改首頁排版</li>
          <li>2023/7/29 : 改動新增球員資料</li>
          <li>2023/7/22 : 隊徽logo修正</li>
          <li>2023/7/12 : 新增數據排版修正</li>
        </ul>
      </div>
    </div>
    // <div>sda</div>
  );
};
export default BackstageHome;
