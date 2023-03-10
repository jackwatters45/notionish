import { mdiDeveloperBoard, mdiTable } from '@mdi/js';

// const getTableView = (name, view) => (
//   // <TextProperty name={name} data={todo} />
// );

// const getBoardView = (name, view) => (
//   // <TextProperty name={name} data={todo} />
// );

// text: {
//   name: 'Text',
//   getComponent: getTextProperty,
//   icon: mdiTextLong,
// },

const viewsData = {
  board: {
    name: 'Board',
    icon: mdiDeveloperBoard,
  },
  table: {
    name: 'Table',
    icon: mdiTable,
  },
};

export default viewsData;

export const defaultViews = [
  {
    name: 'Board',
    id: 'board',
    type: 'board',
    icon: mdiDeveloperBoard,
    sort: [],
    filter: [],
  },
  {
    name: 'Table',
    id: 'table',
    type: 'table',
    icon: mdiTable,
    sort: [],
    filter: [],
  },
];
