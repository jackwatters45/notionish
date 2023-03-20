import React, { useContext, useState } from 'react';
import FilterPopup from './FilterPopup';
import SearchPopup from '../Utils/SearchPopup';
import filterOptions from './filterHelpers';
import { DatabaseContext } from '../../utils/context/context';

const AddFilter = (props) => {
  const { selectedView, handleEnterFilter } = props;
  const { views, setViews } = useContext(DatabaseContext);

  const [isClickedFilterType, setIsClickedFilterType] = useState(false);

  const [currentFilter, setCurrentFilter] = useState();
  const handleSelectProperty = (property) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);

    const filter = {
      property: property,
      type: filterOptions['contains'],
      searchEl: '',
    };

    getSelected.filter = [...getSelected.filter, filter];

    setTimeout(() => {
      setCurrentFilter(filter);
      setViews(viewsCopy);
      setIsClickedFilterType(true);
    });
  };

  return (
    <>
      {!isClickedFilterType ? (
        <SearchPopup
          alreadyUsed={selectedView.filter}
          handleSelectProperty={handleSelectProperty}
          text={'Filter by...'}
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
