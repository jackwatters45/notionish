import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ViewsNav from './Views/ViewsNav';
import DatabaseContent from './DatabaseTypes/DatabaseContent';
import { Outlet, useMatch, useParams } from 'react-router-dom';
import { applyFilters } from './Views/Filter/filterHelpers';
import sortFunction from './Views/Sort/sortHelpers';

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin: 0 50px;
  overflow: hidden;
`;

const RootLayout = ({
  views,
  setViews,
  removeView,
  addView,
  properties,
  dbItems,
  sidebarWidth,
}) => {
  const { viewId } = useParams();
  const match = useMatch(`/${viewId}`);

  const selectedView = useMemo(() => {
    return views.find((item) => item.id === viewId) ?? views[0];
  }, [viewId, views]);

  const editedDbItems = useMemo(() => {
    let newTodos = dbItems;
    if (selectedView.filter?.length)
      newTodos = applyFilters(newTodos, selectedView.filter);

    if (selectedView.sort?.length)
      newTodos = sortFunction(newTodos, selectedView.sort);

    return newTodos;
  }, [selectedView, dbItems]);

  const contentWidth = useMemo(
    () => `calc(100% - 100px - ${!match ? sidebarWidth : 0}px)`,
    [match, sidebarWidth],
  );

  return (
    <>
      <MainContentContainer style={{ width: contentWidth }}>
        <ViewsNav
          selectedView={selectedView}
          views={views}
          setViews={setViews}
          removeView={removeView}
          addView={addView}
          properties={properties}
        />
        <DatabaseContent
          editedDbItems={editedDbItems}
          selectedView={selectedView}
          views={views}
        />
        <Outlet />
      </MainContentContainer>
    </>
  );
};

export default RootLayout;
