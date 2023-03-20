import React, { useContext } from 'react';
import styled from 'styled-components';
import Project from './Project/Project';
import AddProject from './Project/AddProject';
import { DatabaseContext } from '../../utils/context/context';

const ProjectContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  overflow: auto;
`;

// Technically if group by property show all options but if text etc ->  just map through the todo options
const Board = ({ editedTodos }) => {
  const { projects } = useContext(DatabaseContext);

  // TODO if property is a select -> options held in the property array
  return (
    <div>
      <ProjectContainer>
        {projects &&
          projects.map((project) => (
            <Project
              project={project}
              key={project.id}
              editedTodos={editedTodos}
            />
          ))}

        <AddProject width={260} />
      </ProjectContainer>
    </div>
  );
};

export default Board;
