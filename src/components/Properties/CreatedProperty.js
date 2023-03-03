import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from './utils/useEditableDiv';
import { propertySharedStyle } from './utils/Theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
  padding: 6px 8px 7px;
  height: fit-content;
  &:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

// pretty much a disabled text property with the date formatted
const CreatedProperty = (props) => {
  props = { ...props, disabled: true };
  const { html: _, ...editableDivProps } = useEditableDiv(props);

  const formatDate = () => props.todo.created.toDateString();

  return <StyledContentEditable html={formatDate()} {...editableDivProps} />;
};

export default CreatedProperty;
