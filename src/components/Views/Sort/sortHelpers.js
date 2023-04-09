const createSortFunction = (comparator) => (a, b) => {
  if (a === undefined || b === undefined) return 0;
  return comparator(a, b);
};

const textComparator = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return 0;
  return a.localeCompare(b);
};

const numComparator = (a, b) => {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) return 0;
  return numA - numB;
};

const selectComparator = (a, b) => {
  if (!a || !b || !a.hasOwnProperty('name') || !b.hasOwnProperty('name'))
    return 0;

  const { name: nameA } = a;
  const { name: nameB } = b;

  return nameA.localeCompare(nameB);
};

const dateComparator = (a, b) => {
  const dateA = new Date(a);
  const dateB = new Date(b);

  if (isNaN(dateA.valueOf()) || isNaN(dateB.valueOf())) return 0;
  return dateA - dateB;
};

const sortTextAscending = createSortFunction(textComparator);
const sortTextDescending = createSortFunction((a, b) => textComparator(b, a));

const sortNumAscending = createSortFunction(numComparator);
const sortNumDescending = createSortFunction((a, b) => numComparator(b, a));

const sortSelectAscending = createSortFunction(selectComparator);
const sortSelectDescending = createSortFunction((a, b) =>
  selectComparator(b, a),
);

const sortDateAscending = createSortFunction(dateComparator);
const sortDateDescending = createSortFunction((a, b) => dateComparator(b, a));

const sortTypes = {
  text: { Ascending: sortTextAscending, Descending: sortTextDescending },
  number: { Ascending: sortNumAscending, Descending: sortNumDescending },
  date: { Ascending: sortTextAscending, Descending: sortTextDescending },
  url: { Ascending: sortTextAscending, Descending: sortTextDescending },
  select: { Ascending: sortSelectAscending, Descending: sortSelectDescending },
  created: { Ascending: sortDateAscending, Descending: sortDateDescending },
};

const sortFunction = (arr, propertiesArr) => {
  if (!Array.isArray(arr) || !Array.isArray(propertiesArr)) {
    throw new Error('Invalid input: both arguments should be arrays.');
  }

  const arrCopy = [...arr];
  return arrCopy.sort((a, b) => {
    let result = 0;
    propertiesArr.some((property) => {
      try {
        const { property: propertyData, order } = property;
        const { name, type } = propertyData;

        if (
          !sortTypes.hasOwnProperty(type) ||
          !sortTypes[type].hasOwnProperty(order)
        ) {
          throw new Error(`Invalid sort type (${type}) or order (${order}).`);
        }

        const sortFunc = sortTypes[type][order];
        result = sortFunc(a[name], b[name]);

        return result !== 0;
      } catch (e) {
        console.error(e);
        return false;
      }
    });
    return result;
  });
};

export default sortFunction;
