import { mdiDeveloperBoard, mdiTable } from '@mdi/js';
import Table from '../../DatabaseTypes/Table/Table';
import Board from '../../DatabaseTypes/Board/Board';

const getBoardView = (editedTodos, selectedView) => {
  return <Board editedTodos={editedTodos} selectedView={selectedView} />;
};

const getTableView = (editedTodos, selectedView) => {
  return <Table editedTodos={editedTodos} selectedView={selectedView} />;
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
