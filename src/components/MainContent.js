import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar/Sidebar';
import ViewsNav from './Views/ViewsNav';
import DatabaseContent from './DatabaseTypes/DatabaseContent';
import sortFunction from './Views/Sort/sortHelpers';
import { DatabaseContext, SidebarContext } from '../context/context';
import { applyFilters } from './Views/Filter/filterHelpers';

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 0 50px;
  overflow: hidden;
`;

const MainContent = () => {
  const { todos, views } = useContext(DatabaseContext);

  const sidebarRef = useRef();

  const [selectedTodo, setSelectedTodo] = useState();
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

  const [selectedView, setSelectedView] = useState();
  const handleClickUnselectedView = (view) => setSelectedView(view);
  useEffect(() => {
    if (!views.find((view) => view === selectedView)) setSelectedView(views[0]);
  }, [selectedView, todos, views]);

  const [editedTodos, setEditedTodos] = useState(todos);
  useEffect(() => {
    if (!selectedView) return;

    let newTodos = todos;
    if (selectedView.filter.length)
      newTodos = applyFilters(newTodos, selectedView.filter);
    if (selectedView.sort.length)
      newTodos = sortFunction(newTodos, selectedView.sort);

    setEditedTodos(newTodos);
  }, [selectedView, todos, views]);

  const sidebarValues = {
    isSidebarVisible,
    closeSidebar,
    selectedTodo,
    toggleSidebar,
    setIsPopupVisible,
  };

  return (
    <>
      <SidebarContext.Provider value={sidebarValues}>
        <MainContentContainer style={{ width: getContentWidth() }}>
          <ViewsNav
            selectedView={selectedView}
            handleClickUnselectedView={handleClickUnselectedView}
          />
          {selectedView && (
            <DatabaseContent
              selectedView={selectedView}
              editedTodos={editedTodos}
            />
          )}
        </MainContentContainer>
        <Sidebar
          ref={sidebarRef}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
        />
      </SidebarContext.Provider>
    </>
  );
};

export default MainContent;
