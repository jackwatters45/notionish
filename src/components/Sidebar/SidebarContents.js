import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { SidebarContext } from '../MainContent';
import PropertyLabel from '../Properties/Labels/PropertyLabel';
import { tabPress } from '../utils/cursorHelpers';
import Icon from '@mdi/react';
import {
  mdiCheckboxOutline as checkboxIcon,
  mdiCheckboxBlankOutline as emptyCheckboxIcon,
} from '@mdi/js';
import NotesProperty from '../Properties/NotesProperty';
import propertyData, {
  defaultProperties,
} from '../Properties/utils/propertyHelpers';
import NewButton from '../utils/NewButton';
import NameProperty from '../Properties/NameProperty';

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

const DoneButton = styled(Icon)`
  cursor: pointer;
  align-self: start;
  margin: 6px 8px 7px;
  color: var(--main-font-color);
`;

const StyledNewButton = styled(NewButton)`
  color: var(--empty-font-color);
  margin: 0 0 10px 5px;
`;

const StyledNotes = styled(NotesProperty)`
  height: 100%;
  width: 100%;
  grid-column: 1 / -1;
  margin: 10px 0;
`;

const SidebarContents = () => {
  const { selectedTodo, handleRemoveTodoAndSidebar } =
    useContext(SidebarContext);

  useEffect(() => {
    window.addEventListener('keydown', tabPress);
    return () => window.removeEventListener('keydown', tabPress);
  }, []);

  return (
    <PropertiesContainer id="properties">
      <TodoName property={'name'} todo={selectedTodo} autoFocus />
      {defaultProperties.map((property) => {
        const { icon, getComponent } = propertyData[property.type];
        const component = getComponent(property.name, selectedTodo);
        return (
          <PropertyRow key={property.name}>
            <PropertyLabel icon={icon} property={property.name} />
            {component}
          </PropertyRow>
        );
      })}
      <PropertyRow>
        <PropertyLabel icon={checkboxIcon} property={'Done?'} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={0.85}
          onClick={handleRemoveTodoAndSidebar}
        />
      </PropertyRow>
      <StyledNewButton text="Add a property" width={''} />
      <hr />
      <StyledNotes
        property={'notes'}
        todo={selectedTodo}
        placeholder={'Add notes here...'}
      />
    </PropertiesContainer>
  );
};

export default SidebarContents;

// eslint-disable-next-line no-lone-blocks
{
  /* <PropertyLabel icon={dropdownIcon} property={'Project'} />
        <StyledSelect
          property={'project'}
          todo={selectedTodo}
          disabled={true}
        />
        <PropertyLabel icon={bulletedListIcon} property={'Priority'} />
        <StyledUrlInput property={'priority'} todo={selectedTodo} />
        <PropertyLabel icon={calendarIcon} property={'Date'} />
        <StyledDateInput property={'date'} type={'date'} todo={selectedTodo} />
        <PropertyLabel icon={clockIcon} property={'Time Created'} />
        <StyledTextInput
          property={'created'}
          type={'date'}
          styledValue={selectedTodo.created.toDateString()}
          todo={selectedTodo}
          disabled={true}
        />
      */
}
