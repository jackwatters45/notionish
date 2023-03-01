import React, { useContext, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { SidebarContext } from '../../MainContent';
import styled from 'styled-components';
import useEditableDiv from '../useEditableDiv';
import { propertySharedStyle } from '../Theme';
import SelectDropdown from './SelectDropdown';

const SelectContainer = styled.div`
  ${propertySharedStyle};
`;

const SelectButtonBackground = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
`;

const StyledContentEditable = styled(ContentEditable)`
  cursor: pointer;
  width: fit-content;
  background: rgb(90, 90, 90);
  padding: 0 6px;
  border-radius: 4px;
  height: 20px;
  margin: 0 0 0 6px;
`;

const SelectProp = (props) => {
  const {
    id,
    innerRef: selectButtonRef,
    html,
    ...editableDivProps
  } = useEditableDiv(props);

  const dropdownRef = useRef();
  const { setIsPopupVisible } = useContext(SidebarContext);
  const [isDropdown, setIsDropdown] = useState(false);

  const getRight = () => {
    const pickerRightLoc =
      selectButtonRef.current.getBoundingClientRect().left + 270;
    // if greater than 0 nothing, if less right: 0
    return window.innerWidth - pickerRightLoc < 0 ? { right: 0 } : {};
  };

  useEffect(() => {
    const showDatePicker = () => {
      setIsPopupVisible(true);
      setIsDropdown(true);
    };
    const hideDatePicker = () => {
      setIsPopupVisible(false);
      setIsDropdown(false);
    };

    const handleClick = (e) => {
      if (
        (e.target === selectButtonRef.current ||
          selectButtonRef.current.contains(e.target)) &&
        !isDropdown
      )
        return showDatePicker();

      if (isDropdown && !e.target.className.includes('calendarCell'))
        return hideDatePicker();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDropdown) hideDatePicker();
    };
    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdown, selectButtonRef, setIsPopupVisible]);

  const [hover, setHover] = useState(false);
  const handleClick = () => setHover(false);
  const toggleHoverOn = () => {
    if (!isDropdown) setHover(true);
  };
  const toggleHoverOff = () => {
    if (!isDropdown) setHover(false);
  };

  return (
    <SelectContainer>
      <SelectButtonBackground
        onMouseEnter={toggleHoverOn}
        onMouseLeave={toggleHoverOff}
        onClick={handleClick}
        style={{ backgroundColor: hover ? 'rgba(255, 255, 255, 0.055)' : '' }}
        ref={selectButtonRef}
      >
        <StyledContentEditable {...editableDivProps} html={html.name} id={id} />
      </SelectButtonBackground>
      {isDropdown ? (
        <SelectDropdown
          ref={dropdownRef}
          style={getRight()}
          propId={id}
          todo={props.todo}
        />
      ) : (
        ''
      )}
    </SelectContainer>
  );
};

export default SelectProp;
