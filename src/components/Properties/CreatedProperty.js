import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from './utils/useEditableDiv';
import { propertySharedStyle } from './utils/Theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
`;

// pretty much a disabled text property with the date formatted
const CreatedProperty = (props) => {
  props = { ...props, disabled: true };
  const { html: _, ...editableDivProps } = useEditableDiv(props);

  const formatDate = () => props.todo.created.toDateString();

  return <StyledContentEditable html={formatDate()} {...editableDivProps} />;
};

export default CreatedProperty;
