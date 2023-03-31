import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import LabelModal from './LabelModal';

const Label = styled.div`
  gap: 8px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  height: 34px;
  cursor: pointer;
`;

const PropertyLabel = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickPropertyLabel = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { icon, selectedProperty, className, disabled } = props;
  return (
    <div>
      <Label
        onClick={handleClickPropertyLabel}
        ref={buttonRef}
        className={className}
      >
        <Icon path={icon} size={0.75} />
        <p>{selectedProperty?.name}</p>
      </Label>
      {isModalVisible && !disabled && (
        <LabelModal buttonRef={buttonRef} closeModal={closeModal} {...props} />
      )}
    </div>
  );
};

export default PropertyLabel;
