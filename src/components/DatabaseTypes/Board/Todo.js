import React, { useContext } from 'react';
import styled from 'styled-components';
import CardDone from '../../utils/components/CardDone';
import NameProperty from '../../Properties/NameProperty';
import { SidebarContext } from '../../../context/context';
import { useDrag } from 'react-dnd';

const TodoContainer = styled.div`
  padding: 10px 10px 6px;
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

// TODO cursor for while dragging??

const Todo = ({ todo }) => {
  const { toggleSidebar } = useContext(SidebarContext);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'dbItem',
    item: { todoId: todo.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <TodoContainer
      className="dbItem"
      onClick={(e) => toggleSidebar(e, todo)}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <StyledNameProp
        name={'name'}
        className="dbItem"
        data={todo}
        placeholder="Type a name..."
      />
      <CardDone className="dbItem" todo={todo} />
    </TodoContainer>
  );
};

export default Todo;
