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
    defaultValue: null,
  },
  number: {
    name: 'Number',
    getComponent: getNumberProperty,
    icon: mdiPound,
    defaultValue: null,
  },
  url: {
    name: 'Url',
    getComponent: getUrlProperty,
    icon: mdiLinkVariant,
    defaultValue: null,
  },
  date: {
    name: 'Date',
    getComponent: getDateProperty,
    icon: mdiCalendarMonth,
    defaultValue: null,
  },
  select: {
    name: 'Select',
    getComponent: getSelectProperty,
    icon: mdiArrowDownDropCircleOutline,
    defaultValue: null,
  },
  created: {
    name: 'Created Time',
    getComponent: getCreatedProperty,
    icon: mdiClockTimeNineOutline,
    defaultValue: new Date(),
  },
};

export default propertyData;

export const defaultProperties = [
  { name: 'Priority', id: 'priority', type: 'text' },
  { name: 'Date', id: 'date', type: 'date' },
  { name: 'Time Created', id: 'created', type: 'created' },
  { name: 'Project', id: 'project', type: 'select' },
];

export const getPropertiesObj = (properties) => {
  return Object.fromEntries(
    properties.map(({ id, type }) => {
      const { defaultValue } = propertyData[type];
      return [id, defaultValue];
    }),
  );
};
