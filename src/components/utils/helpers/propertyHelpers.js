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

const getTextProperty = (props) => <TextProperty {...props} />;

const getNumberProperty = (props) => <NumberProperty {...props} />;

const getUrlProperty = (props) => <UrlProperty {...props} />;

const getDateProperty = (props) => <DateProperty {...props} />;

const getSelectProperty = (props) => <SelectProperty {...props} />;

const getCreatedProperty = (props) => <CreatedProperty {...props} />;

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

export const getPropertiesObj = (properties) => {
  return Object.fromEntries(
    properties.map(({ name, type }) => {
      const { defaultValue } = propertyData[type];
      return [name, defaultValue];
    }),
  );
};

export const unhoverableTypes = ['created'];

export const defaultProperties = [
  {
    id: 'CWn4hkG8N6XTyhPxLhnI',
    name: 'Project',
    type: 'select',
    values: [],
  },
  {
    id: 'Doz5O0mAftJQdrVJpJlY',
    name: 'Priority',
    type: 'text',
    values: [],
  },
  { id: 'LeW7Ymaij0aBqchI0dRQ', name: 'Date', type: 'date', values: [] },
  { id: 'ycH0wDAhQiR5zCY24VPu', name: 'Created', type: 'created' },
];