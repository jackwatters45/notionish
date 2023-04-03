import React, { useContext, useEffect, useState } from 'react';
import CurrentFiltersSection from './CurrentFilters/CurrentFilters';
import { doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import useModal from '../../../utils/custom/useModal';
import { DatabaseContext } from '../../../../context/context';
import NewButton from '../../../utils/components/NewButton';
import AddFilter from './AddFilter/AddFilter';

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

const FilterModal = ({
  selectedView,
  setViews,
  properties,
  buttonRef,
  closeModal,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

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

    if (!userDbRef) return;

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalContainer {...modalProps}>
      {!isAddingFilter && selectedView?.filter.length ? (
        <>
          <CurrentFiltersSection
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
    </ModalContainer>
  );
};

export default FilterModal;
