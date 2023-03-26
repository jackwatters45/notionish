import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { mdiAlphabeticalVariant } from '@mdi/js';
import propertyData, {
  getPropertiesObj,
} from '../../utils/helpers/propertyHelpers';
import NewButton from '../../utils/components/NewButton';
import { v4 as uuid } from 'uuid';
import PropertyLabel from '../../Properties/Labels/PropertyLabel';
import AddNewPropertyTable from './AddNewPropertyTable';
import { DatabaseContext } from '../../../context/context';
import TableRowContent from './TableRowContent';
import { useDrop } from 'react-dnd';
import { addDoc, collection } from 'firebase/firestore';

const Container = styled.div`
  min-width: 100%;
  user-select: none;
  padding-bottom: 50px;
`;

const sharedRow = css`
  display: flex;
  background: rgb(25, 25, 25);
  width: 100%;
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
  const { editedTodos, selectedView } = props;
  const { userDbRef, dbItems, setDbItems, addDbItem, properties } =
    useContext(DatabaseContext);

  const addTodo = async () => {
    const newDbItem = {
      name: '',
      id: uuid(),
      notes: '',
      ...getPropertiesObj(properties),
    };

    addDbItem(newDbItem);
    await addDoc(collection(userDbRef, 'dbItems'), newDbItem);
  };

  const dropItem = ({ todoId }, offset) => {
    const dbCopy = [...dbItems];
    const droppedItem = dbCopy.find(({ id }) => todoId === id);

    const { y } = offset;
    const tableStart = 195;

    const tablePositionY = y - tableStart;
    const rowHeight = 35;
    const newIndex = Math.floor(tablePositionY / rowHeight);

    dbCopy.splice(dbCopy.indexOf(droppedItem), 1);
    dbCopy.splice(newIndex, 0, droppedItem);

    setDbItems(dbCopy);
  };

  const [forbidDrop, setForbidDrop] = useState(false);
  useEffect(() => {
    if (!selectedView) return;
    setForbidDrop(!!selectedView.sort.length);
  }, [selectedView]);

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: 'dbItem',
      canDrop: () => !forbidDrop,
      collect: (monitor) => ({ opacity: !!monitor.isOver() ? 0.75 : 1 }),
      drop: (item, monitor) => dropItem(item, monitor.getClientOffset()),
    }),
    [],
  );

  return (
    <Container ref={drop} style={{ opacity }}>
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
      {editedTodos.map((dbItem) => (
        <TableRowContent key={dbItem.id} dbItem={dbItem} />
      ))}
      <BottomRow>
        <StyledNewButton onClick={addTodo} text={'New'} />
      </BottomRow>
    </Container>
  );
};

export default Table;
