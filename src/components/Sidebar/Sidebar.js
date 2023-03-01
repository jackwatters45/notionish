import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDoubleRight } from '@mdi/js';
import SidebarContents from './SidebarContents';
import { SidebarContext } from '../MainContent';

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

const Sidebar = () => {
  const { isSidebarVisible, closeSidebar } = useContext(SidebarContext);

  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const startResizing = useCallback(() => setIsResizing(true), []);
  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing)
        setSidebarWidth(
          Math.min(
            Math.max(
              400,
              sidebarRef.current.getBoundingClientRect().right -
                mouseMoveEvent.clientX,
            ),
            (document.body.clientWidth * 2) / 3,
          ),
        );
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  if (isSidebarVisible) {
    return (
      <SidebarContainer
        className="sidebar"
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
      >
        <Dragger onMouseDown={startResizing} />
        <CloseButton
          onClick={closeSidebar}
          path={mdiChevronDoubleRight}
          size={1}
        />
        <SidebarContents />
      </SidebarContainer>
    );
  }
};

export default Sidebar;
