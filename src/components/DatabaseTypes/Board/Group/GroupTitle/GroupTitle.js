import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import GroupTitleModal from './GroupTitleModal';

const StyledNameContainer = styled.div`
  padding: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const DisabledNameContainer = styled.div`
  padding: 4px;
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
      <div onClick={handleClickGroupTitle} ref={buttonRef}>
        {groupData ? (
          <StyledNameContainer>
            <GroupTitleText>{groupData.name}</GroupTitleText>
          </StyledNameContainer>
        ) : (
          <DisabledNameContainer>
            <GroupTitleText>No Status</GroupTitleText>
          </DisabledNameContainer>
        )}
      </div>
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
