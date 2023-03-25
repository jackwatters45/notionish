import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  forwardRef,
} from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiChevronDoubleRight } from '@mdi/js';
import SidebarContents from './SidebarContents';
import { SidebarContext } from '../../context/context';

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

const Sidebar = forwardRef((props, ref) => {
  const { isSidebarVisible, closeSidebar } = useContext(SidebarContext);
  const { sidebarWidth, setSidebarWidth } = props;

  const [isResizing, setIsResizing] = useState(false);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const startResizing = useCallback(() => setIsResizing(true), []);
  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing)
        setSidebarWidth(
          Math.min(
            Math.max(
              400,
              ref.current.getBoundingClientRect().right -
                mouseMoveEvent.clientX,
            ),
            (document.body.clientWidth * 2) / 3,
          ),
        );

      // set
    },
    [isResizing, ref, setSidebarWidth],
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
      <SidebarContainer ref={ref} style={{ width: sidebarWidth }}>
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
});

export default Sidebar;
