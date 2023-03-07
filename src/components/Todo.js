import React, { useContext } from 'react';
import styled from 'styled-components';
import { SidebarContext } from './MainContent';
import CardDone from './utils/components/CardDone';
import NameProperty from './Properties/NameProperty';

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

const StyledNameProp = styled(NameProperty)`
  background-color: var(--card-background-color);
  padding: 0 0 6px 0;
`;

const Todo = ({ todo }) => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <TodoContainer
      className="card"
      onClick={(e) => toggleSidebar(e, todo)}
      draggable="true"
    >
      <StyledNameProp
        name={'name'}
        className="card"
        data={todo}
        autoFocus
        placeholder="Type a name..."
      />
      <CardDone className="card" todo={todo} />
    </TodoContainer>
  );
};

export default Todo;
