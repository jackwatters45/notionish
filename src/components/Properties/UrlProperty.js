import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext, TodosContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from './utils/useEditableDiv';
import { propertySharedStyle } from './utils/Theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle};
`;

const UrlProperty = (props) => {
  const { todo, property } = props;
  const { setTodos, todos } = useContext(TodosContext);
  const { handleRemoveTodoAndSidebar } = useContext(SidebarContext);
  const { html, style, ...editableDivProps } = useEditableDiv(props);

  const handleChangePlainText = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy[e.currentTarget.id] = e.currentTarget.innerText;
    setTodos(todosCopy);
  };

  const handleBlurNameInput = () => {
    if (!todo.name) handleRemoveTodoAndSidebar(todo.id);
  };

  const goToLink = () => {
    if (html) window.location = html;
  };

  return (
    <StyledContentEditable
      html={html}
      style={{ ...style, textDecoration: html ? 'underline' : 'none' }}
      onChange={handleChangePlainText}
      onDoubleClick={goToLink}
      onBlur={property === 'name' ? handleBlurNameInput : null}
      {...editableDivProps}
    />
  );
};

export default UrlProperty;
