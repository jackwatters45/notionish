import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { TodosContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from './utils/useEditableDiv';
import { propertySharedStyle } from './utils/Theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
`;

// Property name is unique so kinda like a key (active prop db)
const NumberProperty = (props) => {
  const { todo } = props;
  const { setTodos, todos } = useContext(TodosContext);
  const editableDivProps = useEditableDiv(props);

  const handleChangePlainText = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy[e.currentTarget.id] = e.currentTarget.innerText;
    setTodos(todosCopy);
  };

  // Only numbers allowed
  const onlyAllowNumbers = (e) => {
    if (e.keyCode < 48 || e.keyCode > 57) e.preventDefault();
  };

  return (
    <StyledContentEditable
      onKeyDownCapture={onlyAllowNumbers}
      onChange={handleChangePlainText}
      {...editableDivProps}
    />
  );
};

export default NumberProperty;
