import React, { useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../context/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle}
  padding: 6px 8px 7px;
  height: fit-content;
`;

const NameProperty = (props) => {
  const { innerRef, ...editableDivProps } = useEditableDiv(props);

  // hovers on newly created db items
  useEffect(() => {
    if (!innerRef.current.innerText) innerRef.current.focus();
  }, [innerRef]);

  return (
    <StyledContentEditable
      innerRef={innerRef}
      className={props.className}
      {...editableDivProps}
    />
  );
};

export default NameProperty;
