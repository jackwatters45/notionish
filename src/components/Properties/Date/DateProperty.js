import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../utils/theme';
import DatePicker from './DatePicker';
import usePopup from '../../utils/custom/usePopup';

const DatePickerContainer = styled.div`
  ${propertySharedStyle};
  height: fit-content;
`;

const StyledContentEditable = styled(ContentEditable)`
  padding: 6px 8px 7px;
  cursor: pointer;
  width: 100%;
`;

const DateProperty = (props) => {
  props = { ...props, disabled: true, hoverable: true };
  const {
    innerRef: dateButtonRef,
    onClick: _,
    html,
    style,
    ...editableDivProps
  } = useEditableDiv(props);

  const { isDropdown, ...popupProps } = usePopup(props, dateButtonRef);

  return (
    <DatePickerContainer>
      <StyledContentEditable
        {...editableDivProps}
        html={html ? html.toDateString() : 'Empty'}
        style={{ ...style, color: html ? '' : 'var(--empty-font-color)' }}
        innerRef={dateButtonRef}
      />
      {isDropdown ? <DatePicker {...popupProps} /> : ''}
    </DatePickerContainer>
  );
};

export default DateProperty;
