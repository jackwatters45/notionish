import React, { useCallback, useContext, useState } from 'react';
import SearchDropdown from '../../Utils/SearchDropdown';
import CurrentSorts from './CurrentSorts/CurrentSorts';
import NewButton from '../../../utils/components/NewButton';
import { DatabaseContext } from '../../../../context/context';
import useModal from '../../../utils/custom/useModal';
import { doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';

const ModalContainer = styled.div`
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

const SortModal = ({
  selectedView,
  setViews,
  properties,
  buttonRef,
  closeModal,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

  const [isAddingNewSort, setIsAddingNewSort] = useState(false);
  const handleClickAddNew = () => setIsAddingNewSort(true);

  const addSort = useCallback(
    async (property) => {
      setIsAddingNewSort(false);

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

  return (
    <ModalContainer {...modalProps}>
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
        <SearchDropdown
          alreadyUsed={selectedView.sort}
          properties={properties}
          handleSelectProperty={addSort}
          text={'Sort by...'}
        />
      )}
    </ModalContainer>
  );
};

export default SortModal;
