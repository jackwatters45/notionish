import React, { useState } from 'react';
import styled from 'styled-components';

const ProjectTitleText = styled.p`
  width: fit-content;
  border-radius: 4px;
  background-color: var(--card-background-color);
  padding: 0 6px;
`;

// TODO hover
// edit
const ProjectTitle = ({ name }) => {
  const [isEditing, setIsEditing] = useState();

  return <ProjectTitle>{name}</ProjectTitle>;
};

export default ProjectTitle;
