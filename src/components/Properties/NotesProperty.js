import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { TodosContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
`;

// not complete rn but seems beyond the scope of this project for now (3/1/23)
const NotesProperty = (props) => {
  const { todo } = props;
  const { setTodos, todos } = useContext(TodosContext);
  const {
    onKeyDown: _,
    handleChange: __,
    ...editableDivProps
  } = useEditableDiv(props);

  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy[e.currentTarget.id] = e.currentTarget.innerHTML;
    setTodos(todosCopy);
  };

  return (
    <StyledContentEditable onChange={handleChange} {...editableDivProps} />
  );
};

export default NotesProperty;
