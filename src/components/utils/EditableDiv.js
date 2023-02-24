import React, { useContext, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext, TodosContext } from '../MainContent';

const EditableDiv = ({ id, className, placeholder = 'Empty', autoFocus }) => {
  const { setTodos, todos } = useContext(TodosContext);
  const { selectedTodo } = useContext(SidebarContext);
  const editableRef = useRef();

  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === selectedTodo.id);
    todoCopy[e.currentTarget.id] = e.target.value;
    setTodos(todosCopy);
  };

  // Honestly no clue what this does
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    Document.execCommand('insertText', false, text);
  };

  useEffect(() => {
    if (!autoFocus) return;
    // focus end of text - https://stackoverflow.com/a/3866442/20942838
    const range = document.createRange();
    range.selectNodeContents(editableRef.current);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, [autoFocus]);

  return (
    <ContentEditable
      className={className}
      innerRef={editableRef}
      id={id}
      placeholder={placeholder}
      html={selectedTodo[id]}
      onPaste={handlePaste}
      onChange={handleChange}
    />
  );
};

export default EditableDiv;
