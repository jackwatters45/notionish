import React, { useContext } from 'react';
import styled from 'styled-components';
import useModal from '../../../../../utils/custom/useModal';
import filterOptions from '../../../filterHelpers';
import { DatabaseContext } from '../../../../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

const Dropdown = styled.div`
  min-width: 300px;
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

const FilterTypeDropdown = ({
  selectedView,
  closeDropdown,
  buttonRef,
  property,
  setViews,
  currentFilter,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const dropdownProps = useModal(buttonRef, closeDropdown);

  const handleSelectProperty = async (clickedProp) => {
    closeDropdown();
    const updatedFilter = { ...currentFilter, type: clickedProp };

    const updatedView = {
      ...selectedView,
      filter: selectedView.filter.map((filter) => {
        return filter.property === property ? updatedFilter : filter;
      }),
    };
    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    if (!userDbRef) return;

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dropdown {...dropdownProps}>
      {Object.keys(filterOptions).map((key) => {
        const { name, id } = filterOptions[key];
        return (
          <DropdownOption key={id} onClick={() => handleSelectProperty(key)}>
            {name}
          </DropdownOption>
        );
      })}
    </Dropdown>
  );
};

export default FilterTypeDropdown;
