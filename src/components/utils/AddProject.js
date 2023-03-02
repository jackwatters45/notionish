import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import { ProjectsContext } from '../MainContent';
import NewButton from './NewButton';

const AddProjectForm = styled.form`
  height: 30px;
  margin-top: 4px;
  width: 248px;
  border-radius: 4px;
  padding: 6px 2px;
  background-color: var(--section-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 2px 4px;
`;

const ProjectInput = styled.input`
  padding: 1px 2px;
  width: 100%;
`;

const StyledNewButton = styled(NewButton)`
  background-color: var(--section-background-color);
`;

const AddProject = () => {
  const { projects, setProjects } = useContext(ProjectsContext);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const handleClickAddProjectBtn = () => setIsAddingProject(true);

  const [project, setProject] = useState({ id: uniqid() });
  const handleChange = (e) => {
    setProject({ ...project, name: e.target.value });
  };
  const addProject = () => setProjects([...projects, project]);
  const handleSubmit = () => {
    addProject();
    setIsAddingProject(false);
  };

  return isAddingProject ? (
    <AddProjectForm onSubmit={handleSubmit}>
      <ProjectInput
        autoFocus
        placeholder="Name your project..."
        required={true}
        onChange={handleChange}
      />
    </AddProjectForm>
  ) : (
    <StyledNewButton
      onClick={handleClickAddProjectBtn}
      text={'Add New Project'}
    />
  );
};

export default AddProject;
