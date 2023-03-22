import { mdiPageLayoutSidebarRight } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { DatabaseContext, SidebarContext } from '../../utils/context/context';
import propertyData from '../../utils/helpers/propertyHelpers';
import NameProperty from '../../Properties/NameProperty';

export const sharedRow = css`
  display: flex;
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
`;

const RowCell = styled.div`
  ${propertyColumns}
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

const TableRowContent = (props) => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { properties } = useContext(DatabaseContext);

  const { todo } = props;

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <TableRow
      key={todo.name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <RowName>
        <NameProperty name={'name'} data={todo} autoFocus />
        {isHovered && (
          <StyledSidebarButton onClick={(e) => toggleSidebar(e, todo)}>
            <Icon path={mdiPageLayoutSidebarRight} size={0.525} />
            OPEN
          </StyledSidebarButton>
        )}
      </RowName>
      {properties.map((property) => {
        const { id, type, name } = property;
        const { getComponent } = propertyData[type];
        return <RowCell key={id}>{getComponent(name, todo)} </RowCell>;
      })}
    </TableRow>
  );
};

export default TableRowContent;
