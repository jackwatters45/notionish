import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import FilterOptionsDropdown from './FilterOptionsDropdown';
import usePopup from '../../utils/custom/usePopup';
import { DatabaseContext } from '../../../context/context';

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

const FilterPopup = (props) => {
  const buttonRef = useRef();
  const { views, setViews } = useContext(DatabaseContext);
  const { isDropdown, setIsDropdown, ...dropdown } = usePopup('', buttonRef);
  const { currentFilter, selectedView, handleEnterFilter } = props;
  const { property, type, searchEl } = currentFilter;

  const handleClickFilterOption = (option) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);
    const editedFilter = getSelected.filter.find(
      (filter) => filter === currentFilter,
    );
    editedFilter.type = option;
    setTimeout(() => {
      setViews(viewsCopy);
      setIsDropdown(false);
    });
  };

  const [filterInput, setFilterInput] = useState(searchEl);
  const handleFilterInputChange = (e) => {
    setFilterInput(e.target.value);

    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);
    const editedFilter = getSelected.filter.find(
      (filter) => filter === currentFilter,
    );
    editedFilter.searchEl = e.target.value;
    setTimeout(() => setViews(viewsCopy));
  };

  return (
    <>
      <ChooseFilter>
        {property.name}
        <FilterType>
          <FilterButton ref={buttonRef}>
            {type.name}
            <Icon path={mdiChevronDown} size={0.6} />
          </FilterButton>
          {isDropdown && (
            <FilterOptionsDropdown
              {...dropdown}
              handleClickFilterOption={handleClickFilterOption}
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

export default FilterPopup;
