import { mdiDeveloperBoard, mdiTable } from '@mdi/js';
import Table from '../../DatabaseTypes/Table/Table';
import Board from '../../DatabaseTypes/Board/Board';

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

const getBoardView = (editedTodos) => {
  return <Board editedTodos={editedTodos} />;
};

const getTableView = (editedTodos) => {
  return <Table editedTodos={editedTodos} />;
};

const viewsData = {
  board: {
    name: 'Board',
    icon: mdiDeveloperBoard,
    getComponent: getBoardView,
  },
  table: {
    name: 'Table',
    icon: mdiTable,
    getComponent: getTableView,
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

