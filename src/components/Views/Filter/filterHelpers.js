
const isFilter = (property, searchEl, propertyType) => {
  if (propertyType === 'date') {
    if (!property) return false;
    const dateString = property.toLocaleDateString();
    return dateString.name.toLowerCase() === searchEl.toLowerCase();
  }

  if (propertyType === 'select')
    return property.name.toLowerCase() === searchEl.toLowerCase();

  return property.toLowerCase() === searchEl.toLowerCase();
};

const isNotFilter = (property, searchEl, propertyType) => {
  if (propertyType === 'date') {
    if (!property) return false;
    const dateString = property.toLocaleDateString();
    return dateString.name.toLowerCase() !== searchEl.toLowerCase();
  }

  if (propertyType === 'select')
    return property.name.toLowerCase() !== searchEl.toLowerCase();

  return property.toLowerCase() !== searchEl.toLowerCase();
};

const containsFilter = (property, searchEl, propertyType) => {
  if (propertyType === 'date') {
    if (!property) return false;
    const dateString = property.toLocaleDateString();
    return dateString.toLowerCase().includes(searchEl.toLowerCase());
  }

  if (propertyType === 'select')
    return property.name.toLowerCase().includes(searchEl.toLowerCase());

  return property.toLowerCase().includes(searchEl.toLowerCase());
};

const notContainsFilter = (property, searchEl, propertyType) => {
  if (propertyType === 'date') {
    if (!property) return false;
    const dateString = property.toLocaleDateString();
    return !dateString.toLowerCase().includes(searchEl.toLowerCase());
  }

  if (propertyType === 'select')
    return !property.name.toLowerCase().includes(searchEl.toLowerCase());

  return !property.toLowerCase().includes(searchEl.toLowerCase());
};

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

export default filterOptions;