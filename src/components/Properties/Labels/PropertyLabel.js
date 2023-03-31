import React, { useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import useModal from '../../utils/custom/useModal';
import LabelDropdown from './LabelDropdown';

const Label = styled.div`
  gap: 8px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  height: 34px;
  cursor: pointer;
  // border-radius: 4px;
`;

const StyledIcon = styled(Icon)`
  margin: 1px 0 0 0;
`;

const PropertyLabel = (props) => {
  const buttonRef = useRef();
  const { icon, name, className, disabled } = props;

  const { isDropdown, ...popupProps } = useModal(buttonRef, props);

  return (
    <div>
      <Label ref={buttonRef} className={className}>
        <StyledIcon path={icon} size={0.75} />
        <p>{name}</p>
      </Label>
      {isDropdown && !disabled && <LabelDropdown {...popupProps} />}
    </div>
  );
};

export default PropertyLabel;
