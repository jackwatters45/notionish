import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import AddProject from './AddProject';
import Project from './Project';
import Sidebar from './Sidebar';

const MainContentContainer = styled.div`
  display: flex;
  height: fit-content;
  margin: 0 0 0 50px;
  overflow: auto;
`;

const ProjectContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

export const ProjectsContext = createContext({});
export const TodosContext = createContext({});

const testProjects = [
  {
    id: 'le6tmu59',
    name: 'Project 1',
  },
];

const testTodos = [
  {
    name: 'Todo 1',
    id: 'le6tim0g',
    project: {
      id: 'le6tmu59',
      name: 'Project 1',
    },
    priority: 'High',
    date: '2023-02-16T08:06:12.975Z',
    created: '2023-02-16T08:06:12.975Z',
    notes: '',
  },
  {
    name: 'Todo 2',
    id: 'le6tisov',
    project: {
      id: 'le6tmu59',
      name: 'Project 1',
    },
    priority: 'Low',
    date: '2023-02-16T08:06:21.631Z',
    created: '2023-02-16T08:06:21.631Z',
    notes: '',
  },
];
const MainContent = () => {
  const [projects, setProjects] = useState(testProjects); // TODO replace initial
  const removeProject = (projectId) => {
    setProjects(projects.filter(({ id }) => id !== projectId));
  };

  const [selectedTodo, setSelectedTodo] = useState();

  const [todos, setTodos] = useState(testTodos); // TODO replace initial
  const handleRemoveTodo = (id) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleSidebar = (todo) => {
    if (!todo.name) return;

    if (isSidebarVisible) return setIsSidebarVisible(false); // TODO check if different card clicked
    setIsSidebarVisible(true);
    setSelectedTodo(todo);
  };
  const closeSidebar = () => setIsSidebarVisible(false);

  return (
    <MainContentContainer>
      <TodosContext.Provider value={{ todos, setTodos, handleRemoveTodo }}>
        <ProjectsContext.Provider value={{ projects, setProjects }}>
          <ProjectContainer>
            {projects.map((project) => (
              <Project
                project={project}
                key={project.id}
                toggleSidebar={toggleSidebar}
                removeProject={removeProject}
              />
            ))}
          </ProjectContainer>
          <AddProject />
        </ProjectsContext.Provider>
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          closeSidebar={closeSidebar}
          todo={selectedTodo}
        />
      </TodosContext.Provider>
    </MainContentContainer>
  );
};

export default MainContent;
