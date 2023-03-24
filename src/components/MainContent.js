import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { defaultProperties } from './utils/helpers/propertyHelpers';
import Sidebar from './Sidebar/Sidebar';
import useArrayOfObjects from './utils/custom/useArrayOfObjects';
import ViewsNav from './Views/ViewsNav';
import { defaultViews } from './utils/helpers/viewHelpers';
import DatabaseContent from './DatabaseTypes/DatabaseContent';
import sortFunction from './Views/Sort/sortHelpers';
import {
  DatabaseContext,
  SidebarContext,
  testProjects,
  testTodos,
} from './utils/context/context';

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 0 50px;
  overflow: hidden;
`;

const MainContent = () => {
  const sidebarRef = useRef();

  const [views, setViews, removeView, addView] =
    useArrayOfObjects(defaultViews);

  const [projects, setProjects, removeProject, addProject] =
    useArrayOfObjects(testProjects); // TODO replace initial

  const [todos, setTodos, removeTodo, addTodo] = useArrayOfObjects(testTodos);

  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects(defaultProperties);

  const [selectedTodo, setSelectedTodo] = useState();
  // TODO can i make use the popup hook for this pls - idk this is just ugly
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const getContentWidth = () =>
    `calc(100% - 100px - ${isSidebarVisible ? sidebarWidth : 0}px)`;
  const closeSidebar = () => setIsSidebarVisible(false);

  const toggleSidebar = (e, todo) => {
    const isCurrentlyOpen = () =>
      isSidebarVisible &&
      (e.target.outerHTML.includes(selectedTodo.name) ||
        e.target.parentElement.outerHTML.includes(selectedTodo.name));

    if (isCurrentlyOpen()) return setIsSidebarVisible(false);

    setSelectedTodo(todo);
    setIsSidebarVisible(true);
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSidebarVisible &&
        !isPopupVisible &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.className.includes('dbItem')
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

  const [selectedView, setSelectedView] = useState(views[0]);
  const [editedTodos, setEditedTodos] = useState(todos);
  const handleClickUnselectedView = (view) => setSelectedView(view);

  useEffect(() => {
    if (!views.find((view) => view === selectedView))
      return setSelectedView(views[0]);
  }, [selectedView, todos, views]);

  useEffect(() => {
    if (!selectedView) return;

    const { sort, filter } = selectedView;
    let newTodos = todos;

    const applyFilter = () => {
      filter.forEach(({ property, type, searchEl }) => {
        newTodos = newTodos.filter((todo) => {
          const filteredProperty = todo[property.id];
          return type.filterFunc(filteredProperty, searchEl, property.type);
        });
      });
    };
    if (filter.length) applyFilter();

    const applySort = () => (newTodos = sortFunction(newTodos, sort));
    if (sort.length) applySort();

    setEditedTodos(newTodos);
  }, [selectedView, todos, views]);

  const databaseValues = {
    views,
    setViews,
    removeView,
    addView,
    projects,
    setProjects,
    removeProject,
    addProject,
    todos,
    setTodos,
    removeTodo,
    addTodo,
    properties,
    setProperties,
    removeProperty,
    addProperty,
  };

  const sidebarValues = {
    isSidebarVisible,
    closeSidebar,
    selectedTodo,
    toggleSidebar,
    setIsPopupVisible,
  };

  return (
    <>
      <DatabaseContext.Provider value={databaseValues}>
        <SidebarContext.Provider value={sidebarValues}>
          <MainContentContainer style={{ width: getContentWidth() }}>
            <ViewsNav
              selectedView={selectedView}
              handleClickUnselectedView={handleClickUnselectedView}
            />
            <DatabaseContent
              selectedView={selectedView}
              editedTodos={editedTodos}
            />
          </MainContentContainer>
          <Sidebar
            ref={sidebarRef}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
          />
        </SidebarContext.Provider>
      </DatabaseContext.Provider>
    </>
  );
};

export default MainContent;
