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

// TODO util properties
// TODO make sorts actually work -> uncomment editedTodos useEffect
// TODO go through use popup and switch order of parameters
// TODO need to make sure popup is closing when I want it to
// TODO chatGpt to clean up
// TODO -> Filter
const Sort = (props) => {
  const buttonRef = useRef();
  const { selectedView, setViews, properties } = props;
  const { userDbRef } = useContext(DatabaseContext);
  const { isDropdown, setIsDropdown, ...popupProps } = usePopup(
    props,
    buttonRef,
  );

  const [isAddingNewSort, setIsAddingNewSort] = useState(false);
  // TODO removed setTimeout
  const handleClickAddNew = () => setIsAddingNewSort(true);

  const addSort = useCallback(
    async (property) => {
      setIsAddingNewSort(false);

      const updatedSort = [
        ...selectedView.sort,
        { property, order: 'Ascending' },
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
              <CurrentSorts selectedView={selectedView} setViews={setViews} />
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
