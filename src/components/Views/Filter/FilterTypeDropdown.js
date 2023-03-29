import React, { useContext, useMemo, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import usePopup from '../../utils/custom/usePopup';
import filterOptions from './filterHelpers';
import { DatabaseContext } from '../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';
import capitalizeFirstLetter from '../../utils/helpers/camelCaseToSentenceCase';

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

const FilterRow = styled.div`
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
  filterType,
  property,
  setViews,
  currentFilter,
}) => {
  const selectButton = useRef();
  const { userDbRef } = useContext(DatabaseContext);
  const { isDropdown, ...popupProps } = usePopup('', selectButton);

  const handleSelectProperty = async (clickedProp) => {
    console.log(clickedProp);
    console.log(currentFilter);
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

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.log(e);
    }
  };

  const memoizedFilterTypeName = useMemo(() => {
    return capitalizeFirstLetter(filterType);
  }, [filterType]);

  return (
    <div>
      <Select ref={selectButton}>
        <SelectText>{memoizedFilterTypeName}</SelectText>
        <Icon path={mdiChevronDown} size={0.6} />
      </Select>
      {isDropdown && (
        <Popup {...popupProps}>
          {Object.keys(filterOptions).map((key) => {
            const { name, id } = filterOptions[key];
            return (
              <FilterRow key={id} onClick={() => handleSelectProperty(key)}>
                {name}
              </FilterRow>
            );
          })}
        </Popup>
      )}
    </div>
  );
};

export default FilterTypeDropdown;
