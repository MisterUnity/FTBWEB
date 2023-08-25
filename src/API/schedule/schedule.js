import FTBAPI from "../index";

export const PostSchedule = (schedule) => {
  return FTBAPI.post("/Player", schedule)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
