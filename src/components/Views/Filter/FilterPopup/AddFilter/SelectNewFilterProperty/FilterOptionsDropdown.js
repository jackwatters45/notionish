import React, { useContext } from 'react';
import filterOptions from '../../../filterHelpers';
import styled from 'styled-components';
import { doc, updateDoc } from 'firebase/firestore';
import { DatabaseContext } from '../../../../../../context/context';
import useModal from '../../../../../utils/custom/useModal';

const DropdownContainer = styled.div`
  margin-top: 24px;
  width: 190px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 6px 0px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  color: var(--main-font-color);
  font-size: 14px;
  margin: 0 4px;
  padding: 0 12px;
  min-height: 28px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const FilterOptionsDropdown = ({
  selectedView,
  setViews,
  currentFilter,
  buttonRef,
  closeDropdown,
  getUpdatedView,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeDropdown);

  const handleClickFilterOption = async (option) => {
    const updatedFilter = { ...currentFilter, type: option };
    const updatedView = getUpdatedView(updatedFilter);

    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <DropdownContainer {...modalProps}>
      {Object.keys(filterOptions).map((key) => {
        const option = filterOptions[key];
        return (
          <Option
            key={option.name}
            onClick={() => handleClickFilterOption(option)}
          >
            {option.name}
          </Option>
        );
      })}
    </DropdownContainer>
  );
};

export default FilterOptionsDropdown;
