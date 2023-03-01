import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../useEditableDiv';
import { propertySharedStyle } from '../Theme';
import DatePicker from './DatePicker';

const DatePickerContainer = styled.div`
  display: flex;
`;

const StyledContentEditable = styled(ContentEditable)`
  ${propertySharedStyle};
  cursor: pointer;
`;

const DateProperty = (props) => {
  const { id, innerRef, onClick: _, html, ...editableDivProps } = useEditableDiv(props);

  const datePickerRef = useRef();
  const [isDatePicker, setIsDatePicker] = useState(false);
  const showDatePicker = () => setIsDatePicker(true);
  const hideDatePicker = () => setIsDatePicker(false);
  const getRight = () => {
    const pickerRightLoc = innerRef.current.getBoundingClientRect().left + 270;
    // if greater than 0 nothing, if less right: 0
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  };

  useEffect(() => {
    // TODO
    const handleClick = (e) => {
      // console.log(isDatePicker)
      // console.log(e.target.closest('#datePicker'))
      // if (isDatePicker && !e.target.closest('#datePicker'))
      //   // return hideDatePicker();
      if (e.target === innerRef.current) return showDatePicker();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDatePicker) hideDatePicker();
    };
    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [innerRef, isDatePicker]);

  return (
    <DatePickerContainer>
      <StyledContentEditable
        {...editableDivProps}
        html={html.toDateString()}
        disabled={true}
        hoverable={'true'}
        innerRef={innerRef}
        id={id}
      />
      {isDatePicker ? (
        <DatePicker
          datePickerRef={datePickerRef}
          style={getRight()}
          todo={props.todo}
          propId={id}
        />
      ) : (
        ''
      )}
    </DatePickerContainer>
  );
};

export default DateProperty;
