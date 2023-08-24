import FTBAPI from "../index";

// 取得所有球員清單 Start
export const GetPlayersInfo = () => {
  return FTBAPI.get("/Player")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 取得所有球員清單 End

// 取得指定球員數據 Start
export const GetPlayerInfo = (id) => {
  return FTBAPI.get(`/Player/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 取得指定球員數據 End

// 新增球員資料 Start
export const PostPlayersInfo = async (ayPlayerInfos = []) => {
  if (ayPlayerInfos.length === 0) throw new Error("沒有新增球員資料!!!");
  const ayFormData = [],
    pTask = [];
  for (let i = 0; i < ayPlayerInfos.length; i++) {
    delete ayPlayerInfos[i].id;
    const formData = new FormData();
    formData.append("name", ayPlayerInfos[i].name);
    formData.append("age", ayPlayerInfos[i].age);
    formData.append("gender", ayPlayerInfos[i].gender === "男" ? "M" : "F");
    formData.append("height", ayPlayerInfos[i].height);
    formData.append("position", ayPlayerInfos[i].position);
    formData.append("team", ayPlayerInfos[i].team);
    formData.append("weight", ayPlayerInfos[i].weight);
    formData.append("photo", ayPlayerInfos[i].photo, ayPlayerInfos[i].name);
    // formData.append("description", ayPlayerInfos[i].description);
    ayFormData.push(formData);
  }
  for (let info = 0; info < ayFormData.length; info++) {
    pTask.push(
      FTBAPI.post("/Player/AddPlayer", ayFormData[info], {
        headers: { "Content-Type ": "multipart/form-data" },
        timeout: 1000 * 60 * 3, //3min
      })
    );
  }
  return Promise.all(pTask)
    .then((res) => {
      const ayStatusMsg = [];
      let bAllOK = true;
      res.forEach(({ data }, index) => {
        if (data.StatusCode !== 1) {
          ayStatusMsg.push({
            name: ayPlayerInfos[index].name,
            statusMsg: data.ErrorMessage,
            status: "error",
          });
          bAllOK = false;
        } else {
          ayStatusMsg.push({
            name: ayPlayerInfos[index].name,
            statusMsg: "上傳成功",
            status: "success",
          });
        }
      });
      if (bAllOK) {
        return {
          data: {
            StatusCode: 1,
            StatusMessage: "Normal end.",
          },
        };
      }
      return {
        data: {
          StatusCode: 0,
          StatusMessage: "Error!!",
          Result: ayStatusMsg,
        },
      };
    })
    .catch((err) => {
      throw err;
    });
};
// 新增球員資料 End

// 新增球員比賽數據 Start
export const AddGameRecord = (gameRecord) => {
  return FTBAPI.post("/Player/AddGameRecord", gameRecord)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 新增球員比賽數據 End

// 更新指定球員個人資料 Start
export const PutPlayerPersonalInfo = (ID, formData) => {
  return FTBAPI.put(`/Player/${ID}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 更新指定球員個人資料 End

// 更新指定球員數據資料 Start
export const PutGameData = (ID, dataTable) => {
  return FTBAPI.put(`/Player/${ID}`, dataTable)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 更新指定球員數據資料 End

// 刪除指定球員資料 Start
export const DeletePlayerInfo = (id) => {
  return FTBAPI.delete(`/Player/${id}`, {
    onUploadProgress: (progressEvent) => {
      const loaded = progressEvent.loaded; // 已上傳的字節數
      const total = progressEvent.total; // 總字節數
      const progress = (loaded / total) * 100; // 計算進度百分比
      console.log("進度條", progress);
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 刪除指定球員資料 End
