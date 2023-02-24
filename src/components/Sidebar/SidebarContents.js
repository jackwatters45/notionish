import React, { useContext } from 'react';
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

const PropertiesContainer = styled.form`
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-template-rows: repeat(5, auto);
  padding: 48px 48px 12px 48px;
  grid-column: 2;
  & > * {
    display: flex;
    align-items: start;
    gap: 8px;
  }
`;

const TodoName = styled(EditableDiv)`
  margin: 0 0 10px 0;
  font-size: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
  word-break: break-word;
  display: inline-block;
  color: var(--main-font-color);
  outline: none;
`;

const StyledInput = styled(EditableDiv)`
  align-self: start;
  justify-self: start;
  padding: 0 5px;
  height: fit-content;
  word-break: break-word;
  display: inline-block;
`;

const StyledDateInput = styled.input`
  align-self: start;
  justify-self: start;
  padding: 0 5px;
  height: fit-content;
  word-break: break-word;
  display: inline-block;
`;

const StaticProperty = styled.p`
  min-height: 30px;
  align-self: start;
  color: var(--main-font-color);
  padding: 0 5px;
  margin: 5px 0;
  word-break: break-word;
  display: inline-block;
`;

const DoneButton = styled(Icon)`
  cursor: pointer;
  align-self: start;
  margin: 5px 0;
  color: var(--main-font-color);
`;

const NotesContainer = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0px;
  align-self: flex-start;
  padding: 0 48px;
  height: 95%;
`;

const Notes = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
  background-color: inherit;
  font: inherit;
  color: var(--main-font-color);
`;

// TODO div input stuff
// TODO input positioning (probably not necessary if figure out above)
// TODO Date
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

  return (
    <>
      <PropertiesContainer>
        <TodoName id={'name'} todo={selectedTodo} autoFocus />
        <PropertyLabel icon={dropdownIcon} property={'Project'} />
        <StaticProperty>{selectedTodo.project.name}</StaticProperty>
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
        <StaticProperty>{selectedTodo.created.toLocaleString()}</StaticProperty>
        <PropertyLabel icon={checkboxIcon} property={'Done?'} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={1}
          onClick={handleRemoveTodoAndSidebar}
        />
      </PropertiesContainer>
      <NotesContainer>
        <hr />
        <Notes
          placeholder="Add notes here..."
          value={selectedTodo.notes}
          name="notes"
          onChange={handleChange}
        />
      </NotesContainer>
    </>
  );
};

export default SidebarContents;
