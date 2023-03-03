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
    getComponent: getTextProperty,
    icon: mdiTextLong,
  },
  number: {
    getComponent: getNumberProperty,
    icon: mdiPound,
  },
  url: {
    getComponent: getUrlProperty,
    icon: mdiLinkVariant,
  },
  date: {
    getComponent: getDateProperty,
    icon: mdiCalendarMonth,
  },
  select: {
    getComponent: getSelectProperty,
    icon: mdiArrowDownDropCircleOutline,
  },
  created: {
    getComponent: getCreatedProperty,
    icon: mdiClockTimeNineOutline,
  },
};

export default propertyData;

export const defaultProperties = [
  { name: 'Priority', type: 'text' },
  { name: 'Date', type: 'date' },
  { name: 'Time Created', type: 'created' },
  { name: 'Project', type: 'select' },
];
