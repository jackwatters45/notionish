import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import GroupTitleModal from './GroupTitleModal';

const StyledNameContainer = styled.div`
  padding: 4px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;
const GroupTitleText = styled.p`
  width: fit-content;
  border-radius: 4px;
  background: rgb(90, 90, 90);
  padding: 0 6px;
`;

const GroupTitle = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickGroupTitle = () => {
    if (groupData) setIsModalVisible(true);
  };
  const closeModal = () => setIsModalVisible(false);

  const { groupData } = props;
  return (
    <div>
      <StyledNameContainer onClick={handleClickGroupTitle} ref={buttonRef}>
        <GroupTitleText>
          {groupData ? groupData.name : 'No Status'}
        </GroupTitleText>
      </StyledNameContainer>
      {isModalVisible && (
        <GroupTitleModal
          buttonRef={buttonRef}
          closeModal={closeModal}
          {...props}
        />
      )}
    </div>
  );
};

export default GroupTitle;
