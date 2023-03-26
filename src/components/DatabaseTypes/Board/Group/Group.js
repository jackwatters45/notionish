import React, { useState, useContext, useEffect, useMemo } from 'react';
import DbItem from '../Todo';
import Icon from '@mdi/react';
import { mdiDeleteOutline } from '@mdi/js';
import styled from 'styled-components';
import { v5 as uuid } from 'uuid';
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
    propertyData,
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
    return editedTodos.filter((dbItemGroup) =>
      !group
        ? !dbItemGroup.propertyId
        : dbItemGroup.propertyId?.id === group.id,
    );
  }, [editedTodos, group]);
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

  // batch - added using suggestion generated from ChatGpt
  const handleRemoveGroup = async (groupId) => {
    // remove group from properties
    const updatedGroups = removeGroup(groupId);
    const dbItemsCopy = [...dbItems];

    const batch = writeBatch(db);
    const propertyRef = doc(userDbRef, 'properties', propertyData.id);
    batch.update(propertyRef, { values: updatedGroups });

    // update db items if necessary
    dbItemsCopy.forEach((item) => {
      if (updatedGroups.find(({ id }) => item[propertyData.name]?.id === id))
        return;

      item[propertyData.name] = null;

      const dbItemRef = doc(userDbRef, 'dbItems', item.id);
      batch.update(dbItemRef, { [propertyData.name]: null });
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
    <dropcontainer ref={drop} style={{ minHeight: `${dragHeight}px`, opacity }}>
      <GroupContainer
        onMouseEnter={group ? handleMouseEnter : undefined}
        onMouseLeave={group ? handleMouseLeave : undefined}
      >
        <Header>
          <GroupTitle
            group={group}
            groups={groups}
            property={propertyData}
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
              <DbItem dbItem={dbItem} key={dbItem.id} />
            ))}
        </DbItemsContainer>
        <StyledNewButton onClick={handleAddDbItem} text={'New'} />
      </GroupContainer>
    </dropcontainer>
  );
};

export default Group;
