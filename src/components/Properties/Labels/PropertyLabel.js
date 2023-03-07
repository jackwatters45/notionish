import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import usePopupProperty from '../../utils/custom/usePopupProperty';
import LabelDropdown from './LabelDropdown';

const Label = styled.div`
  gap: 8px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  height: 34px;
  cursor: pointer;
  border-radius: 4px;
`;

const StyledIcon = styled(Icon)`
  margin: 1px 0 0 0;
`;

const PropertyLabel = (props) => {
  const buttonRef = useRef();
  const { icon, name } = props;

  const { isDropdown, ...popupProps } = usePopupProperty(props, buttonRef);

  // hover for div parent div of content editable div
  const [hover, setHover] = useState(false);
  const handleClick = () => setHover(false);
  const toggleHoverOn = () => {
    if (!isDropdown) setHover(true);
  };
  const toggleHoverOff = () => {
    if (!isDropdown) setHover(false);
  };

  return (
    <div>
      <Label
        ref={buttonRef}
        onMouseEnter={toggleHoverOn}
        onMouseLeave={toggleHoverOff}
        onClick={handleClick}
        style={{ backgroundColor: hover ? 'rgba(255, 255, 255, 0.055)' : '' }}
      >
        <StyledIcon path={icon} size={0.75} />
        <p>{name}</p>
      </Label>
      {isDropdown ? <LabelDropdown {...popupProps}  /> : ''}
    </div>
  );
};

export default PropertyLabel;
