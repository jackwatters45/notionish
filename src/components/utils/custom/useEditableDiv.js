import {
  useRef,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react';
import { cursorToEndLine } from '../helpers/cursorHelpers';
import { DatabaseContext } from '../../../context/context';

const useEditableDiv = (props) => {
  const { data, autoFocus, disabled, className, placeholder = 'Empty' } = props;
  const { setDbItems } = useContext(DatabaseContext);

  const editableRef = useRef();

  // Default change handler
  // const handleChange = (e) => {
  //   const todosCopy = [...dbItems];
  //   const todoCopy = todosCopy.find(({ id }) => id === data.id);
  //   todoCopy[e.currentTarget.id] = e.currentTarget.innerText;
  //   setDbItems(todosCopy);
  // };

  const handleChange = useCallback((e) => {
    const { id, innerText } = e.currentTarget;
    setDbItems((prevTodos) =>
      prevTodos.map((dbItem) =>
        dbItem.id === data.id ? { ...dbItem, [id]: innerText } : dbItem,
      ),
    );
  }, [data.id, setDbItems]);

  // Enter -> blur property
  const disableNewlines = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableRef.current.blur();
    }
  }, []);

  // Paste formatting
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  }, []);

  // Focus -> moves to end of line
  useLayoutEffect(() => {
    if (autoFocus && editableRef.current.innerText)
      cursorToEndLine(editableRef.current);
  }, [autoFocus, editableRef]);

  const name = props.name?.toLowerCase();
  return {
    html: data[name] || '',
    onChange: handleChange,
    onKeyDown: disableNewlines,
    onPaste: handlePaste,
    className: className,
    innerRef: editableRef,
    id: name,
    disabled,
    placeholder,
  };
};

export default useEditableDiv;
