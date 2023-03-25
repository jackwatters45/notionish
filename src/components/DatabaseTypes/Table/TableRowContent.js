import { mdiPageLayoutSidebarRight, mdiDrag } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useContext, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { DatabaseContext, SidebarContext } from '../../../context/context';
import propertyData from '../../utils/helpers/propertyHelpers';
import NameProperty from '../../Properties/NameProperty';
import { useDrag } from 'react-dnd';

const ContainerDiv = styled.div`
  width: calc(100vw - 50px);
  margin-left: -50px;
  display: flex;
  align-items: center;
  &:before {
    height: 35px;
    position: absolute;
    width: 50px;
    content: ' ';
    display: block;
  }
  &:after {
    position: absolute;
    right: 0;
    height: 35px;
    width: 50px;
    content: ' ';
    display: block;
  }
`;

export const sharedRow = css`
  margin-left: 50px;
  display: flex;
  width: calc(100% - 50px);
  background: rgb(25, 25, 25);
  min-height: 33px;
  color: rgba(255, 255, 255, 0.443);
  border-top: 1px solid rgb(47, 47, 47);
  box-shadow: rgb(25 25 25) -3px 0px 0px, rgb(47 47 47) 0px 1px 0px;
  & > *:hover {
    background-color: rgba(255, 255, 255, 0.055);
  }
`;

export const nameColumn = css`
  overflow: hidden;
  display: flex;
  width: 275px;
  border-right: 1px solid rgba(255, 255, 255, 0.094);
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
`;

export const propertyColumns = css`
  overflow: hidden;
  display: flex;
  width: 200px;
  border-right: 1px solid rgba(255, 255, 255, 0.094);
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
  gap: 6px;
`;

const TableRow = styled.div`
  ${sharedRow}
  color: var(--main-font-color);
`;

const RowName = styled.div`
  ${nameColumn}
  font-weight: 700;
  &:focus-within {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

const RowCell = styled.div`
  ${propertyColumns}
  &:focus-within {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

const StyledSidebarButton = styled.button`
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.11);
  }
`;

const DragButton = styled.div`
  position: absolute;
  display: flex;
  margin-left: 25px;
  margin-bottom: 2px;
  transition: background 20ms ease-in 0s;
`;

const TableRowContent = (props) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { properties } = useContext(DatabaseContext);
  const { todo } = props;
  const itemRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => setIsHovered(false);

  const [{ opacity }, drag, dragPreview] = useDrag(() => ({
    type: 'dbItem',
    item: { todoId: todo.id },
    collect: (monitor) => ({ opacity: !!monitor.isDragging() ? 0.5 : 1 }),
  }));

  return (
    <ContainerDiv
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={todo.id}
    >
      {isHovered && (
        <DragButton ref={drag}>
          <Icon path={mdiDrag} size={1} color={'var(--empty-font-color'} />
        </DragButton>
      )}
      <TableRow ref={dragPreview} style={{ opacity }}>
        <RowName>
          <NameProperty name={'name'} data={todo} />
          {isHovered && (
            <StyledSidebarButton
              className="dbItem"
              onClick={(e) => toggleSidebar(e, todo)}
            >
              <Icon path={mdiPageLayoutSidebarRight} size={0.525} />
              OPEN
            </StyledSidebarButton>
          )}
        </RowName>
        {properties.map((property) => {
          const { id, type, name } = property;
          const { getComponent } = propertyData[type];
          return (
            <RowCell ref={itemRef} key={id}>
              {getComponent(name, todo)}
            </RowCell>
          );
        })}
      </TableRow>
    </ContainerDiv>
  );
};

export default TableRowContent;
