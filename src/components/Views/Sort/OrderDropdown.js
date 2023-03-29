import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import usePopup from '../../utils/custom/usePopup';
import { DatabaseContext } from '../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

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

const OrderDropdown = ({ order, property, selectedView, setViews }) => {
  const { userDbRef } = useContext(DatabaseContext);

  const orderButton = useRef();
  const { isDropdown, setIsDropdown, ...popupProps } = usePopup(
    '',
    orderButton,
  );

  const handleSelectProperty = async (clickedProp) => {
    setIsDropdown(false);

    const updatedSort = { ...selectedView.sort, order: clickedProp };

    const updatedView = {
      ...selectedView,
      sort: selectedView.sort.map((sort) => {
        return sort.property === property ? updatedSort : sort;
      }),
    };

    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
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
