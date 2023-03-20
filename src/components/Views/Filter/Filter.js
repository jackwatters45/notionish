import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import NewButton from '../../utils/components/NewButton';
import usePopup from '../../utils/custom/usePopup';
import AddFilter from './AddFilter';
import CurrentFilters from './CurrentFilters';
import { DatabaseContext } from '../../utils/context/context';

const DropdownContainer = styled.div`
  min-width: 290px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const Option = styled.div`
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 28px;
  border-radius: 3px;
  padding: 6px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const Filter = (props) => {
  const buttonRef = useRef();
  const { views, setViews } = useContext(DatabaseContext);
  const { isDropdown, setIsDropdown, ...popup } = usePopup(props, buttonRef);
  const { selectedView } = props;

  const [isAddingFilter, setIsAddingFilter] = useState();
  const handleClickAddNew = () => setTimeout(() => setIsAddingFilter(true));

  const removeFilter = (property) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);
    getSelected.filter = getSelected.filter.filter(
      (filter) => filter.property !== property,
    );
    setTimeout(() => setViews(viewsCopy));
  };

  const handleEnterFilter = (e) => {
    if (e.key === 'Enter') setTimeout(() => setIsAddingFilter(false));
  };

  useEffect(() => {
    setIsAddingFilter(!(selectedView && selectedView.filter.length));
  }, [selectedView]);

  const [isFilter, setIsFilter] = useState(false);
  useEffect(() => {
    if (!selectedView) return;
    setIsFilter(!!selectedView.filter.length);
  }, [selectedView, views]);

  return (
    <div>
      <Option
        ref={buttonRef}
        style={{ color: isFilter && 'rgb(35, 131, 226)' }}
      >
        Filter
      </Option>
      {isDropdown && (
        <DropdownContainer {...popup}>
          {!isAddingFilter && selectedView.filter.length ? (
            <>
              <CurrentFilters
                selectedView={selectedView}
                removeFilter={removeFilter}
              />
              <NewButton text={'Add filter'} onClick={handleClickAddNew} />
            </>
          ) : (
            <AddFilter
              selectedView={selectedView}
              handleEnterFilter={handleEnterFilter}
            />
          )}
        </DropdownContainer>
      )}
    </div>
  );
};

export default Filter;
