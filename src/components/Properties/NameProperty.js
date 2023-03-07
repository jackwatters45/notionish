import React, { useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext } from '../MainContent';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
  padding: 6px 8px 7px;
  height: fit-content;
`;

// Property name is unique so kinda like a key (active prop db)
// for created - maybe add a type and if type = date that is how formatted
const NameProperty = (props) => {
  const { data: todo, property } = props;
  const { handleRemoveTodoAndSidebar } = useContext(SidebarContext);
  const editableDivProps = useEditableDiv(props);

  const handleBlurNameInput = () => {
    if (!todo.name) handleRemoveTodoAndSidebar(todo.id);
  };

  return (
    <StyledContentEditable
      onBlur={property === 'name' ? handleBlurNameInput : null}
      {...editableDivProps}
    />
  );
};

export default NameProperty;
