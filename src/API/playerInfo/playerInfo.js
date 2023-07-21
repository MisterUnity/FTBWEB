import FTBAPI from "../index";

// Get all Players Info
export const GetPlayersInfo = () => {
  return FTBAPI.get("/Player")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Get all Player Info
export const GetPlayerInfo = (id) => {
  return FTBAPI.get(`/Player/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Post all Players Info
export const PostPlayersInfo = async (ayPlayerInfos = []) => {

  if (ayPlayerInfos.length === 0) throw new Error('沒有新增球員資料!!!');

  const ayFormData = [], pTask = [];

  for (let i=0; i< ayPlayerInfos.length; i++) {
    delete ayPlayerInfos[i].id;
    const formData = new FormData();
    formData.append('name', ayPlayerInfos[i].name);
    formData.append('age', ayPlayerInfos[i].age);
    formData.append('gender', ayPlayerInfos[i].gender === '男' ? "M" : "F");
    formData.append('height', ayPlayerInfos[i].height);
    formData.append('position', ayPlayerInfos[i].position);
    formData.append('weight', ayPlayerInfos[i].weight);
    formData.append('photo', ayPlayerInfos[i].photo, ayPlayerInfos[i].name);
    ayFormData.push(formData)
  };

  for (let info=0; info < ayFormData.length; info++) {
    pTask.push(
      FTBAPI.post("/Player/PostUpResource", ayFormData[info], {
          headers: {'Content-Type ':'multipart/form-data'},
          timeout: 1000*60*3 //3min
        }
      )
    )
  }

  return Promise.all(pTask).then(res=>res).catch(err=>{throw new Error(err)});
};

// Put Player Info
export const PutPlayerInfo = (id) => {
  return FTBAPI.put(`/Player/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Delete Player Info
export const DeletePlayerInfo = (id) => {
  return FTBAPI.delete(`/Player/${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
