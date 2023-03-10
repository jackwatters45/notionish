import React, { createContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AddProject from './Project/AddProject';
import Project from './Project/Project';
import { defaultProperties } from './utils/helpers/propertyHelpers';
import Sidebar from './Sidebar/Sidebar';
import useArrayOfObjects from './utils/custom/useArrayOfObjects';
import ViewsNav from './Views/ViewsNav';
import { defaultViews } from './utils/helpers/viewHelpers';

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 0 50px;
`;

const ProjectContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  overflow: auto;
`;

export const ViewsContext = createContext({});
export const ProjectsContext = createContext({});
export const TodosContext = createContext({});
export const SidebarContext = createContext({});
export const PropertiesContext = createContext({});

const testProjects = [
  {
    id: 'le6tmu59',
    name: 'Project 1',
  },
  {
    id: 'le6tmu60',
    name: 'Project 2',
  },
];

const MainContent = () => {
  const sidebarRef = useRef();

  const [views, setViews, removeView, addView] =
    useArrayOfObjects(defaultViews);

  const [projects, setProjects, removeProject, addProject] =
    useArrayOfObjects(testProjects); // TODO replace initial

  const [todos, setTodos, removeTodo, addTodo] = useArrayOfObjects();

  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects(defaultProperties);

  const [selectedTodo, setSelectedTodo] = useState();
  // TODO can i make use the popup hook for this pls - idk this is just ugly
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const closeSidebar = () => setIsSidebarVisible(false);
  const handleRemoveTodoAndSidebar = () => {
    if (selectedTodo) removeTodo(selectedTodo.id);
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

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSidebarVisible &&
        !isPopupVisible &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.className.includes('card')
      ) {
        closeSidebar();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSidebarVisible && !isPopupVisible)
        closeSidebar();
    };
    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isPopupVisible, isSidebarVisible]);

  return (
    <>
      <ViewsContext.Provider value={{ views, setViews, removeView, addView }}>
        <ProjectsContext.Provider
          value={{ projects, setProjects, removeProject, addProject }}
        >
          <TodosContext.Provider
            value={{ todos, setTodos, removeTodo, addTodo }}
          >
            <PropertiesContext.Provider
              value={{ properties, setProperties, removeProperty, addProperty }}
            >
              <SidebarContext.Provider
                value={{
                  isSidebarVisible,
                  closeSidebar,
                  handleRemoveTodoAndSidebar,
                  selectedTodo,
                  toggleSidebar,
                  setIsPopupVisible,
                }}
              >
                <MainContentContainer>
                  <ViewsNav />
                  <ProjectContainer>
                    {projects &&
                      projects.map((project) => (
                        <Project project={project} key={project.id} />
                      ))}
                    <AddProject projects={projects} setProjects={setProjects} />
                  </ProjectContainer>
                </MainContentContainer>
                <Sidebar
                  ref={sidebarRef}
                  isSidebarVisible={isSidebarVisible}
                  closeSidebar={closeSidebar}
                  todo={selectedTodo}
                />
              </SidebarContext.Provider>
            </PropertiesContext.Provider>
          </TodosContext.Provider>
        </ProjectsContext.Provider>
      </ViewsContext.Provider>
    </>
  );
};

export default MainContent;
