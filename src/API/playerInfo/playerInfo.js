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
export const PostPlayersInfo = () => {
  return FTBAPI.post("/Player")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
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