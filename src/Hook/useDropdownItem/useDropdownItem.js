const useDropdownItem = (intStrNumber, intEndNumber, strUnit) => {
  let arrEmpty = [];
  for (let i = intStrNumber; i < intEndNumber + 1; i++) arrEmpty.push(i);

  const newDropdownItem = arrEmpty.map((i) => {
    return i + strUnit;
  });

  return newDropdownItem;
};

export default useDropdownItem;
