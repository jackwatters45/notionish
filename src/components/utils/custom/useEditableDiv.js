import { useEffect, useState, useRef, useContext } from 'react';
import { TodosContext } from '../../MainContent';
import { cursorToEndLine } from '../cursorHelpers';

const useEditableDiv = (props) => {
  const {
    todo,
    autoFocus,
    disabled,
    className,
    placeholder = 'Empty',
    hoverable = false,
  } = props;
  const { todos, setTodos } = useContext(TodosContext);

  let { property } = props;
  const formatProperty = () => (property = property.toLowerCase());
  formatProperty();

  const editableRef = useRef();

  // Default change handler
  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
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
    if (!autoFocus) return;
    cursorToEndLine(editableRef.current);
  }, [autoFocus, editableRef]);

  const [hover, setHover] = useState(false);
  // when active remove hover
  const handleClick = () => setHover(false);
  const toggleHoverOn = () => {
    if (property === 'notes' || property === 'name') return;
    if (!disabled || hoverable) setHover(true);
  };
  const toggleHoverOff = () => {
    if (property === 'notes' || property === 'name') return;
    if (!disabled || hoverable) setHover(false);
  };

  const style =
    hover && document.activeElement !== editableRef.current
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.055)',
          borderRadius: '4px',
        }
      : {};

  return {
    html: todo[property] || '',
    onChange: handleChange,
    onKeyDown: disableNewlines,
    onPaste: handlePaste,
    className: className,
    innerRef: editableRef,
    id: property,
    disabled,
    placeholder,
    onMouseEnter: toggleHoverOn,
    onMouseLeave: toggleHoverOff,
    style,
    onClick: handleClick,
  };
};

export default useEditableDiv;
