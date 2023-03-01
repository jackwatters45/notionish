import React, { useState, useEffect, useRef, useContext } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../useEditableDiv';
import { propertySharedStyle } from '../Theme';
import DatePicker from './DatePicker';
import { SidebarContext } from '../../MainContent';

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

  const { setIsPopupVisible } = useContext(SidebarContext);
  const datePickerRef = useRef();
  const [isDatePicker, setIsDatePicker] = useState(false);

  const getRight = () => {
    const pickerRightLoc =
      dateButtonRef.current.getBoundingClientRect().left + 270;
    // if greater than 0 nothing, if less right: 0
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  };

  useEffect(() => {
    const showDatePicker = () => {
      setIsPopupVisible(true);
      setIsDatePicker(true);
    };
    const hideDatePicker = () => {
      setIsPopupVisible(false);
      setIsDatePicker(false);
    };

    const handleClick = (e) => {
      if (e.target === dateButtonRef.current && !isDatePicker)
        return showDatePicker();

      if (!datePickerRef.current) return;
      if (
        isDatePicker &&
        !datePickerRef.current.contains(e.target) &&
        !e.target.className.includes('calendarCell')
      )
        return hideDatePicker();
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
  }, [dateButtonRef, isDatePicker, setIsPopupVisible]);

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
      {isDatePicker ? (
        <DatePicker
          ref={datePickerRef}
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
