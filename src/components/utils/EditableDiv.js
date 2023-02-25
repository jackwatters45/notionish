import React, { useContext, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext, TodosContext } from '../MainContent';
import styled from 'styled-components';
import { cursorToEndLine } from './cursorHelpers';

const StyledContentEditable = styled(ContentEditable)`
  width: 100%;
  word-break: break-word;
  display: inline-block;
  color: var(--main-font-color);
  border-radius: 4px;
  align-self: start;
  justify-self: start;
  outline: none;
  user-select: none;
  transition: background 20ms ease-in 0s;
`;

// TODO tab needs to go to end of text for inputs and just tab for notes -> maybe make different components entirely
// TODO deal with obj properties -> (see project prop)
const EditableDiv = ({
  id,
  className,
  styledValue = false,
  autoFocus = false,
  placeholder = 'Empty',
  disabled = false,
}) => {
  const { setTodos, todos } = useContext(TodosContext);
  const { selectedTodo } = useContext(SidebarContext);
  const editableRef = useRef();

  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === selectedTodo.id);
    todoCopy[e.currentTarget.id] = e.target.value;
    setTodos(todosCopy);
  };

  // TODO eventually change for notes section - for now enter just blurs
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
    Document.execCommand('insertText', false, text);
  };

  // If you need to format the value or it is nested add it as a property
  const getValue = () => (styledValue ? styledValue : selectedTodo[id]);

  // Hover styling - hover background editable properties that aren't active
  const [hover, setHover] = useState(false);
  const toggleHover = () => {
    if (!disabled && id !== 'notes' && id !== 'name') setHover(!hover);
  };

  // Focus -> moves to end of line
  useEffect(() => {
    if (!autoFocus) return;
    cursorToEndLine(editableRef.current);
  }, [autoFocus]);

  // useEffect(() => {console.log(editableRef.current.contentEditable)})

  return (
    <StyledContentEditable
      className={className}
      innerRef={editableRef}
      id={id}
      disabled={disabled}
      placeholder={placeholder}
      html={getValue()}
      onPaste={handlePaste}
      onChange={handleChange}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      onKeyDown={disableNewlines}
      style={
        hover && !(document.activeElement === editableRef.current)
          ? {
              backgroundColor: 'rgba(255, 255, 255, 0.055)',
              borderRadius: '4px',
            }
          : {}
      }
    />
  );
};

export default EditableDiv;
