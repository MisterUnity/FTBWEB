import FTBAPI from "../index";

export const PostSchedule = (schedule) => {
  return FTBAPI.post("/Schedule", schedule)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetSchedule = () => {
  return FTBAPI.get("/Schedule")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
