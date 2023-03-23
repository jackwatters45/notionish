import React, { useState, useContext, useEffect } from 'react';
import Todo from '../Todo';
import Icon from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import styled from 'styled-components';
import uniqid from 'uniqid';
import NewButton from '../../../utils/components/NewButton';
import ProjectTitle from './ProjectTitle';
import { DatabaseContext } from '../../../utils/context/context';
import { getPropertiesObj } from '../../../utils/helpers/propertyHelpers';
import { useDrop } from 'react-dnd';

const ProjectContainer = styled.div`
  margin: 4px;
  width: 260px;
  background-color: var(--section-background-color);
  height: fit-content;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: inherit;
  align-items: center;
  padding: 2px;
  margin-bottom: 2px;
`;

const TrashIcon = styled(Icon)`
  color: var(--secondary-font-color);
  padding: 1px;
  border-radius: 4px;
  margin-right: 8px;
  &:hover {
    background-color: var(--card-hover-background-color);
  }
`;

const TodosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledNewButton = styled(NewButton)`
  margin-top: 4px;
`;

const Project = ({ project, editedTodos, dragHeight, selectedView }) => {
  const { todos, setTodos, removeProject, properties } =
    useContext(DatabaseContext);

  const [projectTodos, setProjectTodos] = useState([]);
  useEffect(() => {
    if (!editedTodos) return;
    const projectTodoArr = editedTodos.filter(({ project: todoProj }) => {
      const { id, name } = project;
      return !todoProj ? name === 'No Status' : todoProj.id === id;
    });
    setProjectTodos(projectTodoArr);
  }, [editedTodos, project]);

  const handleAddTodo = () =>
    setTodos([
      ...todos,
      {
        name: '',
        id: uniqid(),
        notes: '',
        ...getPropertiesObj(properties),
        project: project,
      },
    ]);

  const [trashIconStatus, setTrashIconStatus] = useState('none');
  const handleMouseEnter = () => setTrashIconStatus('block');
  const handleMouseLeave = () => setTrashIconStatus('none');

  const dropItem = ({ todoId }, offset) => {
    const dbCopy = [...todos];
    const droppedItem = dbCopy.find(({ id }) => todoId === id);
    droppedItem.project = project;

    const { y } = offset;
    const firstItemStart = 210;
    const tablePositionY = y - firstItemStart;

    const rowHeight = 71.19;
    let newIndex = Math.floor(tablePositionY / rowHeight);

    if (newIndex < 0) newIndex = 0;
    if (newIndex > projectTodos.length - 1) newIndex = projectTodos.length - 1;

    dbCopy.splice(dbCopy.indexOf(droppedItem), 1);
    dbCopy.splice(newIndex, 0, droppedItem);

    setTodos(dbCopy);
  };

  const [forbidDrop, setForbidDrop] = useState(false);
  useEffect(() => {
    if (!selectedView) return;
    setForbidDrop(!!selectedView.sort.length);
  }, [selectedView]);

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: 'dbItem',
      canDrop: () => !forbidDrop,
      collect: (monitor) => ({ opacity: !!monitor.isOver() ? 0.75 : 1 }),
      drop: (item, monitor) => dropItem(item, monitor.getClientOffset()),
    }),
    [],
  );

  return (
    <dropcontainer ref={drop} style={{ minHeight: `${dragHeight}px`, opacity }}>
      <ProjectContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Header>
          <ProjectTitle project={project} />
          <TrashIcon
            style={{ display: trashIconStatus }}
            path={mdiDeleteOutline}
            size={0.75}
            onClick={() => removeProject(project.id)}
          />
        </Header>
        <TodosContainer>
          {projectTodos &&
            projectTodos.map((todo) => {
              return <Todo todo={todo} key={todo.id} />;
            })}
        </TodosContainer>
        <StyledNewButton onClick={handleAddTodo} text={'New'} />
      </ProjectContainer>
    </dropcontainer>
  );
};

export default Project;
