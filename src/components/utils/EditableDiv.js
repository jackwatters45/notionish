import React, { useContext, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext, TodosContext } from '../MainContent';

const EditableDiv = ({ id, className, placeholder = 'Empty' }) => {
  const { setTodos, todos } = useContext(TodosContext);
  const { selectedTodo } = useContext(SidebarContext);

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

  const editableRef = useRef();
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
