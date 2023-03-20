import { useEffect, useState, useRef, useContext } from 'react';
import { cursorToEndLine } from '../helpers/cursorHelpers';
import { DatabaseContext } from '../context/context';

const useEditableDiv = (props) => {
  const {
    data,
    autoFocus,
    disabled,
    className,
    placeholder = 'Empty',
    hoverable = true,
  } = props;
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
    if (!autoFocus) return;
    cursorToEndLine(editableRef.current);
  }, [autoFocus, editableRef]);

  // const [hover, setHover] = useState(false);
  // // when active remove hover
  // const handleClick = () => setHover(false);
  // const toggleHoverOn = () => {
  //   if (name === 'notes' || name === 'name') return;
  //   if (!disabled || hoverable) setHover(true);
  // };
  // const toggleHoverOff = () => {
  //   if (name === 'notes' || name === 'name') return;
  //   if (!disabled || hoverable) setHover(false);
  // };

  // const style =
  //   hoverable && hover && document.activeElement !== editableRef.current
  //     ? {
  //         backgroundColor: 'rgba(255, 255, 255, 0.055)',
  //         borderRadius: '4px',
  //       }
  //     : {};

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
    // onMouseEnter: toggleHoverOn,
    // onMouseLeave: toggleHoverOff,
    // // style,
    // onClick: handleClick,
  };
};

export default useEditableDiv;
