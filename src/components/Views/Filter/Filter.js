import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import NewButton from '../../utils/components/NewButton';
import usePopup from '../../utils/custom/usePopup';
import AddFilter from './AddFilter';
import CurrentFilters from './CurrentFilters';
import { DatabaseContext } from '../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

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

// TODO check what I missed on sort
// TODO make sure working well
const Filter = (props) => {
  const buttonRef = useRef();
  const { userDbRef } = useContext(DatabaseContext);
  const { isDropdown, setIsDropdown, ...popup } = usePopup(props, buttonRef);
  const { selectedView, setViews, properties } = props;

  // TODO isAddingFilter stuff
  const [isAddingFilter, setIsAddingFilter] = useState();
  const handleClickAddNew = () => setIsAddingFilter(true);
  const handleEnterFilter = (e) => {
    if (e.key === 'Enter') setIsAddingFilter(false);
  };
  useEffect(() => {
    setIsAddingFilter(!selectedView.filter?.length);
  }, [selectedView]);

  const removeFilter = async (property) => {
    const updatedView = {
      ...selectedView,
      filter: selectedView.filter.filter(
        (filter) => filter.property !== property,
      ),
    };

    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.error(e);
    }
  };

  const isFilter = useMemo(() => !!selectedView?.filter.length, [selectedView]);

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
          {!isAddingFilter && selectedView?.filter.length ? (
            <>
              <CurrentFilters
                selectedView={selectedView}
                removeFilter={removeFilter}
                setViews={setViews}
                properties={properties}
              />
              <NewButton text={'Add filter'} onClick={handleClickAddNew} />
            </>
          ) : (
            <AddFilter
              selectedView={selectedView}
              handleEnterFilter={handleEnterFilter}
              properties={properties}
              setViews={setViews}
            />
          )}
        </DropdownContainer>
      )}
    </div>
  );
};

export default Filter;
