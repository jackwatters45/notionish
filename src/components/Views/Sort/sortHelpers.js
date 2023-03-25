const sortAscendingText = (a, b) => a.localeCompare(b);
const sortDescendingText = (a, b) => -1 * a.localeCompare(b);

const sortAscendingNum = (a, b) => parseFloat(a) - parseFloat(b);
const sortDescendingNum = (a, b) => parseFloat(b) - parseFloat(a);

const sortAscendingSelect = (a, b) => a['name'].localeCompare(b['name']);
const sortDescendingSelect = (a, b) => -1 * a['name'].localeCompare(b['name']);

const sortAscendingDate = (a, b) => new Date(a) - new Date(b);
const sortDescendingDate = (a, b) => new Date(b) - new Date(a);

const sortTypes = {
  text: { Ascending: sortAscendingText, Descending: sortDescendingText },
  number: { Ascending: sortAscendingNum, Descending: sortDescendingNum },
  date: { Ascending: sortAscendingDate, Descending: sortDescendingDate },
  url: { Ascending: sortAscendingText, Descending: sortDescendingText },
  select: { Ascending: sortAscendingSelect, Descending: sortDescendingSelect },
  created: { Ascending: sortAscendingDate, Descending: sortDescendingDate },
};

const sortFunction = (arr, propertiesArr) => {
  const arrCopy = [...arr];
  return arrCopy.sort((a, b) => {
    let result = 0;
    propertiesArr.some(({ property, order }) => {
      const { id, type } = property;
      const sortFunc = sortTypes[type][order];

      result = sortFunc(a[id], b[id]);

      return result !== 0;
    });
    return result;
  });
};

export default sortFunction;
