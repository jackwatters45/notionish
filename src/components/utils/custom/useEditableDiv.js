import { useRef, useContext, useCallback, useLayoutEffect } from 'react';
import { cursorToEndLine } from '../helpers/cursorHelpers';
import { DatabaseContext } from '../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

const useEditableDiv = ({
  data,
  selectedProperty,
  autoFocus,
  disabled,
  className,
  placeholder,
  setDbItems,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const editableRef = useRef();

  const handleChange = useCallback(
    async (e) => {
      const input =
        selectedProperty.name === 'notes'
          ? e.currentTarget.innerHTML
          : e.target.value;

      const updatedDbItem = { ...data, [selectedProperty.name]: input };

      setDbItems((prevTodos) =>
        prevTodos.map((dbItem) => {
          return dbItem.id === data.id ? updatedDbItem : dbItem;
        }),
      );

      if (!userDbRef) return;

      try {
        await updateDoc(doc(userDbRef, 'dbItems', data.id), {
          [selectedProperty.name]: input,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [data, selectedProperty, setDbItems, userDbRef],
  );

  // Enter -> blur property
  const disableNewlines = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableRef.current.blur();
    }
  };

  // Paste formatting
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  };

  // Focus -> moves to end of line
  useLayoutEffect(() => {
    if (autoFocus && editableRef.current.innerText)
      cursorToEndLine(editableRef.current);
  }, [autoFocus, editableRef]);

  return {
    html: data[selectedProperty.name] ?? '',
    onChange: handleChange,
    onKeyDown: disableNewlines,
    onPaste: handlePaste,
    className: className,
    innerRef: editableRef,
    disabled,
    placeholder: placeholder ?? 'Empty',
  };
};

export default useEditableDiv;
