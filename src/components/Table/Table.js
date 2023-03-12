import Icon from '@mdi/react';
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { PropertiesContext, TodosContext } from '../MainContent';
import { mdiAlphabeticalVariant, mdiPlus } from '@mdi/js';
import propertyData from '../utils/helpers/propertyHelpers';
import NewButton from '../utils/components/NewButton';
import uniqid from 'uniqid';
import NameProperty from '../Properties/NameProperty';
import PropertyLabel from '../Properties/Labels/PropertyLabel';

const Container = styled.div`
  min-width: 100%;
  user-select: none;
  padding-bottom: 180px;
`;

const sharedRow = css`
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

const nameColumn = css`
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

const propertyColumns = css`
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

const Header = styled.div`
  ${sharedRow}
`;

const HeaderCellName = styled(PropertyLabel)`
  ${nameColumn};
`;

const HeaderCell = styled(PropertyLabel)`
  ${propertyColumns}
`;

const PlusHeader = styled.div`
  overflow: hidden;
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
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

const BottomRow = styled.div`
  ${sharedRow};
`;

const StyledNewButton = styled(NewButton)`
  margin: 0;
  padding: 0;
  height: 33px;
  &:hover {
    border-radius: 0;
    background-color: none;
  }
`;

const Table = () => {
  const { properties } = useContext(PropertiesContext);
  const { todos, setTodos } = useContext(TodosContext);

  const addTodo = () => {
    setTodos([
      ...todos,
      {
        name: '',
        id: uniqid(),
        notes: '',
        project: '',
        date: '',
        priority: '',
        created: new Date(),
        // {...properties},
      },
    ]);
  };

  // TODO little tab thing to open sidebar
  // TODO fix header rename stuff
  // header popups don't work
  // <PropertyLabel icon={icon} data={selectedTodo} name={name} />

  useEffect(() => {
    // console.log(todos)
  });

  return (
    <Container>
      <Header>
        {/* Technically probably don't want to be able to edit this */}
        <HeaderCellName icon={mdiAlphabeticalVariant} name={'Name'} />
        {properties.map((property) => {
          const { name, id, type } = property;
          const { icon } = propertyData[type];
          return <HeaderCell key={id} name={name} icon={icon} data={''} />;
        })}
        <PlusHeader>
          {/* TODO onClick add property */}
          <Icon path={mdiPlus} size={0.9} />
        </PlusHeader>
      </Header>
      {todos.map((todo) => (
        <TableRow key={todo.name}>
          <RowName>
            <NameProperty name={'name'} data={todo} autoFocus />
          </RowName>
          {properties.map((property) => {
            const { id, type, name } = property;
            const { getComponent } = propertyData[type];

            return <RowCell key={id}>{getComponent(name, todo)} </RowCell>;
          })}
        </TableRow>
      ))}
      <BottomRow>
        {/* TODO on clickAdd Todo and autofocus */}
        <StyledNewButton onClick={addTodo} text={'New'} />
      </BottomRow>
    </Container>
  );
};

export default Table;
