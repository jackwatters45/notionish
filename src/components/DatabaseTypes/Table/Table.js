import React, { useCallback, useContext, useMemo } from 'react';
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
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase';
import useDnDPosition from '../../utils/custom/useDnDPosition';

const Container = styled.div`
  min-width: fit-content;
  width: 100%;
  user-select: none;
  padding-bottom: 50px;
`;

const sharedRow = css`
  display: flex;
  background: rgb(25, 25, 25);
  width: 100%;
  width: fit-content;
  min-height: 33px;
  color: rgba(255, 255, 255, 0.443);
  border-top: 1px solid rgb(47, 47, 47);
  box-shadow: rgb(25 25 25) -3px 0px 0px, rgb(47 47 47) 0px 1px 0px;
`;

const nameColumn = css`
  overflow: hidden;
  display: flex;
  min-width: 275px;
  width: 275px;
  border-right: 1px solid rgba(255, 255, 255, 0.094);
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
`;

const propertyColumns = css`
  width: 100%;
  overflow: hidden;
  display: flex;
  min-width: 200px;
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
  width: 100%;
`;

const HeaderCellName = styled(PropertyLabel)`
  ${nameColumn};
  cursor: default;
`;

const HeaderCell = styled(PropertyLabel)`
  ${propertyColumns}
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
  }
`;

const BottomRow = styled.div`
  ${sharedRow};
  width: 100%;
`;

const StyledNewButton = styled(NewButton)`
  margin: 0;
  padding: 0;
  height: 33px;
  width: 100%;
  &:hover {
    border-radius: 0;
    background-color: none;
  }
`;

const Table = ({
  editedDbItems,
  selectedView,
  properties,
  setProperties,
  addProperty,
  removeProperty,
  dbItems,
  setDbItems,
  addDbItem,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const addTodo = useCallback(async () => {
    const newDbItem = {
      name: null,
      id: uuid(),
      notes: null,
      order: dbItems.length,
      ...getPropertiesObj(properties),
    };
    addDbItem(newDbItem);

    if (!userDbRef) return;

    try {
      await setDoc(doc(userDbRef, 'dbItems', newDbItem.id), newDbItem);
    } catch (e) {
      console.log(e);
    }
  }, [addDbItem, dbItems.length, properties, userDbRef]);

  // Drag and Drop
  const firstItemStart = 220;
  const rowHeight = 35;
  const { updateDbItemOrder, updateDbItemOrderBackend, getLocationSameGroup } =
    useDnDPosition(firstItemStart, rowHeight);

  const dropItem = ({ dbItemId }, offset) => {
    setDbItems((currentDbItems) => {
      const currentDbItemsCopy = [...currentDbItems];

      const draggedItemIndex = currentDbItemsCopy.findIndex(({ id }) => {
        return id === dbItemId;
      });

      const targetDbItemIndex = getLocationSameGroup(
        currentDbItemsCopy,
        draggedItemIndex,
        offset,
      );

      if (targetDbItemIndex === null) return currentDbItemsCopy;

      const updatedOrder = updateDbItemOrder(
        currentDbItemsCopy,
        draggedItemIndex,
        targetDbItemIndex,
      );

      const batch = writeBatch(db);
      updateDbItemOrderBackend(batch, updatedOrder);

      return updatedOrder;
    });
  };

  const forbidDrop = useMemo(() => {
    return !!selectedView?.sort?.length;
  }, [selectedView?.sort?.length]);

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
          selectedProperty={{ name: 'Name' }}
          disabled={true}
        />
        {properties?.map((property) => {
          const { id, type } = property;
          const { icon } = propertyData[type];
          return (
            <HeaderCell
              key={id}
              icon={icon}
              selectedProperty={property}
              properties={properties}
              setProperties={setProperties}
              removeProperty={removeProperty}
              setDbItems={setDbItems}
            />
          );
        })}
        <AddNewPropertyTable
          properties={properties}
          addProperty={addProperty}
          setDbItems={setDbItems}
        />
      </Header>
      {editedDbItems?.map((dbItem) => (
        <TableRowContent
          key={dbItem.id}
          setDbItems={setDbItems}
          selectedDbItem={dbItem}
          properties={properties}
          setProperties={setProperties}
        />
      ))}
      <BottomRow>
        <StyledNewButton onClick={addTodo} text={'New'} />
      </BottomRow>
    </Container>
  );
};

export default Table;
