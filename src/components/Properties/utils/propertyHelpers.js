import Icon from '@mdi/react';
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

const getTextProperty = (name) => <TextProperty property={name} />;
const getNumberProperty = (name) => <NumberProperty property={name} />;
const getUrlProperty = (name) => <UrlProperty property={name} />;
const getDateProperty = (name) => <DateProperty property={name} />;
const getSelectProperty = (name) => <SelectProperty property={name} />;
const getCreatedProperty = (name) => (
  <TextProperty property={name} disabled={true} />
);

const propertyData = {
  text: {
    getComponent: getTextProperty,
    icon: <Icon path={mdiTextLong} size={0.85} />,
  },
  number: {
    getComponent: getNumberProperty,
    icon: <Icon path={mdiPound} size={0.85} />,
  },
  url: {
    getComponent: getUrlProperty,
    icon: <Icon path={mdiLinkVariant} size={0.85} />,
  },
  date: {
    getComponent: getDateProperty,
    icon: <Icon path={mdiCalendarMonth} size={0.85} />,
  },
  select: {
    getComponent: getSelectProperty,
    icon: <Icon path={mdiArrowDownDropCircleOutline} size={0.85} />,
  },
  created: {
    getComponent: getCreatedProperty,
    icon: <Icon path={mdiClockTimeNineOutline} size={0.85} />,
  },
};

export default propertyData;
