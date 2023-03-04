import {
  mdiTextLong,
  mdiPound,
  mdiArrowDownDropCircleOutline,
  mdiLinkVariant,
  mdiCalendarMonth,
  mdiClockTimeNineOutline,
} from '@mdi/js';
import TextProperty from '../TextProperty';
import NumberProperty from '../NumberProperty';
import UrlProperty from '../UrlProperty';
import SelectProperty from '../Select/SelectProperty';
import DateProperty from '../Date/DateProperty';
import CreatedProperty from '../CreatedProperty';

const getTextProperty = (name, todo) => (
  <TextProperty property={name} todo={todo} />
);

const getNumberProperty = (name, todo) => (
  <NumberProperty property={name} todo={todo} />
);
const getUrlProperty = (name, todo) => (
  <UrlProperty property={name} todo={todo} />
);
const getDateProperty = (name, todo) => (
  <DateProperty property={name} todo={todo} />
);
const getSelectProperty = (name, todo) => (
  <SelectProperty property={name} todo={todo} />
);
const getCreatedProperty = (name, todo) => (
  <CreatedProperty property={name} todo={todo} />
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
