import React, { useCallback, useContext, useState } from 'react';
import SelectNewFilterProperty from './SelectNewFilterProperty/SelectNewFilterProperty';
import SearchDropdown from '../../../Utils/SearchDropdown';
import { DatabaseContext } from '../../../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

const AddFilter = ({
  selectedView,
  handleEnterFilter,
  properties,
  setViews,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const [currentFilter, setCurrentFilter] = useState();

  const handleSelectProperty = useCallback(
    async (property) => {
      const newFilter = { property: property, type: 'contains', searchEl: '' };
      setCurrentFilter(newFilter);

      const updatedView = {
        ...selectedView,
        filter: [...selectedView.filter, newFilter],
      };

      setViews((prevViews) =>
        prevViews.map((view) => (view === selectedView ? updatedView : view)),
      );

      if (!userDbRef) return;

      try {
        await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
      } catch (e) {
        console.log(e);
      }
    },
    [selectedView, setViews, userDbRef],
  );

  return (
    <>
      {!currentFilter ? (
        <SearchDropdown
          alreadyUsed={selectedView.filter}
          handleSelectProperty={handleSelectProperty}
          text={'Filter by...'}
          properties={properties}
        />
      ) : (
        <SelectNewFilterProperty
          currentFilter={currentFilter}
          selectedView={selectedView}
          handleEnterFilter={handleEnterFilter}
        />
      )}
    </>
  );
};

export default AddFilter;
