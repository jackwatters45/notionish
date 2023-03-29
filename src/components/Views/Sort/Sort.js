import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import NewButton from '../../utils/components/NewButton';
import usePopup from '../../utils/custom/usePopup';
import SearchPopup from '../Utils/SearchPopup';
import CurrentSorts from './CurrentSorts';
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

const Sort = (props) => {
  const buttonRef = useRef();
  const { selectedView, setViews, properties } = props;
  const { userDbRef } = useContext(DatabaseContext);
  const { isDropdown, setIsDropdown, ...popupProps } = usePopup(
    buttonRef,
    props,
  );

  const [isAddingNewSort, setIsAddingNewSort] = useState(false);
  const handleClickAddNew = () => setIsAddingNewSort(true);

  const addSort = useCallback(
    async (property) => {
      setIsAddingNewSort(false);

      console.log(property);
      const updatedSort = [
        ...selectedView.sort,
        { property: property, order: 'Ascending' },
      ];

      const updatedView = { ...selectedView, sort: updatedSort };

      setViews((prevViews) =>
        prevViews.map((view) => (view === selectedView ? updatedView : view)),
      );

      try {
        await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
      } catch (e) {
        console.log(e);
      }
    },
    [selectedView, setViews, userDbRef],
  );

  const isSort = useMemo(() => !!selectedView?.sort.length, [selectedView]);

  return (
    <div>
      <Option ref={buttonRef} style={{ color: isSort && 'rgb(35, 131, 226)' }}>
        Sort
      </Option>
      {isDropdown && (
        <DropdownContainer {...popupProps}>
          {selectedView.sort.length && !isAddingNewSort ? (
            <>
              <CurrentSorts
                selectedView={selectedView}
                setViews={setViews}
                properties={properties}
              />
              <NewButton text={'Add sort'} onClick={handleClickAddNew} />
            </>
          ) : (
            <SearchPopup
              alreadyUsed={selectedView.sort}
              properties={properties}
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
