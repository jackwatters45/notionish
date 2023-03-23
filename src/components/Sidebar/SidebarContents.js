import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import PropertyLabel from '../Properties/Labels/PropertyLabel';
import { tabPress } from '../utils/helpers/cursorHelpers';
import Icon from '@mdi/react';
import {
  mdiCheckboxOutline as checkboxIcon,
  mdiCheckboxBlankOutline as emptyCheckboxIcon,
} from '@mdi/js';
import NotesProperty from '../Properties/NotesProperty';
import propertyData from '../utils/helpers/propertyHelpers';
import NameProperty from '../Properties/NameProperty';
import AddNewPropertySidebar from './AddNewPropertySidebar';
import { DatabaseContext, SidebarContext } from '../utils/context/context';
import { hoverStyle } from '../utils/theme';

const PropertiesContainer = styled.form`
  padding: 32px 48px 0 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const PropertyRow = styled.div`
  margin: 4px 0;
  width: 100%;
  display: grid;
  grid-template-columns: 140px 1fr;
`;

const TodoName = styled(NameProperty)`
  font-size: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
`;

const StyledPropertyLabel = styled(PropertyLabel)`
  ${hoverStyle};
`;

const StyledPropertyValue = styled.div`
  ${hoverStyle};
  &>div:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
  `;

const DoneButton = styled(Icon)`
  cursor: pointer;
  align-self: start;
  margin: 6px 8px 7px;
  color: var(--main-font-color);
`;

const StyledNotes = styled(NotesProperty)`
  height: 100%;
  width: 100%;
  grid-column: 1 / -1;
  margin: 10px 0;
`;

const StyledAddPropButton = styled(AddNewPropertySidebar)`
  margin: 0 0 10px 5px;
`;

const SidebarContents = () => {
  const { properties } = useContext(DatabaseContext);
  const { selectedTodo, handleRemoveTodoAndSidebar } =
    useContext(SidebarContext);

  useEffect(() => {
    window.addEventListener('keydown', tabPress);
    return () => window.removeEventListener('keydown', tabPress);
  }, []);

  return (
    <PropertiesContainer id="properties">
      <TodoName name={'name'} data={selectedTodo} autoFocus />
      {properties.map(({ name, type }) => {
        const { icon, getComponent } = propertyData[type];
        return (
          <PropertyRow key={name}>
            <StyledPropertyLabel icon={icon} data={selectedTodo} name={name} />
            <StyledPropertyValue>
              {getComponent(name, selectedTodo)}
            </StyledPropertyValue>
          </PropertyRow>
        );
      })}
      <PropertyRow>
        <PropertyLabel icon={checkboxIcon} name={'Done?'} disabled={true} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={0.85}
          onClick={handleRemoveTodoAndSidebar}
        />
      </PropertyRow>
      <StyledAddPropButton text={'Add a property'} />
      <hr />
      <StyledNotes
        name={'notes'}
        data={selectedTodo}
        placeholder={'Add notes here...'}
      />
    </PropertiesContainer>
  );
};

export default SidebarContents;
