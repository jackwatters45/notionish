import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import NewViewModal from './NewViewModal';

const StyledIcon = styled(Icon)`
  padding: 1px;
  cursor: pointer;
  margin-bottom: 2px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const NewView = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickAddView = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <div>
      <div onClick={handleClickAddView} ref={buttonRef}>
        <StyledIcon path={mdiPlus} size={0.9} />
      </div>
      {isModalVisible && (
        <NewViewModal
          buttonRef={buttonRef}
          closeModal={closeModal}
          {...props}
        />
      )}
    </div>
  );
};

export default NewView;
