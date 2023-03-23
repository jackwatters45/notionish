import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Project from './Project/Project';
import AddProject from './Project/AddProject';
import { DatabaseContext } from '../../utils/context/context';

const ProjectContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  height: 100%;
`;

const Board = ({ editedTodos, selectedView }) => {
  const { projects } = useContext(DatabaseContext);

  const projectContainerRef = useRef();
  const [maxHeight, setMaxHeight] = useState();
  useEffect(() => {
    if (!projectContainerRef.current) return;
    setMaxHeight(projectContainerRef.current.offsetHeight);
  }, [projects]);

  

  return (
    <ProjectContainer ref={projectContainerRef}>
      {projects &&
        projects.map((project) => (
          <Project
            project={project}
            key={project.id}
            editedTodos={editedTodos}
            dragHeight={maxHeight}
            selectedView={selectedView}
          />
        ))}
      <Project
        project={{ name: 'No Status', id: -1 }}
        editedTodos={editedTodos}
        dragHeight={maxHeight}
        selectedView={selectedView}
      />
      <AddProject width={260} />
    </ProjectContainer>
  );
};

export default Board;
