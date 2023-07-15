import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import photoInit from "@/assets/photo.svg";
import useDropdownItem from "../../../../Hook/useDropdownItem/useDropdownItem";
import classes from "./PlayersForm.module.css";

const PlayersForm = (props) => {
  const nameRef = useRef();
  // ***** 各項目狀態 *****
  const [photo, setPhoto] = useState(photoInit);
  const [gender, setGender] = useState();
  const [age, setAge] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [position, setPosition] = useState();
  const [team, setTeam] = useState();
  // ***

  // ***** 下拉式表單選項處理 *****
  const genderItem = [
    { name: "男", code: "man" },
    { name: "女", code: "woman" },
    { name: "其他", code: "other" },
  ];
  const ageItem = useDropdownItem(1, 41, "歲");
  const heightItem = useDropdownItem(150, 200, "cm");
  const weightItem = useDropdownItem(50, 100, "kg");
  const positionItem = [
    { name: "右邊鋒", code: "rw" },
    { name: "左邊鋒", code: "lw" },
    { name: "二前鋒", code: "ss" },
    { name: "前鋒", code: "cf" },
    { name: "中場", code: "cm" },
    { name: "右中場", code: "rm" },
    { name: "左中場", code: "lm" },
    { name: "中後衛", code: "cb" },
    { name: "右後衛", code: "rb" },
    { name: "左後衛", code: "lb" },
    { name: "防守型中場", code: "dm" },
    { name: "進攻型中場", code: "am" },
    { name: "守門員", code: "gk" },
  ];
  const teamItem = [
    { name: "1", code: "team1" },
    { name: "2", code: "team2" },
  ];
  // ***

  // ***** 渲染下拉式表單處理 *****
  const rowItem = [
    {
      id: "gender",
      options: genderItem,
      value: gender,
      title: "Gender",
      callBack: (e) => setGender(e.value),
    },
    {
      id: "age",
      options: ageItem,
      value: age,
      title: "Age",
      callBack: (e) => setAge(e.value),
    },
    {
      id: "height",
      options: heightItem,
      value: height,
      title: "Height",
      callBack: (e) => setHeight(e.value),
    },
    {
      id: "weight",
      options: weightItem,
      value: weight,
      title: "Weight",
      callBack: (e) => setWeight(e.value),
    },
    {
      id: "position",
      options: positionItem,
      value: position,
      title: "Position",
      callBack: (e) => setPosition(e.value),
    },
    {
      id: "team",
      options: teamItem,
      value: team,
      title: "Team",
      callBack: (e) => setTeam(e.value),
    },
  ];
  const dropdown = rowItem.map((item) => {
    return (
      <div key={item.id} className="w-2 bg-yellow-300 ">
        <div className="w-full mb-3 text-center">{item.title}</div>
        <div className={classes.borderStyle}>
          <Dropdown
            className="w-full"
            value={item.value}
            onChange={item.callBack}
            options={item.options}
            optionLabel="name"
            placeholder={`Select a ${item.title}`}
            required
          />
        </div>
      </div>
    );
  });
  // ***

  // ***** 照片預覽處理 *****
  const uploadImgHandler = () => {
    const [file] = document.getElementById("photo").files;
    if (file) {
      const img = document.getElementById("playerPhoto");
      const url = URL.createObjectURL(file);
      img.src = url;
      setPhoto(url);
    }
  };
  // ***

  // ***** 表單資料送出處理 *****
  const AddPlayerInfoHandler = (e) => {
    e.preventDefault();
    // ***** 資料彙整處理 *****
    const formData = {
      id: new Date().toLocaleString(),
      photo: (
        <img className="shadow-4" width="64px" src={photo} alt="playerPhoto" />
      ),
      name: nameRef.current.value,
      gender: gender.name,
      age: age.name,
      height: height.name,
      weight: weight.name,
      position: position.name,
      team: team.name,
    };
    // ***

    //TODO 重置處理
    // ***** 重置處理 *****
    nameRef.current.value = "";
    setPhoto(photoInit);

    // ***

    props.onSendFormData(formData);
  };
  // ***

  return (
    <form onSubmit={AddPlayerInfoHandler}>
      <div className="flex flex-column flex-wrap justify-content-start overflow-x-auto">
        <div className="flex justify-content-around align-items-center">
          <div className={classes.playerPhotoContainer}>
            <label htmlFor="photo">
              <img
                id="playerPhoto"
                className={`${classes.playerPhoto} cursor-pointer`}
                src={photo}
                alt="PlayerPhoto"
              />
            </label>
            <input
              className="hidden"
              id="photo"
              type="file"
              onChange={uploadImgHandler}
            />
          </div>
          <div className="w-2 bg-yellow-300">
            <div className="w-full mb-3 text-center">Name</div>
            <div className={classes.borderStyle}>
              <InputText className="w-full" ref={nameRef} required />
            </div>
          </div>
          {dropdown}
        </div>
        <div className="mt-5 text-center">
          <Button label="追加" />
        </div>
      </div>
    </form>
  );
};
export default PlayersForm;
