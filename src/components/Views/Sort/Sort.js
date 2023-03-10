import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { ViewsContext } from '../../MainContent';
import NewButton from '../../utils/components/NewButton';
import usePopup from '../../utils/custom/usePopup';
import SearchPopup from '../Utils/SearchPopup';
import CurrentSorts from './CurrentSorts';

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

const Sort = (props) => {
  const buttonRef = useRef();
  const { selectedView } = props;
  const { views, setViews } = useContext(ViewsContext);
  const { isDropdown, setIsDropdown, ...popupProps } = usePopup(
    props,
    buttonRef,
  );

  const [isAddingNewSort, setIsAddingNewSort] = useState(false);
  const handleClickAddNew = () => setTimeout(() => setIsAddingNewSort(true));

  const removeSort = (property) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);
    getSelected.sort = getSelected.sort.filter(
      (sort) => sort.property !== property,
    );

    setViews(viewsCopy);
  };

  const addSort = (property) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);

    const sort = { property: property, order: 'Ascending' };
    getSelected.sort = getSelected.sort.length
      ? [...getSelected.sort, sort]
      : [sort];

    setTimeout(() => {
      setViews(viewsCopy);
      setIsAddingNewSort(false);
    });
  };

  return (
    <div>
      <Option
        ref={buttonRef}
        style={{
          color:
            selectedView && selectedView.sort.length ? 'rgb(35, 131, 226)' : '',
        }}
      >
        Sort
      </Option>
      {isDropdown && (
        <DropdownContainer {...popupProps}>
          {selectedView.sort.length && !isAddingNewSort ? (
            <>
              <CurrentSorts
                selectedView={selectedView}
                removeSort={removeSort}
              />
              <NewButton
                text={'Add sort'}
                onClick={handleClickAddNew}
                width={0}
              />
            </>
          ) : (
            <SearchPopup
              alreadyUsed={selectedView.sort}
              handleSelectProperty={addSort}
              text={'Sort by...'}
            />
          )}
        </DropdownContainer>
      )}
    </div>
  );
};

export default Sort;
