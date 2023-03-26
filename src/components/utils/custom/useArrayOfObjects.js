import { useState } from 'react';

const useArrayOfObjects = (initial = []) => {
  const [arr, setArr] = useState(initial);

  const handleRemove = (id) => {
    const newArr = arr.filter((obj) => obj.id !== id);
    setArr(newArr);
    return newArr;
  };

  const handleAdd = (newObj) => {
    const newArr = [...arr, newObj];
    setArr(newArr);
    return newArr;
  };

  return [arr, setArr, handleRemove, handleAdd];
};

export default useArrayOfObjects;
