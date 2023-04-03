import { useCallback, useState } from 'react';

const useArrayOfObjects = (initial = []) => {
  const [arr, setArr] = useState(initial);

  const handleRemove = useCallback(
    (id) => {
      const newArr = arr.filter((obj) => obj.id !== id);
      setArr(newArr);
      return newArr;
    },
    [arr],
  );

  const handleAdd = useCallback(
    (newObj) => {
      const newArr = [...arr, newObj];
      setArr((prevArr) => [...prevArr, newObj]);
      return newArr;
    },
    [arr],
  );

  return [arr, setArr, handleRemove, handleAdd];
};

export default useArrayOfObjects;
