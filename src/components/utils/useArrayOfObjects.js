import { useState } from 'react';

const useArrayOfObjects = (initial = []) => {
  const [arr, setArr] = useState(initial);

  const handleRemove = (id) => setArr(arr.filter((obj) => obj.id !== id));

  const handleAdd = (newObj) => setArr([...arr, newObj]);

  return [arr, setArr, handleRemove, handleAdd];
};

export default useArrayOfObjects;
