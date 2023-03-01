import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../useEditableDiv';
import { propertySharedStyle } from '../Theme';
import DatePicker from './DatePicker';
import usePopupProperty from '../usePopupProperty';

const DatePickerContainer = styled.div`
  ${propertySharedStyle};
`;

const StyledContentEditable = styled(ContentEditable)`
  cursor: pointer;
  width: 100%;
`;

const DateProperty = (props) => {
  const {
    id,
    innerRef: dateButtonRef,
    onClick: _,
    html,
    style,
    ...editableDivProps
  } = useEditableDiv(props);

  const { isDropdown, ...popupProps } = usePopupProperty(props, dateButtonRef);

  return (
    <DatePickerContainer>
      <StyledContentEditable
        {...editableDivProps}
        html={html ? html.toDateString() : 'Empty'}
        style={{ ...style, color: html ? '' : 'var(--empty-font-color)' }}
        disabled={true}
        hoverable={'true'}
        innerRef={dateButtonRef}
        id={id}
      />
      {isDropdown ? <DatePicker {...popupProps} /> : ''}
    </DatePickerContainer>
  );
};

export default DateProperty;
