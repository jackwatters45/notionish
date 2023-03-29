const filterFuncBase = (property, searchEl, propertyType, comparator) => {
  if (!searchEl) return true;
  if (!property) return false;

  if (!['date', 'select', 'text'].includes(propertyType)) {
    console.error(`Invalid property type: ${propertyType}`);
    return false;
  }

  if (propertyType === 'date') {
    const dateString = property.toLocaleDateString();
    return comparator(dateString.toLowerCase(), searchEl.toLowerCase());
  }

  if (propertyType === 'select') {
    return comparator(property.name.toLowerCase(), searchEl.toLowerCase());
  }

  return comparator(property.toLowerCase(), searchEl.toLowerCase());
};

const isFilter = (property, searchEl, propertyType) =>
  filterFuncBase(property, searchEl, propertyType, (a, b) => a === b);

const isNotFilter = (property, searchEl, propertyType) =>
  filterFuncBase(property, searchEl, propertyType, (a, b) => a !== b);

const containsFilter = (property, searchEl, propertyType) =>
  filterFuncBase(property, searchEl, propertyType, (a, b) => a.includes(b));

const notContainsFilter = (property, searchEl, propertyType) =>
  filterFuncBase(property, searchEl, propertyType, (a, b) => !a.includes(b));

const filterOptions = {
  is: { name: 'Is', id: 'is', filterFunc: isFilter },
  isNot: { name: 'Is not', id: 'is not', filterFunc: isNotFilter },
  contains: { name: 'Contains', id: 'contains', filterFunc: containsFilter },
  doesNotContain: {
    name: 'Does not contain',
    id: 'does not contain',
    filterFunc: notContainsFilter,
  },
};

export const applyFilters = (newDbItems, filterArr) => {
  if (!Array.isArray(newDbItems) || !Array.isArray(filterArr)) {
    throw new Error('Invalid input: both arguments should be arrays.');
  }

  return filterArr.reduce((filteredItems, filter) => {
    const { type: filterType, property: filteredProperty, searchEl } = filter;

    if (!filterOptions.hasOwnProperty(filterType)) {
      console.error(`Invalid filter type: ${filterType}`);
      return filteredItems;
    }

    const filterFunction = filterOptions[filterType].filterFunc;
    return filteredItems.filter((dbItem) =>
      filterFunction(
        dbItem[filteredProperty.id],
        searchEl,
        filteredProperty.type,
      ),
    );
  }, newDbItems);
};

export default filterOptions;
