import React, { useCallback, useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import FilterOptionsDropdown from './FilterOptionsDropdown';
import { DatabaseContext } from '../../../../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

const ChooseFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px 4px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--empty-font-color);
`;

const FilterType = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const FilterButton = styled.div`
  cursor: pointer;
  color: var(--secondary-font-color);
  display: flex;
  align-items: center;
  font-weight: 700;
  padding-left: 3px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const StyledInput = styled.input`
  margin: 2px 6px;
  display: flex;
  align-items: center;
  width: calc(100% - 12px);
  font-size: 14px;
  line-height: 20px;
  padding: 3px 6px;
  position: relative;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 20%) 0px 0px 0px 1px inset;
  background: rgba(255, 255, 255, 0.055);
  cursor: text;
  height: 28px;
  &:focus {
    outline: 2px solid rgb(35, 131, 226);
  }
`;

const SelectNewFilterProperty = (props) => {
  const { currentFilter, selectedView, handleEnterFilter, setViews } = props;
  const { userDbRef } = useContext(DatabaseContext);

  const buttonRef = useRef();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleClickFilterType = () => setIsDropdownVisible(true);
  const closeDropdown = () => setIsDropdownVisible(false);

  const getUpdatedView = useCallback(
    (updatedFilter) => {
      return {
        ...selectedView,
        filter: selectedView.filter.map((filter) => {
          return filter === currentFilter ? updatedFilter : filter;
        }),
      };
    },
    [currentFilter, selectedView],
  );

  const { property, type, searchEl } = currentFilter;
  const [filterInput, setFilterInput] = useState(searchEl);
  const handleFilterInputChange = async (e) => {
    setFilterInput(e.target.value);

    const updatedFilter = { ...currentFilter, searchEl: e.target.value };
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
    <>
      <ChooseFilter>
        {property.name}
        <FilterType>
          <FilterButton onClick={handleClickFilterType} ref={buttonRef}>
            {type.name}
            <Icon path={mdiChevronDown} size={0.6} />
          </FilterButton>
          {isDropdownVisible && (
            <FilterOptionsDropdown
              buttonRef={buttonRef}
              closeDropdown={closeDropdown}
              {...props}
            />
          )}
        </FilterType>
      </ChooseFilter>
      <StyledInput
        autoFocus
        placeholder="Type a value..."
        value={filterInput}
        onChange={handleFilterInputChange}
        onKeyDown={handleEnterFilter}
      />
    </>
  );
};

export default SelectNewFilterProperty;
