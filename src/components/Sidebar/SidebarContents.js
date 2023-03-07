import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { PropertiesContext, SidebarContext } from '../MainContent';
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
import AddNewProperty from './AddNewProperty';

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

const StyledNotes = styled(NotesProperty)`
  height: 100%;
  width: 100%;
  grid-column: 1 / -1;
  margin: 10px 0;
`;

// TODO create property -> donny forget id
const SidebarContents = () => {
  const { properties } = useContext(PropertiesContext);
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
            <PropertyLabel icon={icon} data={selectedTodo} name={name} />
            {getComponent(name, selectedTodo)}
          </PropertyRow>
        );
      })}
      <PropertyRow>
        <PropertyLabel icon={checkboxIcon} data={{ name: 'Done?' }} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={0.85}
          onClick={handleRemoveTodoAndSidebar}
        />
      </PropertyRow>
      <AddNewProperty />
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
