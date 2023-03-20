import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import usePopup from '../../utils/custom/usePopup';
import { DatabaseContext } from '../../utils/context/context';

const Select = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgb(32, 32, 32);
  height: 32px;
  padding: 0 8px;
  color: var(--secondary-font-color);
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  &:hover {
    background: var(--card-background-color);
  }
`;

const SelectText = styled.div`
  color: var(--main-font-color);
`;

const Popup = styled.div`
  width: 180px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 6px 4px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--main-font-color);
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const OrderDropdown = (props) => {
  const { order, property, selectedView } = props;
  const { views, setViews } = useContext(DatabaseContext);
  const orderButton = useRef();
  const { isDropdown, setIsDropdown, ...popupProps } = usePopup(
    {},
    orderButton,
  );

  const handleSelectProperty = (clickedProp) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);

    const editedProp = getSelected.sort.find(
      (sort) => sort.property === property,
    );

    editedProp.order = clickedProp;

    setTimeout(() => {
      setViews(viewsCopy);
      setIsDropdown(false);
    });
  };

  return (
    <div>
      <Select ref={orderButton}>
        <SelectText>{order}</SelectText>
        <Icon path={mdiChevronDown} size={0.6} />
      </Select>
      {isDropdown && (
        <Popup {...popupProps}>
          <Row onClick={() => handleSelectProperty('Ascending')}>Ascending</Row>
          <Row onClick={() => handleSelectProperty('Descending')}>
            Descending
          </Row>
        </Popup>
      )}
    </div>
  );
};

export default OrderDropdown;
