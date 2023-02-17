import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { ProjectsContext } from './MainContent';
import uniqid from 'uniqid'

const addProjectContainer = [
  `
  height: 30px;
  margin: 4px;
  width: 250px;
  border-radius: 4px;
  padding: 6px;
  background-color: var(--section-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 2px 4px;

`,
];

const AddProjectForm = styled.form(addProjectContainer);
const AddProjectButton = styled.button(addProjectContainer);

const ProjectInput = styled.input`
  padding: 1px 0;
  width: 100%;
`;

const AddProject = () => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const handleClickAddProjectBtn = () => setIsAddingProject(true);

  const { projects, setProjects } = useContext(ProjectsContext);
  const addProject = () => setProjects([...projects, project]);

  const [project, setProject] = useState({id: uniqid()});
  const handleChange = (e) => setProject({ ...project, name: e.target.value });
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
    <AddProjectButton onClick={handleClickAddProjectBtn}>
      <Icon path={mdiPlus} size={0.75} />
      <p>Add New Project</p>
    </AddProjectButton>
  );
};

export default AddProject;
