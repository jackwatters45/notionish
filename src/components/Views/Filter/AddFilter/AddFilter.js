import React, { useCallback, useContext, useState } from 'react';
import FilterPopup from './FilterPopup';
import SearchPopup from '../../Utils/SearchPopup';
import { DatabaseContext } from '../../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

const AddFilter = (props) => {
  const { selectedView, handleEnterFilter, properties, setViews } = props;
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
        <SearchPopup
          alreadyUsed={selectedView.filter}
          handleSelectProperty={handleSelectProperty}
          text={'Filter by...'}
          properties={properties}
        />
      ) : (
        <FilterPopup
          currentFilter={currentFilter}
          selectedView={selectedView}
          handleEnterFilter={handleEnterFilter}
        />
      )}
    </>
  );
};

export default AddFilter;
