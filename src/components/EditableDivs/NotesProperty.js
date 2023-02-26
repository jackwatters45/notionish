import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { TodosContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from './useEditableDiv';

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

// TODO make sure to check for notes stuff cause that will  be totally different
const NotesProperty = (props) => {
  const { todo } = props;
  const { setTodos, todos } = useContext(TodosContext);
  const editableDivProps = useEditableDiv(props);

  // TODO need to account for html
  const handleChangePlainText = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy[e.currentTarget.id] = e.currentTarget.innerText;
    setTodos(todosCopy);
  };

  return (
    <StyledContentEditable
      onChange={handleChangePlainText}
      onKeyDown={(e) => e.preventDefault()}
      onMouseEnter={(e) => e.preventDefault()}
      {...editableDivProps}
    />
  );
};

export default NotesProperty;
