import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { TodosContext } from './MainContent';
import Icon from '@mdi/react';
import {
  mdiChevronRight,
  mdiArrowDownDropCircleOutline,
  mdiFormatListBulleted,
  mdiClockTimeNineOutline,
  mdiCheckboxOutline,
  mdiCheckboxBlankOutline,
  mdiCalendarMonth,
} from '@mdi/js';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  display: grid;
  grid-template-columns: 5px auto;
  grid-template-rows: 36px auto 1fr;
  margin-left: auto;
  background: rgb(32, 32, 32);
  box-shadow: rgba(15, 15, 15, 0.05) 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px,
    rgba(15, 15, 15, 0.2) 0px 9px 24px;
  height: 100%;
  color: var(--secondary-font-color);
  max-width: 66.6vw;
  min-width: 400px;
`;

const CloseButton = styled(Icon)`
  margin: 4px 4px 4px 0;
  cursor: pointer;
  grid-column: 2;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const PropertiesContainer = styled.form`
  display: grid;
  grid-template-columns: 145px 1fr;
  grid-template-rows: 60px 40px 40px 40px 40px 40px;
  padding: 48px 48px 12px 48px;
  grid-column: 2;
  > * {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
// TODO format for label overflow

const TodoName = styled.input`
  font-size: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
`;

const StaticProperty = styled.p`
  color: var(--main-font-color);
`;

const DoneButton = styled(Icon)`
  cursor: pointer;
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
  &::placeholder {
    color: var(--secondary-font-color);
  }
`;

const Dragger = styled.div`
  grid-row: 1 /-1;
  cursor: col-resize;
`;

// TODO give max with
const Sidebar = ({ isSidebarVisible, closeSidebar, todo }) => {
  const { todos, setTodos, handleRemoveTodo } = useContext(TodosContext);
  const handleRemoveTodoAndSidebar = () => {
    handleRemoveTodo(todo.id);
    closeSidebar();
  };
  const handleChange = (e) => {
    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) => id === todo.id);

    todoCopy[e.target.name] = e.target.value;

    setTodos(todosCopy);
  };

  // STACK OVERFLOW - resizing sidebar
  // https://codereview.stackexchange.com/questions/263970/react-based-resizable-sidebar
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(430);

  const stopResizing = useCallback(() => setIsResizing(false), []);
  const startResizing = useCallback(
    (mouseDownEvent) => setIsResizing(true),
    [],
  );

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing)
        setSidebarWidth(
          sidebarRef.current.getBoundingClientRect().right -
            mouseMoveEvent.clientX,
        );
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  if (isSidebarVisible) {
    return (
      <SidebarContainer ref={sidebarRef} style={{ width: sidebarWidth }}>
        <Dragger onMouseDown={startResizing} />
        <CloseButton onClick={closeSidebar} path={mdiChevronRight} size={1} />
        <PropertiesContainer>
          <TodoName
            autoFocus
            placeholder="Todo Name..."
            value={todo.name}
            name="name"
            onChange={handleChange}
          />
          <label>
            <Icon path={mdiArrowDownDropCircleOutline} size={0.75} />
            <p>Project</p>
          </label>
          <StaticProperty>{todo.project.name}</StaticProperty>
          <label>
            <Icon path={mdiFormatListBulleted} size={0.75} />
            <p>Priority</p>
          </label>
          <input
            name="priority"
            placeholder="Empty"
            value={todo.priority}
            onChange={handleChange}
          />
          <label>
            <Icon path={mdiCalendarMonth} size={0.75} />
            <p>Date</p>
          </label>
          <input
            name="date"
            type="date"
            placeholder="Empty"
            value={todo.date}
            onChange={handleChange}
          />
          <label>
            <Icon path={mdiClockTimeNineOutline} size={0.75} />
            <p>Time Created</p>
          </label>
          {/* TODO fix date format */}
          <StaticProperty>{todo.created.toLocaleString()}</StaticProperty>
          <label>
            <Icon path={mdiCheckboxOutline} size={0.75} />
            <p>Done?</p>
          </label>
          <DoneButton
            color={'var(--main-font-color)'}
            path={mdiCheckboxBlankOutline}
            size={1}
            onClick={handleRemoveTodoAndSidebar}
          />
        </PropertiesContainer>
        <NotesContainer>
          <hr />
          <Notes
            placeholder="Add notes here..."
            value={todo.notes}
            name="notes"
            onChange={handleChange}
          />
        </NotesContainer>
      </SidebarContainer>
    );
  }
};

Sidebar.propTypes = {};

export default Sidebar;
