import Icon from '@mdi/react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { mdiPlus } from '@mdi/js';
import AddPropertyModal from '../../Properties/AddPropertyModal';
import { hoverNoBorder } from '../../../context/theme';

const AddNewButton = styled.div`
  overflow: hidden;
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
  &:hover {
    ${hoverNoBorder}
  }
`;

const StyledIcon = styled(Icon)`
  color: var(--empty-font-color);
  margin: 6px 0;
`;

const AddNewPropertyTable = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickAddProperty = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <div>
      <AddNewButton ref={buttonRef} onClick={handleClickAddProperty}>
        <StyledIcon size={0.9} path={mdiPlus} />
      </AddNewButton>
      {isModalVisible && (
        <AddPropertyModal
          buttonRef={buttonRef}
          closeModal={closeModal}
          {...props}
        />
      )}
    </div>
  );
};

export default AddNewPropertyTable;
