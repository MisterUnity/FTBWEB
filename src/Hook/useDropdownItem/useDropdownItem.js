import { useMemo } from "react";

const useDropdownItem = (intStrNumber, intEndNumber, strUnit) => {
  const result = useMemo(() => {
    let arrEmpty = [];
    for (let i = intStrNumber; i < intEndNumber + 1; i++) arrEmpty.push(i);

    const newDropdownItem = arrEmpty.map((i) => {
      return i + strUnit;
    });

    return newDropdownItem;
  }, [intStrNumber, intEndNumber, strUnit]);

  return result;
};

export default useDropdownItem;
