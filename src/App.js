import { useState, useEffect } from "react";
import SignIn from "./page/SignIn/SignIn";
import OverallLayout from "./components/Layout/OverallLayout/OverallLayout";

let App = () => {
  const wait = <div></div>;
  let [result, setResult] = useState(<SignIn />);
  useEffect(() => {
    const getUser = () => {
      let user = "";
      return new Promise((res, rej) => {
        return setTimeout(() => {
          user = "apple";
          res(user);
        }, 100);
      });
    };
    getUser().then((res) => {
      if (res) {
        setResult(<OverallLayout />);
      } else {
        setResult(<SignIn />);
      }
    });
  }, []);

  // };
  // useEffect(async () => {
  //   const user = await getUser().then((res) => res);
  //   if (user === 1) {
  //     setResult(<OverallLayout />);
  //   } else {
  //     setResult(<SignIn />);
  //   }
  // }, []);

  return result;
};

// const App = () => {
//   return <SignIn />;
// };

export default App;
