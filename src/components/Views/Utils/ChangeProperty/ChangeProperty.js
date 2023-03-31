import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import ChangePropertyDropdown from './ChangePropertyDropdown';

const DropdownButton = styled.div`
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

const DropdownText = styled.div`
  color: var(--main-font-color);
`;

const ChangeProperty = (props) => {
  const buttonRef = useRef();
  
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleClickPropertyDropdown = () => setIsDropdownVisible(true);
  const closeDropdown = () => setIsDropdownVisible(false);
  
  const { icon, property } = props;
  return (
    <div>
      <DropdownButton ref={buttonRef} onClick={handleClickPropertyDropdown}>
        <Icon path={icon} size={0.7} />
        <DropdownText>{property.name}</DropdownText>
        <Icon path={mdiChevronDown} size={0.6} />
      </DropdownButton>
      {isDropdownVisible && (
        <ChangePropertyDropdown
          {...props}
          buttonRef={buttonRef}
          closeDropdown={closeDropdown}
        />
      )}
    </div>
  );
};

export default ChangeProperty;
