import React, { useContext, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';
import { SidebarContext } from '../utils/context/context';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
  padding: 6px 8px 7px;
  height: fit-content;
`;

const NameProperty = (props) => {
  const { data: todo } = props;
  const { handleRemoveTodoAndSidebar } = useContext(SidebarContext);
  const { innerRef, ...editableDivProps } = useEditableDiv(props);

  // hovers on newly created db items
  useEffect(() => {
    if (!innerRef.current.innerText) innerRef.current.focus();
  }, [innerRef]);

  const handleBlurNameInput = () => {
    if (!todo.name) {
      handleRemoveTodoAndSidebar(todo.id);}
  };

  return (
    <StyledContentEditable
      onBlur={handleBlurNameInput}
      innerRef={innerRef}
      {...editableDivProps}
    />
  );
};

export default NameProperty;
