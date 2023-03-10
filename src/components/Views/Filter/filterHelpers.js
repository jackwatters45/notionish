//  all of the actual filtering logic

const isFilter = (arr, property, searchEl) =>
  arr.filter((el) => el[property] === searchEl);

const isNotFilter = (arr, property, searchEl) =>
  arr.filter((el) => el[property] !== searchEl);

const containsFilter = (arr, property, searchEl) =>
  arr.filter((el) => el[property].includes(searchEl));

const notContainsFilter = (arr, property, searchEl) =>
  arr.filter((el) => !el[property].includes(searchEl));

const filterOptions = {
  is: { name: 'Is', id: 'is', filter: isFilter },
  isNot: { name: 'Is not', id: 'is not', filter: isNotFilter },
  contains: { name: 'Contains', id: 'contains', filter: containsFilter },
  doesNotContain: {
    name: 'Does not contain',
    id: 'does not contain',
    filter: notContainsFilter,
  },
};

export default filterOptions;
