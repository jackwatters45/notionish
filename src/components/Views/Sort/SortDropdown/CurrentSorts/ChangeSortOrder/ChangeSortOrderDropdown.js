import React, { useContext } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../../../../context/context';
import useModal from '../../../../../utils/custom/useModal';
import { doc, updateDoc } from 'firebase/firestore';

const Dropdown = styled.div`
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

const DropdownOption = styled.div`
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

const ChangeSortOrderDropdown = ({
  currentSort,
  selectedView,
  property,
  setViews,
  buttonRef,
  closeDropdown,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const dropdownProps = useModal(buttonRef, closeDropdown);

  const handleSelectProperty = async (clickedProp) => {
    closeDropdown();

    const updatedSort = { ...currentSort, order: clickedProp };

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
    <Dropdown {...dropdownProps}>
      <DropdownOption onClick={() => handleSelectProperty('Ascending')}>
        Ascending
      </DropdownOption>
      <DropdownOption onClick={() => handleSelectProperty('Descending')}>
        Descending
      </DropdownOption>
    </Dropdown>
  );
};

export default ChangeSortOrderDropdown;
