import React, { useState, useContext, useEffect, useMemo } from 'react';
import DbItemCard from '../DbItemCard';
import Icon from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import NewButton from '../../../utils/components/NewButton';
import GroupTitle from './GroupTitle';
import { DatabaseContext } from '../../../../context/context';
import { getPropertiesObj } from '../../../utils/helpers/propertyHelpers';
import { useDrop } from 'react-dnd';
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
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

const Group = (props) => {
  const {
    group,
    groups,
    propertyName,
    propertyId,
    editedTodos,
    dragHeight,
    selectedView,
    removeGroup,
  } = props;
  const { userDbRef, addDbItem, dbItems, setDbItems, properties } =
    useContext(DatabaseContext);

  const [groupDbItems, setGroupDbItems] = useState([]);
  // chat gpt suggested memoizing the filtered edited todos
  const filteredEditedTodos = useMemo(() => {
    return editedTodos.filter((dbItemGroup) => {
      return !group
        ? !dbItemGroup[propertyName]
        : dbItemGroup[propertyName]?.id === group.id;
    });
  }, [editedTodos, group, propertyName]);
  useEffect(() => {
    setGroupDbItems(filteredEditedTodos);
  }, [filteredEditedTodos]);

  const handleAddDbItem = async () => {
    const newDbItem = {
      name: '',
      id: uuid(),
      notes: '',
      ...getPropertiesObj(properties),
      project: group,
    };

    addDbItem(newDbItem);
    await addDoc(collection(userDbRef, 'dbItems'), newDbItem);
  };

  // const updatedGroups = groups.map(({ id }) => {
  //   return group.id === id ? { ...group, name: groupNameInput } : group;
  // });

  // const batch = writeBatch(db);
  // const propertyRef = doc(userDbRef, 'properties', propertyId);
  // batch.update(propertyRef, { values: updatedGroups });

  // setDbItems((prev) =>
  //   prev.map((item) => {
  //     const updatedGroup = updatedGroups.find(
  //       ({ id }) => item[propertyName]?.id === id,
  //     );
  //     if (!updatedGroup) return item;

  //     const dbItemRef = doc(userDbRef, 'dbItems', item.id);
  //     batch.update(dbItemRef, { [propertyName]: updatedGroups });

  //     return { ...item, [propertyName]: updatedGroup };
  //   }),
  // );

  // await batch.commit();

  // batch - added using suggestion generated from ChatGpt
  const handleRemoveGroup = async (groupId) => {
    // remove group from properties
    const _updatedGroups = ''
    const updatedGroups = removeGroup(groupId);
    const dbItemsCopy = [...dbItems];

    const batch = writeBatch(db);
    const propertyRef = doc(userDbRef, 'properties', propertyId);
    batch.update(propertyRef, { values: updatedGroups });

    // update db items if necessary
    dbItemsCopy.forEach((item) => {
      if (updatedGroups.find(({ id }) => item[propertyName]?.id === id))
        return;

      item[propertyName] = null;

      const dbItemRef = doc(userDbRef, 'dbItems', item.id);
      batch.update(dbItemRef, { [propertyName]: null });
    });

    await batch.commit();
    setDbItems(dbItemsCopy);
  };

  const [isShowTrashIcon, setIsShowTrashIcon] = useState(false);
  const handleMouseEnter = () => setIsShowTrashIcon(true);
  const handleMouseLeave = () => setIsShowTrashIcon(false);

  // TODO no clue how to get dragged item id
  const dropItem = ({ dbItemId }, offset) => {
    const dbCopy = [...dbItems];
    const droppedItem = dbCopy.find(({ id }) => {
      console.log(id);
      console.log(dbItemId);
      return dbItemId === id;
    });

    droppedItem.project = group;

    const { y } = offset;
    const firstItemStart = 210;
    const tablePositionY = y - firstItemStart;

    const rowHeight = 71.19;
    let newIndex = Math.floor(tablePositionY / rowHeight);

    if (newIndex < 0) newIndex = 0;
    if (newIndex > groupDbItems.length - 1) newIndex = groupDbItems.length - 1;

    dbCopy.splice(dbCopy.indexOf(droppedItem), 1);
    dbCopy.splice(newIndex, 0, droppedItem);

    setDbItems(dbCopy);
  };

  const [forbidDrop, setForbidDrop] = useState(false);
  useEffect(() => {
    // if (!selectedView) return;
    setForbidDrop(!!selectedView.sort?.length);
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
            groups={groups}
            propertyName={propertyName}
            propertyId={propertyId}
            groupDbItems={groupDbItems}
          />
          <TrashIcon
            style={{ display: isShowTrashIcon ? 'block' : 'none' }}
            path={mdiDeleteOutline}
            size={0.75}
            onClick={() => handleRemoveGroup(group.id)}
          />
        </Header>
        <DbItemsContainer>
          {groupDbItems &&
            groupDbItems.map((dbItem) => (
              <DbItemCard dbItem={dbItem} key={dbItem.id} />
            ))}
        </DbItemsContainer>
        <StyledNewButton onClick={handleAddDbItem} text={'New'} />
      </GroupContainer>
    </div>
  );
};

export default Group;
