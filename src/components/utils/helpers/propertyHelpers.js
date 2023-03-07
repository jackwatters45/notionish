import {
  mdiTextLong,
  mdiPound,
  mdiArrowDownDropCircleOutline,
  mdiLinkVariant,
  mdiCalendarMonth,
  mdiClockTimeNineOutline,
} from '@mdi/js';
import TextProperty from '../../Properties/TextProperty';
import NumberProperty from '../../Properties/NumberProperty';
import UrlProperty from '../../Properties/UrlProperty';
import SelectProperty from '../../Properties/Select/SelectProperty';
import DateProperty from '../../Properties/Date/DateProperty';
import CreatedProperty from '../../Properties/CreatedProperty';

const getTextProperty = (name, todo) => (
  <TextProperty name={name} data={todo} />
);

const getNumberProperty = (name, todo) => (
  <NumberProperty name={name} data={todo} />
);
const getUrlProperty = (name, todo) => <UrlProperty name={name} data={todo} />;
const getDateProperty = (name, todo) => (
  <DateProperty name={name} data={todo} />
);
const getSelectProperty = (name, todo) => (
  <SelectProperty name={name} data={todo} />
);
const getCreatedProperty = (name, todo) => (
  <CreatedProperty name={name} data={todo} />
);

const propertyData = {
  text: {
    name: 'Text',
    getComponent: getTextProperty,
    icon: mdiTextLong,
  },
  number: {
    name: 'Number',
    getComponent: getNumberProperty,
    icon: mdiPound,
  },
  url: {
    name: 'Url',
    getComponent: getUrlProperty,
    icon: mdiLinkVariant,
  },
  date: {
    name: 'Date',
    getComponent: getDateProperty,
    icon: mdiCalendarMonth,
  },
  select: {
    name: 'Select',
    getComponent: getSelectProperty,
    icon: mdiArrowDownDropCircleOutline,
  },
  created: {
    name: 'Created Time',
    getComponent: getCreatedProperty,
    icon: mdiClockTimeNineOutline,
  },
};

export default propertyData;

export const defaultProperties = [
  { name: 'Priority', id: 'priority', type: 'text' },
  { name: 'Date', id: 'date', type: 'date' },
  { name: 'Time Created', id: 'time created', type: 'created' },
  { name: 'Project', id: 'project', type: 'select' },
];
