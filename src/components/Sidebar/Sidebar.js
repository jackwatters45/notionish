import React, { useState, useLayoutEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDoubleRight } from '@mdi/js';
import SidebarContents from './SidebarContents';
import { useNavigate, useParams } from 'react-router-dom';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  display: grid;
  grid-template-columns: 5px auto;
  grid-template-rows: 36px auto;
  margin: auto;
  background: rgb(32, 32, 32);
  height: 100%;
  color: var(--secondary-font-color);
`;

const CloseButton = styled(Icon)`
  margin: 4px 4px 4px 0;
  cursor: pointer;
  grid-column: 2;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const Dragger = styled.div`
  grid-row: 1 /-1;
  cursor: col-resize;
`;

const Sidebar = ({
  sidebarWidth,
  setSidebarWidth,
  dbItems,
  setDbItems,
  properties,
  setProperties,
  addProperty,
  removeProperty,
  removeDbItem,
}) => {
  const { dbItemId } = useParams();

  const sidebarRef = useRef();

  const navigate = useNavigate();
  const navigateToParent = useCallback(() => navigate('../'), [navigate]);

  const isFirstRender = useRef(true);

  const [isResizing, setIsResizing] = useState(false);

  const stopResizing = useCallback(() => setIsResizing(false), []);
  const startResizing = useCallback(() => setIsResizing(true), []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (!isResizing) return;
      const distanceFromRight =
        sidebarRef.current.getBoundingClientRect().right -
        mouseMoveEvent.clientX;
      const minWidth = 400;
      const maxWidth = (document.body.clientWidth * 2) / 3;

      const newWidth = Math.max(minWidth, distanceFromRight);
      const clampedWidth = Math.min(newWidth, maxWidth);

      setSidebarWidth(clampedWidth);
    },
    [isResizing, sidebarRef, setSidebarWidth],
  );

  useLayoutEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useLayoutEffect(() => {
    const handleClick = (e) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (
        e.target.classList.contains(dbItemId) ||
        sidebarRef.current?.contains(e.target)
      )
        return;

      navigateToParent();
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') navigateToParent();
    };
    window.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dbItemId, navigateToParent, sidebarRef]);

  const handleClickClose = () => navigateToParent();

  return (
    <SidebarContainer ref={sidebarRef} style={{ width: sidebarWidth }}>
      <Dragger onMouseDown={startResizing} />
      <CloseButton
        onClick={handleClickClose}
        path={mdiChevronDoubleRight}
        size={1}
      />
      <SidebarContents
        dbItemId={dbItemId}
        dbItems={dbItems}
        setDbItems={setDbItems}
        properties={properties}
        setProperties={setProperties}
        addProperty={addProperty}
        removeProperty={removeProperty}
        removeDbItem={removeDbItem}
        handleClickClose={handleClickClose}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
