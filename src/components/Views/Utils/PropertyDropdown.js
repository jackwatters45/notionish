import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import usePopup from '../../utils/custom/usePopup';
import SearchPopup from './SearchPopup';
import { ViewsContext } from '../../MainContent';

const Select = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgb(32, 32, 32);
  height: 32px;
  padding: 0 8px;
  color: var(--secondary-font-color);
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  &:hover {
    background: var(--card-background-color);
  }
`;

const SelectText = styled.div`
  color: var(--main-font-color);
`;

const Popup = styled.div`
  min-width: 300px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 6px 4px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const PropertyDropdown = (props) => {
  const { icon, selectedView, type, property } = props;
  const { views, setViews } = useContext(ViewsContext);
  const selectButton = useRef();
  const { isDropdown, ...popupProps } = usePopup({}, selectButton);

  const handleSelectProperty = (clickedProp) => {
    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);

    const editedProp = getSelected[type].find((el) => el.property === property);
    editedProp.property = clickedProp;

    setTimeout(() => setViews(viewsCopy));
  };
  return (
    <div>
      <Select ref={selectButton}>
        <Icon path={icon} size={0.7} />
        <SelectText>{property.name}</SelectText>
        <Icon path={mdiChevronDown} size={0.6} />
      </Select>
      {isDropdown && (
        <Popup {...popupProps}>
          <SearchPopup
            alreadyUsed={selectedView[type]}
            handleSelectProperty={handleSelectProperty}
            text={'Search for a property...'}
          />
        </Popup>
      )}
    </div>
  );
};

export default PropertyDropdown;
