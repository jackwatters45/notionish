import React, { useState, useContext } from 'react';
import Todo from '../Todo';
import Icon from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import styled from 'styled-components';
import uniqid from 'uniqid';
import NewButton from '../../../utils/components/NewButton';
import ProjectTitle from './ProjectTitle';
import { DatabaseContext } from '../../../utils/context/context';
import { getPropertiesObj } from '../../../utils/helpers/propertyHelpers';

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

const Project = ({ project, editedTodos }) => {
  const { todos, setTodos, removeProject, properties } =
    useContext(DatabaseContext);

  const handleAddTodo = () =>
    setTodos([
      ...todos,
      { name: '', id: uniqid(), notes: '', ...getPropertiesObj(properties) },
    ]);

  const [trashIconStatus, setTrashIconStatus] = useState('none');
  const handleMouseEnter = () => setTrashIconStatus('block');
  const handleMouseLeave = () => setTrashIconStatus('none');

  return (
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
        {editedTodos &&
          editedTodos.map(
            (todo) =>
              todo.project.id === project.id && (
                <Todo todo={todo} key={todo.id} />
              ),
          )}
      </TodosContainer>
      <NewButton onClick={handleAddTodo} text={'New'} />
    </ProjectContainer>
  );
};

export default Project;
