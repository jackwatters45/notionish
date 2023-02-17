import React, { useContext } from 'react';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline } from '@mdi/js';
import styled from 'styled-components';
import { TodosContext } from './MainContent';

const TodoContainer = styled.div`
  padding: 10px 10px 6px 10px;
  background-color: var(--card-background-color);
  height: fit-content;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 2px 4px;
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
`;

const StyledInput = styled.input`
  background-color: var(--card-background-color);
  padding: 0 0 6px 0;
  word-wrap: break-word;
  word-break: break-all;
`;

const DoneContainer = styled.button`
  display: flex;
  gap: 2px;
  font-size: 12px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  color: var(--main-font-color);
  padding: 2px 1px;
`;

const Todo = ({ todo, toggleSidebar }) => {
  const { todos, setTodos, handleRemoveTodo } = useContext(TodosContext);

  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);

    todoCopy[e.target.name] = e.target.value;

    setTodos(todosCopy);
  };

  const handleBlurNameInput = () => {
    if (!todo.name) return handleRemoveTodo(todo.id);

    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy.name = todo.name;
    setTodos(todosCopy);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  // TODO auto height of name input

  return (
    <TodoContainer onClick={toggleSidebar} draggable="true">
      <StyledInput
        autoFocus
        name="name"
        placeholder="Type a name..."
        value={todo.name}
        onChange={handleChange}
        onBlur={handleBlurNameInput}
        onKeyDown={handleKeyPress}
      />
      <DoneContainer onClick={() => handleRemoveTodo(todo.id)}>
        <Icon path={mdiCheckboxBlankOutline} size={0.8} />
        <p>Done</p>
      </DoneContainer>
    </TodoContainer>
  );
};

export default Todo;
