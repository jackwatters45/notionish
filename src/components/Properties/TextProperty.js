import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';

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

const TextProperty = (props) => {
  const editableDivProps = useEditableDiv(props);

  return <StyledContentEditable {...editableDivProps} />;
};

export default TextProperty;
