import Icon from '@mdi/react';
import React, { useRef } from 'react';
import styled from 'styled-components';
import ViewDropdown from './ViewDropdown';
import usePopup from '../../utils/custom/usePopup';
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
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const SelectedView = styled.div`
  color: var(--main-font-color);
  border-bottom: 2px solid rgba(255, 255, 255, 0.81);
`;

const View = (props) => {
  const buttonRef = useRef();
  const { isDropdown, ...popupProps } = usePopup(props, buttonRef);

  const {
    data: { type, name },
  } = props;
  const { icon } = viewsData[type];
  return (
    <SelectedView>
      <ViewContainer ref={buttonRef}>
        <Icon path={icon} size={0.75} />
        {name}
      </ViewContainer>
      {isDropdown && <ViewDropdown {...popupProps} />}
    </SelectedView>
  );
};

export default View;
