/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar/Sidebar';
import ViewsNav from '../Views/ViewsNav';
import DatabaseContent from '../DatabaseTypes/DatabaseContent';
import sortFunction from '../Views/Sort/sortHelpers';
import { DatabaseContext, SidebarContext } from '../../context/context';
import { applyFilters } from '../Views/Filter/filterHelpers';
import useArrayOfObjects from '../utils/custom/useArrayOfObjects';
import { collection, getDocs } from 'firebase/firestore';
import { Routes, Route, Navigate } from 'react-router-dom';

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 0 50px;
  overflow: hidden;
`;

const MainContent = ({ userDbRef }) => {
  // fetching Data
  const [dbItems, setDbItems, removeDbItem, addDbItem] = useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const fetchDbItems = async () => {
      const dbItemsRef = collection(userDbRef, 'dbItems');
      const dbItemsSnapshot = await getDocs(dbItemsRef);
      const newDbItemsArr = dbItemsSnapshot.docs.map((doc) => {
        const { id } = doc;
        const { created, ...docData } = doc.data();
        // Move this date part to the actual display or something
        return { id, ...docData, created: new Date(created.seconds * 1000) };
      });
      setDbItems(newDbItemsArr);
    };
    fetchDbItems();
  }, [setDbItems, userDbRef]);

  const [views, setViews, removeView, addView] = useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const fetchView = async () => {
      const viewsRef = collection(userDbRef, 'views');
      const viewsSnapshot = await getDocs(viewsRef);
      const newViewsArr = viewsSnapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      setViews(newViewsArr);
    };
    fetchView();
  }, [setViews, userDbRef]);

  const [properties, setProperties, removeProperty, addProperty] =
    useArrayOfObjects();
  useEffect(() => {
    if (!userDbRef) return;
    const fetchProperties = async () => {
      const propsCollection = collection(userDbRef, 'properties');
      const propsSnapshot = await getDocs(propsCollection);
      const newPropertiesArr = propsSnapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      setProperties(newPropertiesArr);
    };
    fetchProperties();
  }, [setProperties, userDbRef]);

  const databaseValues = {
    userDbRef,
    views,
    setViews,
    removeView,
    addView,
    dbItems,
    setDbItems,
    removeDbItem,
    addDbItem,
    properties,
    setProperties,
    removeProperty,
    addProperty,
  };

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
  }, [selectedView, dbItems, views]);

  const [editedTodos, setEditedTodos] = useState(dbItems);
  useEffect(() => {
    if (!selectedView) return;

    let newTodos = dbItems;
    if (selectedView.filter.length)
      newTodos = applyFilters(newTodos, selectedView.filter);
    if (selectedView.sort.length)
      newTodos = sortFunction(newTodos, selectedView.sort);

    setEditedTodos(newTodos);
  }, [selectedView, dbItems, views]);

  const sidebarValues = {
    isSidebarVisible,
    closeSidebar,
    selectedTodo,
    toggleSidebar,
    setIsPopupVisible,
  };

  if (!views.length) return;
  console.log(views);
  return (
    <>
      <DatabaseContext.Provider value={databaseValues}>
        <SidebarContext.Provider value={sidebarValues}>
          <MainContentContainer style={{ width: getContentWidth() }}>
            <ViewsNav handleClickUnselectedView={handleClickUnselectedView} />

            <DatabaseContent
              selectedView={selectedView}
              editedTodos={editedTodos}
            />
          </MainContentContainer>

          <Sidebar
            ref={sidebarRef}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
            closeSidebar={closeSidebar}
            isSidebarVisible={isSidebarVisible}
          />
        </SidebarContext.Provider>
      </DatabaseContext.Provider>
    </>
  );
};

export default MainContent;
