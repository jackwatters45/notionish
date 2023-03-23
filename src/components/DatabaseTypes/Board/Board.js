import React, { useContext } from 'react';
import styled from 'styled-components';
import Project from './Project/Project';
import AddProject from './Project/AddProject';
import { DatabaseContext } from '../../utils/context/context';

const ProjectContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const Board = ({ editedTodos }) => {
  const { projects } = useContext(DatabaseContext);

  return (
    <ProjectContainer>
      {projects &&
        projects.map((project) => (
          <Project
            project={project}
            key={project.id}
            editedTodos={editedTodos}
          />
        ))}
      <Project
        project={{ name: 'No Status', id: -1 }}
        editedTodos={editedTodos}
      />
      <AddProject width={260} />
    </ProjectContainer>
  );
};

export default Board;
