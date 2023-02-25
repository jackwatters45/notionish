import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import {
  mdiArrowDownDropCircleOutline as dropdownIcon,
  mdiFormatListBulleted as bulletedListIcon,
  mdiClockTimeNineOutline as clockIcon,
  mdiCheckboxOutline as checkboxIcon,
  mdiCheckboxBlankOutline as emptyCheckboxIcon,
  mdiCalendarMonth as calendarIcon,
} from '@mdi/js';
import EditableDiv from '../utils/EditableDiv';
import { SidebarContext, TodosContext } from '../MainContent';
import PropertyLabel from './PropertyLabel';
import { tabPress } from '../utils/cursorHelpers';

const SidebarContentContainer = styled.div`
  padding: 48px 48px 0 48px;
`;

// TODO once I start adding properties gonna need to make rows responsive
const PropertiesContainer = styled.form`
  display: grid;
  height: 100%;
  grid-template-columns: 140px 1fr;
  grid-template-rows: repeat(7, auto) 1fr;
  & > * {
    display: flex;
    gap: 8px;
  }
`;

const TodoName = styled(EditableDiv)`
  margin: 0 0 10px 0;
  font-size: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
`;

const StyledInput = styled(EditableDiv)`
  padding: 5px;
  height: fit-content;
  &:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

// TODO
const StyledDateInput = styled.input`
  align-self: start;
  justify-self: start;
  padding: 0 5px;
  height: fit-content;
  word-break: break-word;
  display: inline-block;
`;

const DoneButton = styled(Icon)`
  cursor: pointer;
  align-self: start;
  margin: 5px;
  color: var(--main-font-color);
`;

const StyledHr = styled.hr`
  grid-column: 1 / -1;
`;

const StyledNotes = styled(EditableDiv)`
  height: 100%;
  width: 100%;
  grid-column: 1 / -1;
  margin: 5px 0;
`;

// TODO Notes Styling
// TODO separate text content and html
// TODO Date component
const SidebarContents = () => {
  const { todos, setTodos, handleRemoveTodo } = useContext(TodosContext);
  const { selectedTodo, closeSidebar } = useContext(SidebarContext);

  const handleRemoveTodoAndSidebar = () => {
    handleRemoveTodo(selectedTodo.id);
    closeSidebar();
  };

  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === selectedTodo.id);
    todoCopy[e.target.name] = e.target.value;
    setTodos(todosCopy);
  };

  useEffect(() => {
    window.addEventListener('keydown', tabPress);
    return () => window.removeEventListener('keydown', tabPress);
  }, []);

  return (
    <SidebarContentContainer>
      <PropertiesContainer id="properties">
        <TodoName id={'name'} todo={selectedTodo} autoFocus />
        <PropertyLabel icon={dropdownIcon} property={'Project'} />
        <StyledInput
          id={'project'}
          styledValue={selectedTodo.project.name}
          todo={selectedTodo}
          disabled={true}
        />
        <PropertyLabel icon={bulletedListIcon} property={'Priority'} />
        <StyledInput id={'priority'} todo={selectedTodo} />
        <PropertyLabel icon={calendarIcon} property={'Date'} />
        <StyledDateInput
          name="date"
          type="date"
          placeholder="Empty"
          value={selectedTodo.date}
          onChange={handleChange}
        />
        <PropertyLabel icon={clockIcon} property={'Time Created'} />
        <StyledInput id={'created'} todo={selectedTodo} disabled={true} />
        <PropertyLabel icon={checkboxIcon} property={'Done?'} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={0.85}
          onClick={handleRemoveTodoAndSidebar}
        />
        <StyledHr />
        <StyledNotes
          id={'notes'}
          todo={selectedTodo}
          placeholder={'Add notes here...'}
        />
      </PropertiesContainer>
    </SidebarContentContainer>
  );
};

export default SidebarContents;
