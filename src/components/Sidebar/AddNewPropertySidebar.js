import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import AddPropertyModal from '../Properties/AddPropertyModal';
import NewButton from '../utils/components/NewButton';

const Container = styled.div`
  width: 100%;
`;

const StyledNewButton = styled(NewButton)`
  color: var(--empty-font-color);
`;

const AddNewPropertySidebar = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickAddProperty = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { className } = props;
  return (
    <Container className={className}>
      <StyledNewButton
        onClick={handleClickAddProperty}
        text={'Add a property'}
        ref={buttonRef}
      />
      {isModalVisible && (
        <AddPropertyModal
          buttonRef={buttonRef}
          closeModal={closeModal}
          {...props}
        />
      )}
    </Container>
  );
};

export default AddNewPropertySidebar;
