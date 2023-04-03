import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../../context/theme';
import DatePicker from './DatePicker';

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
  const buttonRef = useRef();

  const { html, ...editableDivProps } = useEditableDiv({
    ...props,
    disabled: true,
  });

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const handleClickDateButton = () => setIsDatePickerVisible(true);
  const closeDatePicker = () => setIsDatePickerVisible(false);

  return (
    <DatePickerContainer>
      <div ref={buttonRef} onClick={handleClickDateButton}>
        <StyledContentEditable
          {...editableDivProps}
          html={html ? html.toDateString() : 'Empty'}
          style={{ color: !html && 'var(--empty-font-color)' }}
        />
      </div>
      {isDatePickerVisible && (
        <DatePicker
          buttonRef={buttonRef}
          closeDatePicker={closeDatePicker}
          {...props}
        />
      )}
    </DatePickerContainer>
  );
};

export default DateProperty;
