import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { TodosContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from './useEditableDiv';
import { propertySharedStyle } from './Theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
`;

// TODO make sure to check for notes stuff cause that will  be totally different
const NotesProperty = (props) => {
  const { todo } = props;
  const { setTodos, todos } = useContext(TodosContext);
  const { onKeyDown: _, ...editableDivProps } = useEditableDiv(props);

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
      {...editableDivProps}
    />
  );
};

export default NotesProperty;
