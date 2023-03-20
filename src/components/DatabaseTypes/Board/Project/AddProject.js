import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import NewButton from '../../../utils/components/NewButton';
import { DatabaseContext } from '../../../utils/context/context';

const AddProjectForm = styled.form`
  height: 33.59px;
  margin: 4px;
  width: 248px;
  overflow: hidden;
  border-radius: 4px;
  padding: 6px 8px 6px 2px;
  // padding: 6px 2px;
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
  margin: 4px;
`;

const AddProject = ({ width }) => {
  const { projects, setProjects } = useContext(DatabaseContext);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const handleClickAddProjectBtn = () => setIsAddingProject(true);

  const addProject = () => setProjects([...projects, project]);

  const [project, setProject] = useState({ id: uniqid() });
  const handleChange = (e) => {
    setProject({ ...project, name: e.target.value });
  };
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
      width={width}
      onClick={handleClickAddProjectBtn}
      text={'Add New Project'}
    />
  );
};

export default AddProject;
