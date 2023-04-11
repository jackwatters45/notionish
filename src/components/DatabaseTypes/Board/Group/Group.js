import React, { useState, useContext, useCallback, useMemo } from 'react';
import DbItemCard from './DbItemCard';
import Icon from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import NewButton from '../../../utils/components/NewButton';
import GroupTitle from './GroupTitle/GroupTitle';
import { DatabaseContext } from '../../../../context/context';
import { getPropertiesObj } from '../../../utils/helpers/propertyHelpers';
import { useDrop } from 'react-dnd';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import useDnDPosition from '../../../utils/custom/useDnDPosition';

const GroupContainer = styled.div`
  margin: 4px;
  width: 260px;
  background-color: var(--section-background-color);
  height: fit-content;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: inherit;
  align-items: center;
  padding: 2px;
  margin-bottom: 2px;
`;

const TrashIcon = styled(Icon)`
  color: var(--secondary-font-color);
  cursor: pointer;
  padding: 1px;
  border-radius: 4px;
  margin-right: 8px;
  &:hover {
    background-color: var(--card-hover-background-color);
  }
`;

const DbItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledNewButton = styled(NewButton)`
  margin-top: 4px;
`;

const Group = ({
  group,
  selectedProperty,
  properties,
  setProperties,
  dbItems,
  setDbItems,
  addDbItem,
  removeDbItem,
  dragHeight,
  selectedView,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const { groupData, groupDbItems } = group;

  const handleAddDbItem = async () => {
    const newDbItem = {
      name: null,
      id: uuid(),
      notes: null,
      order: dbItems.length,
      ...getPropertiesObj(properties),
      [selectedProperty.name]: groupData,
    };

    addDbItem(newDbItem);

    if (!userDbRef) return;

    try {
      await setDoc(doc(userDbRef, 'dbItems', newDbItem.id), newDbItem);
    } catch (e) {
      console.log(e);
    }
  };

  const removeGroupFromProperty = useCallback(
    (updatedPropertyValues) => {
      const updatedProperty = {
        ...selectedProperty,
        values: updatedPropertyValues,
      };

      setProperties((prevProperties) =>
        prevProperties.map((property) => {
          return property.id === selectedProperty.id
            ? updatedProperty
            : property;
        }),
      );
    },
    [selectedProperty, setProperties],
  );

  const removeGroupFromPropertyBackend = useCallback(
    (batch, updatedPropertyValues) => {
      batch.update(doc(userDbRef, 'properties', selectedProperty.id), {
        values: updatedPropertyValues,
      });
    },
    [selectedProperty.id, userDbRef],
  );

  const updateDbItems = useCallback(
    (groupId) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((dbItem) => {
          return dbItem?.[selectedProperty.name]?.id === groupId
            ? { ...dbItem, [selectedProperty.name]: null }
            : dbItem;
        }),
      );
    },
    [selectedProperty, setDbItems],
  );
  const updateDbItemsBackend = useCallback(
    async (batch, groupId) => {
      try {
        const collectionRef = collection(userDbRef, 'dbItems');
        const q = query(
          collectionRef,
          where(`${selectedProperty.name}.id`, '==', groupId),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { [selectedProperty.name]: null });
        });
      } catch (e) {
        console.log(e);
      }
    },
    [selectedProperty, userDbRef],
  );

  const handleRemoveGroup = async (groupId) => {
    const batch = writeBatch(db);

    const updatedPropertyValues = selectedProperty.values.filter(
      ({ id }) => id !== groupId,
    );

    removeGroupFromProperty(updatedPropertyValues);
    updateDbItems(groupId);

    if (!userDbRef) return;

    try {
      removeGroupFromPropertyBackend(batch, updatedPropertyValues);
      await updateDbItemsBackend(batch, groupId);
      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  const [isShowTrashIcon, setIsShowTrashIcon] = useState(false);
  const handleMouseEnter = () => setIsShowTrashIcon(true);
  const handleMouseLeave = () => setIsShowTrashIcon(false);

  // Drag and Drop
  const firstItemStart = 227;
  const rowHeight = 74.19;
  const {
    getLocationNewGroup,
    getLocationSameGroup,
    updateDbItemOrder,
    updateDbItemOrderBackend,
    updateGroup,
    updateGroupBackend,
  } = useDnDPosition(firstItemStart, rowHeight, groupData, selectedProperty);

  const dropItem = ({ dbItemId }, offset) => {
    setDbItems((currentDbItems) => {
      const currentDbItemsCopy = [...currentDbItems];

      const updatedGroupItems = currentDbItemsCopy.filter((dbItem) => {
        if (!groupData) return !dbItem[selectedProperty.name];
        return dbItem[selectedProperty.name]?.id === groupData.id;
      });

      const draggedItemIndex = currentDbItemsCopy.findIndex(({ id }) => {
        return id === dbItemId;
      });
      const draggedItemId = currentDbItemsCopy[draggedItemIndex].id;

      // if group dragged into is empty, don't worry about order
      if (!updatedGroupItems.length) {
        const updatedDbItems = updateGroup(
          currentDbItemsCopy,
          draggedItemIndex,
        );

        if (userDbRef) updateGroupBackend(draggedItemId);

        return updatedDbItems;
      }

      // if dragged into new group not empty -> update group and order
      const isSameGroup = updatedGroupItems.some(({ id }) => id === dbItemId);
      if (!isSameGroup) {
        const updatedDbItems = updateGroup(
          currentDbItemsCopy,
          draggedItemIndex,
        );

        const targetDbItemIndex = getLocationNewGroup(
          updatedDbItems,
          updatedGroupItems,
          draggedItemIndex,
          offset,
        );

        if (targetDbItemIndex === null) {
          if (userDbRef) updateGroupBackend(draggedItemId);
          return updatedDbItems;
        }

        const updatedOrder = updateDbItemOrder(
          updatedDbItems,
          draggedItemIndex,
          targetDbItemIndex,
        );

        if (userDbRef) {
          updateGroupBackend(draggedItemId);
          const batch = writeBatch(db);
          updateDbItemOrderBackend(batch, updatedOrder);
        }

        return updatedOrder;
      }

      const targetDbItemIndex = getLocationSameGroup(
        updatedGroupItems,
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
    return !!selectedView.sort?.length;
  }, [selectedView?.sort?.length]);

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: 'dbItem',
      canDrop: () => !forbidDrop,
      collect: (monitor) => ({
        opacity: !!monitor.isOver() ? 0.75 : 1,
      }),
      drop: (item, monitor) => dropItem(item, monitor.getClientOffset()),
    }),
    [],
  );

  return (
    <div ref={drop} style={{ minHeight: `${dragHeight}px`, opacity }}>
      <GroupContainer
        onMouseEnter={groupData ? handleMouseEnter : undefined}
        onMouseLeave={groupData ? handleMouseLeave : undefined}
      >
        <Header>
          <GroupTitle
            group={group}
            groupData={groupData}
            setDbItems={setDbItems}
            properties={properties}
            setProperties={setProperties}
            groupDbItems={groupDbItems}
            selectedProperty={selectedProperty}
          />
          <TrashIcon
            style={{ display: isShowTrashIcon ? 'block' : 'none' }}
            path={mdiDeleteOutline}
            size={0.75}
            onClick={() => handleRemoveGroup(groupData.id)}
          />
        </Header>
        <DbItemsContainer>
          {groupDbItems &&
            groupDbItems.map((dbItem) => (
              <DbItemCard
                key={dbItem.id}
                dbItem={dbItem}
                setDbItems={setDbItems}
                removeDbItem={removeDbItem}
              />
            ))}
        </DbItemsContainer>
        <StyledNewButton onClick={handleAddDbItem} text={'New'} />
      </GroupContainer>
    </div>
  );
};

export default Group;
