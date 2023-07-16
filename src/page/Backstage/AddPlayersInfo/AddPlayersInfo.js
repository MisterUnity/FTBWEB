import { useState, useContext, useEffect, Fragment } from "react";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { PostPlayersInfo } from "../../../API/playerInfo/playerInfo";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../store/AuthContext";
import PlayersForm from "../../../components/UI/Backstage/PlayersForm/PlayersForm";
import PlayerDataTable from "../../../components/UI/Backstage/PlayerDataTable/PlayerDataTable";
import { CheckLogin } from "../../../API/Auth/userInfo/userInfo";
const AddPlatersInfo = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    CheckLogin()
      .then((res) => {
        if (
          res.data.StatusCode === 0 ||
          res.data.StatusMessage !== "Normal end."
        ) {
          authCtx.onSetSignInStatus(false);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, []);
  // ***** 各項目狀態 *****
  const [playersInfo, setPlayersInfo] = useState([]);
  /// ***

  // *****刪除行處理 *****
  const deleteHandler = (index) => {
    console.log(index);
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];
      _playersInfo.splice(index, 1);
      return _playersInfo;
    });
  };
  /// ***

  // ***** 新資料追加至『 DataTable 』處理 *****
  const getFormDataHandler = (formData) => {
    setPlayersInfo((prevrPlayersInfo) => {
      let _playersInfo = [...prevrPlayersInfo];

      // ***** 追加『 index 』及『 delete按鈕及函數 』處理 *****
      _playersInfo.push(formData);
      for (let i = 0; i < _playersInfo.length; i++) {
        _playersInfo[i].index = i;
        _playersInfo[i].delete = (
          <Button
            label={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={deleteHandler.bind(null, i)}
          />
        );
      }
      return _playersInfo;
    });
  };
  /// ***

  // ***** 所有新增球員資訊傳遞至『 後端 DataBase 』處理 *****
  const sendDataHandler = () => {
    if (playersInfo.length !== 0) {
      PostPlayersInfo(playersInfo)
        .then((res) => {
          setPlayersInfo([]);
          navigate("playerList");
        })
        .catch((err) => {
          alert(err);
        });
    } else return;
  };
  /// ***

  return (
    <Fragment>
      <div className="flex-grow-0">
        <PlayersForm onSendFormData={getFormDataHandler} />
      </div>
      <div className="mt-5 flex-grow-0 text-right">
        <Button label="送出表單" onClick={sendDataHandler} />
      </div>
      <div className="mt-5 flex-grow-1  overflow-auto">
        <PlayerDataTable playersInfo={playersInfo} />
      </div>
    </Fragment>
  );
};
export default AddPlatersInfo;
