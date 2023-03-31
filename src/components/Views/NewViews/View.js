import Icon from '@mdi/react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ViewModal from './ViewModal';
import viewsData from '../../utils/helpers/viewHelpers';

const ViewContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  border-radius: 4px;
  max-width: 220px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const SelectedView = styled.div`
  color: var(--main-font-color);
  border-bottom: 2px solid rgba(255, 255, 255, 0.81);
`;

const View = ({ selectedView, removeView, setViews, views }) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickView = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { name, type } = selectedView;
  const { icon } = viewsData[type];
  return (
    <SelectedView>
      <ViewContainer ref={buttonRef} onClick={handleClickView}>
        <Icon path={icon} size={0.75} />
        {name}
      </ViewContainer>
      {isModalVisible && (
        <ViewModal
          buttonRef={buttonRef}
          closeModal={closeModal}
          selectedView={selectedView}
          views={views}
          setViews={setViews}
          removeView={removeView}
        />
      )}
    </SelectedView>
  );
};

export default View;
