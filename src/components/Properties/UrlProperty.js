import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../context/theme';

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle};
  padding: 6px 8px 7px;
  height: fit-content;
  &:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

const UrlProperty = (props) => {
  const { html, style, ...editableDivProps } = useEditableDiv(props);

  const goToLink = () => {
    if (html) window.location = html;
  };

  return (
    <StyledContentEditable
      html={html}
      style={{ ...style, textDecoration: html ? 'underline' : 'none' }}
      onDoubleClick={goToLink}
      {...editableDivProps}
    />
  );
};

export default UrlProperty;
