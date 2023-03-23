import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { mdiAlphabeticalVariant } from '@mdi/js';
import propertyData, {
  getPropertiesObj,
} from '../../utils/helpers/propertyHelpers';
import NewButton from '../../utils/components/NewButton';
import uniqid from 'uniqid';
import PropertyLabel from '../../Properties/Labels/PropertyLabel';
import AddNewPropertyTable from './AddNewPropertyTable';
import { DatabaseContext } from '../../utils/context/context';
import TableRowContent from './TableRowContent';

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

const Table = (props) => {
  const { todos, setTodos, properties } = useContext(DatabaseContext);
  const { editedTodos } = props;

  const addTodo = () => {
    setTodos([
      ...todos,
      { name: '', id: uniqid(), notes: '', ...getPropertiesObj(properties) },
    ]);
  };

  return (
    <Container>
      <Header>
        <HeaderCellName
          icon={mdiAlphabeticalVariant}
          name={'Name'}
          disabled={true}
        />
        {properties.map((property) => {
          const { name, id, type } = property;
          const { icon } = propertyData[type];
          return <HeaderCell key={id} name={name} icon={icon} data={''} />;
        })}
        <AddNewPropertyTable />
      </Header>
      {editedTodos.map((todo) => (
        <TableRowContent key={todo.id} todo={todo} />
      ))}
      <BottomRow>
        <StyledNewButton onClick={addTodo} text={'New'} />
      </BottomRow>
    </Container>
  );
};

export default Table;
