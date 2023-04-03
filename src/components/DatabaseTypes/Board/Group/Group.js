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

// make sure everything is actually being used
const Group = ({
  group,
  selectedProperty,
  properties,
  setProperties,
  addDbItem,
  setDbItems,
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
      ...getPropertiesObj(properties),
      [selectedProperty.name]: groupData,
    };

    try {
      addDbItem(newDbItem);
      await setDoc(doc(userDbRef, 'dbItems', newDbItem.id), newDbItem);
    } catch (e) {
      console.log(e);
    }
  };

  const removeGroupFromProperty = useCallback(
    (groupId, batch) => {
      const updatedPropertyValues = selectedProperty.values.filter(
        ({ id }) => id !== groupId,
      );

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

      batch.update(doc(userDbRef, 'properties', selectedProperty.id), {
        values: updatedPropertyValues,
      });
    },
    [selectedProperty, setProperties, userDbRef],
  );

  const updateDbItems = useCallback(
    async (groupId, batch) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((dbItem) => {
          return dbItem?.[selectedProperty.name]?.id === groupId
            ? { ...dbItem, [selectedProperty.name]: null }
            : dbItem;
        }),
      );

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
    [selectedProperty, setDbItems, userDbRef],
  );

  const handleRemoveGroup = async (groupId) => {
    const batch = writeBatch(db);

    removeGroupFromProperty(groupId, batch);
    await updateDbItems(groupId, batch);

    try {
      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  const [isShowTrashIcon, setIsShowTrashIcon] = useState(false);
  const handleMouseEnter = () => setIsShowTrashIcon(true);
  const handleMouseLeave = () => setIsShowTrashIcon(false);

  // TODO useMemo (maybe idk thats what auto complete said??)
  const dropItem = ({ dbItemId }, offset) => {
    // const dbCopy = [...dbItems];
    // const droppedItem = dbCopy.find(({ id }) => {
    //   console.log(id);
    //   console.log(dbItemId);
    //   return dbItemId === id;
    // });
    // droppedItem.project = group;
    // const { y } = offset;
    // const firstItemStart = 210;
    // const tablePositionY = y - firstItemStart;
    // const rowHeight = 71.19;
    // let newIndex = Math.floor(tablePositionY / rowHeight);
    // if (newIndex < 0) newIndex = 0;
    // if (newIndex > groupDbItems.length - 1) newIndex = groupDbItems.length - 1;
    // dbCopy.splice(dbCopy.indexOf(droppedItem), 1);
    // dbCopy.splice(newIndex, 0, droppedItem);
    // setDbItems(dbCopy);
  };

  // TODO useMemo
  const forbidDrop = useMemo(() => {
    return !!selectedView.sort?.length;
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
    <div ref={drop} style={{ minHeight: `${dragHeight}px`, opacity }}>
      <GroupContainer
        onMouseEnter={group ? handleMouseEnter : undefined}
        onMouseLeave={group ? handleMouseLeave : undefined}
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
              />
            ))}
        </DbItemsContainer>
        <StyledNewButton onClick={handleAddDbItem} text={'New'} />
      </GroupContainer>
    </div>
  );
};

export default Group;
