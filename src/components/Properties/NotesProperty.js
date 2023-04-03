import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../utils/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
`;

// not complete rn but seems beyond the scope of this project for now (3/1/23)
const NotesProperty = (props) => {
  const { onKeyDown: _1, ...editableDivProps } = useEditableDiv(props);

  return <StyledContentEditable {...editableDivProps} />;
};

export default NotesProperty;
