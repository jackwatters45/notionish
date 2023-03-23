import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
  padding: 6px 8px 7px;
  height: fit-content;
`;

const TextProperty = (props) => {
  const editableDivProps = useEditableDiv(props);

  return <StyledContentEditable {...editableDivProps} />;
};

export default TextProperty;
