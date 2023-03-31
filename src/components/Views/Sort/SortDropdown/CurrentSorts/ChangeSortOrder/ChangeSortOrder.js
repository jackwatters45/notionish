import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import ChangeSortOrderDropdown from './ChangeSortOrderDropdown';

const Select = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgb(32, 32, 32);
  height: 32px;
  padding: 0 8px;
  color: var(--secondary-font-color);
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  &:hover {
    background: var(--card-background-color);
  }
`;

const SelectText = styled.div`
  color: var(--main-font-color);
`;

const ChangeSortOrder = (props) => {
  const buttonRef = useRef();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleClickSelect = () => setIsDropdownVisible(true);
  const closeDropdown = () => setIsDropdownVisible(false);

  const { order } = props;
  return (
    <div>
      <Select ref={buttonRef} onClick={handleClickSelect}>
        <SelectText>{order}</SelectText>
        <Icon path={mdiChevronDown} size={0.6} />
      </Select>
      {isDropdownVisible && (
        <ChangeSortOrderDropdown
          buttonRef={buttonRef}
          closeDropdown={closeDropdown}
          {...props}
        />
      )}
    </div>
  );
};

export default ChangeSortOrder;
