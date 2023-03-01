import React, { forwardRef, useContext } from 'react';
import styled from 'styled-components';
import { TodosContext } from '../../MainContent';
import Icon from '@mdi/react';
import { mdiDrag } from '@mdi/js';

const DropdownContainer = styled.div`
  position: absolute;
  width: 270px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const Current = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  cursor: text;
  box-shadow: rgb(255 255 255 / 13%) 0px -1px inset;
  max-height: 240px;
  min-height: 34px;
  padding: 0 8px;
`;

const CategoryName = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0px;
  height: 20px;
  border-radius: 3px;
  padding: 0 6px;
  font-size: 14px;
  line-height: 120%;
  color: rgba(255, 255, 255, 0.804);
  background: rgb(90, 90, 90);
`;

const Categories = styled.div`
  padding: 6px 4px;
`;

const DropdownRow = styled.div`
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  margin: 0 4px;
  padding: 0 4px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const SelectDropdown = forwardRef(({ style, todo, propId }, ref) => {
  const { projects } = useContext(TodosContext);
  const { setTodos, todos } = useContext(TodosContext);

  const handleClick = (project) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);
    todoCopy[propId] = project;
    setTodos(todosCopy);
  };

  return (
    <DropdownContainer id="datePicker" ref={ref} style={style}>
      <Current>
        <CategoryName>{todo.project.name}</CategoryName>
      </Current>
      <Categories>
        {projects.map((project) => (
          <DropdownRow key={project.id} onClick={() => handleClick(project)}>
            <Icon
              path={mdiDrag}
              size={0.85}
              color={'var(--secondary-font-color)'}
            />
            <CategoryName>{project.name}</CategoryName>
          </DropdownRow>
        ))}
      </Categories>
    </DropdownContainer>
  );
});

export default SelectDropdown;
