import { useEffect, useRef, useContext } from 'react';
import { cursorToEndLine } from '../helpers/cursorHelpers';
import { DatabaseContext } from '../context/context';

const useEditableDiv = (props) => {
  const { data, autoFocus, disabled, className, placeholder = 'Empty' } = props;
  const { todos, setTodos } = useContext(DatabaseContext);

  let { name } = props;
  const formatProperty = () => (name = name ? name.toLowerCase() : '');
  formatProperty();

  const editableRef = useRef();

  // Default change handler
  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === data.id);
    todoCopy[e.currentTarget.id] = e.currentTarget.innerText;
    setTodos(todosCopy);
  };

  // Enter -> blur property
  const disableNewlines = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableRef.current.blur();
    }
  };

  // Honestly no clue what this does
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  };

  // Focus -> moves to end of line
  useEffect(() => {
    if (!autoFocus || !editableRef.current.innerText) return;
    cursorToEndLine(editableRef.current);
  }, [autoFocus, editableRef]);

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
