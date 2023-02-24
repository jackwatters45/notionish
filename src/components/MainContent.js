import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AddProject from './AddProject';
import Project from './Project';
import Sidebar from './Sidebar/Sidebar';

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
export const SidebarContext = createContext({});

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

  const [todos, setTodos] = useState(testTodos); // TODO replace initial
  const handleRemoveTodo = (id) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const [selectedTodo, setSelectedTodo] = useState();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const closeSidebar = () => setIsSidebarVisible(false);
  const toggleSidebar = (e, todo) => {
    const isCurrentlyOpen = () =>
      isSidebarVisible &&
      (e.target.outerHTML.includes(selectedTodo.name) ||
        e.target.parentElement.outerHTML.includes(selectedTodo.name));
    if (isCurrentlyOpen()) return setIsSidebarVisible(false);

    setIsSidebarVisible(true);
    setSelectedTodo(todo);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSidebarVisible &&
        !e.target.closest('.sidebar') &&
        !e.target.className.includes('card') &&
        !e.target.parentElement.className.includes('card')
      )
        setIsSidebarVisible(false);
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isSidebarVisible]);

  return (
    <MainContentContainer>
      <TodosContext.Provider value={{ todos, setTodos, handleRemoveTodo }}>
        <SidebarContext.Provider
          value={{
            isSidebarVisible,
            closeSidebar,
            selectedTodo,
            toggleSidebar,
          }}
        >
          <ProjectsContext.Provider value={{ projects, setProjects }}>
            <ProjectContainer>
              {projects.map((project) => (
                <Project
                  project={project}
                  key={project.id}
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
        </SidebarContext.Provider>
      </TodosContext.Provider>
    </MainContentContainer>
  );
};

export default MainContent;
