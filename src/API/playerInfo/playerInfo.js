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
    formData.append("Name", ayPlayerInfos[i].name);
    formData.append("Age", ayPlayerInfos[i].age);
    formData.append("Gender", ayPlayerInfos[i].gender === "男" ? "M" : "F");
    formData.append("Height", ayPlayerInfos[i].height);
    formData.append("Position", ayPlayerInfos[i].position);
    formData.append("Team", ayPlayerInfos[i].team);
    formData.append("Weight", ayPlayerInfos[i].weight);
    // formData.append("description", ayPlayerInfos[i].description);
    formData.append("Photo", ayPlayerInfos[i].photo, ayPlayerInfos[i].name);
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
      throw new Error(err);
    });
};
// 新增球員資料 End

// 更新指定球員個人資料 Start
export const PutPlayerPersonalInfo = (formData) => {
  return FTBAPI.put(`/Player/${formData.ID}`, {
    headers: { "Content-Type ": "multipart/form-data" },
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
export const PutPlayerDataTableInfo = (dataTable) => {
  return FTBAPI.put(`/Player/${dataTable.ID}`)
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
  return FTBAPI.delete(`/Player/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
// 刪除指定球員資料 End
