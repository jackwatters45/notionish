import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AddProject from './utils/AddProject';
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

// const testTodos = [
//   {
//     name: { value: 'Todo 1', html: 'Todo 1' },
//     id: 'le6tim0g',
//     project: {
//       id: 'le6tmu59',
//       name: 'Project 1',
//     },
//     priority: { value: 'High', html: 'High' },
//     date: new Date(),
//     created: new Date(),
//     notes: { value: '', html: '' },
//   },
// ];

const MainContent = () => {
  const [projects, setProjects] = useState(testProjects); // TODO replace initial
  const removeProject = (projectId) => {
    setProjects(projects.filter(({ id }) => id !== projectId));
  };

  const [todos, setTodos] = useState('');
  const [selectedTodo, setSelectedTodo] = useState();
  const handleRemoveTodo = (id) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const closeSidebar = () => setIsSidebarVisible(false);
  const handleRemoveTodoAndSidebar = () => {
    handleRemoveTodo(selectedTodo.id);
    closeSidebar();
  };
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
            handleRemoveTodoAndSidebar,
            selectedTodo,
            toggleSidebar,
          }}
        >
          <ProjectContainer>
            {projects &&
              projects.map((project) => (
                <Project
                  project={project}
                  key={project.id}
                  removeProject={removeProject}
                />
              ))}
          </ProjectContainer>
          <AddProject projects={projects} setProjects={setProjects} />
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
