import { mdiDeveloperBoard, mdiTable } from '@mdi/js';
import Table from '../../DatabaseTypes/Table/Table';
import Board from '../../DatabaseTypes/Board/Board';

const getBoardView = (props) => <Board {...props} />;

const getTableView = (props) => <Table {...props} />;

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
