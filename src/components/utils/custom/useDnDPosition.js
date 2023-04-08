import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useContext } from 'react';
import { DatabaseContext } from '../../../context/context';

const useDnDPosition = (setDbItems) => {
  const { userDbRef } = useContext(DatabaseContext);

  const getDistanceMoved = (
    currentDbItems,
    draggedItemIndex,
    rowHeight,
    firstItemStart,
    offset,
  ) => {
    const lastItemEnd = firstItemStart + rowHeight * currentDbItems.length;

    const draggedItemMiddle =
      draggedItemIndex * rowHeight + firstItemStart + rowHeight / 2;

    let { y } = offset;
    if (y < firstItemStart) y = firstItemStart;
    if (y > lastItemEnd) y = lastItemEnd;

    const isValidMoveAbove = y < draggedItemMiddle - rowHeight;
    const isValidMoveBelow = y > draggedItemMiddle + rowHeight;
    if (!isValidMoveAbove && !isValidMoveBelow) return null;

    let distanceMovedNoDirection = Math.floor(
      Math.abs(y - draggedItemMiddle) / rowHeight,
    );

    const distanceMoved = isValidMoveAbove
      ? -distanceMovedNoDirection
      : distanceMovedNoDirection;

    return distanceMoved;
  };

  const updateDbItemOrder = (currentDbItems, draggedItemIndex, newOrder) => {
    const dbItemsCopy = [...currentDbItems];
    const sortedDbItems = dbItemsCopy.sort((a, b) => a.order - b.order);

    const draggedItem = currentDbItems[draggedItemIndex];
    sortedDbItems.splice(draggedItemIndex, 1);
    sortedDbItems.splice(newOrder, 0, draggedItem);

    const updatedOrder = sortedDbItems.map((item, index) => {
      return { ...item, order: index };
    });

    return updatedOrder;
  };

  const updateDbItemOrderBackend = useCallback(
    async (batch, updatedDbItems) => {
      try {
        updatedDbItems.forEach((dbItem, index) => {
          batch.update(doc(userDbRef, 'dbItems', dbItem.id), { order: index });
        });

        await batch.commit();
      } catch (e) {
        console.log(e);
      }
    },
    [userDbRef],
  );

  const updateGroup = (
    currentDbItemsCopy,
    draggedItemIndex,
    groupData,
    selectedProperty,
  ) => {
    currentDbItemsCopy[draggedItemIndex][selectedProperty.name] = groupData;
  };

  const updateGroupBackend = useCallback(
    async (draggedItemId, selectedProperty, groupData) => {
      try {
        await updateDoc(doc(userDbRef, 'dbItems', draggedItemId), {
          [selectedProperty.name]: groupData,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [userDbRef],
  );

  return {
    getDistanceMoved,
    updateDbItemOrder,
    updateDbItemOrderBackend,
    updateGroup,
    updateGroupBackend,
  };
};

export default useDnDPosition;

// const getUpdatedDroppedItemIndex = useCallback(
//   (
//     offset,
//     dbItems,
//     firstItemStart,
//     rowHeight,
//     droppedItem,
//     groupDbItems = false,
//   ) => {
//     const { y } = offset;
//     const tablePositionY = y - firstItemStart;

//     // Calculate the index without considering the bounds
//     const newIndexWithoutBounds = Math.floor(tablePositionY / rowHeight);

//     const droppedOn = groupDbItems.find(
//       (item) => item.order === newIndexWithoutBounds,
//     );
//     if (droppedOn === droppedItem) {
//       // console.log('droppedOn === droppedItem');
//       // console.log('problem is with the groupDbItems or the array updating');
//       return false;
//     }

//     // groupDbItems not updated??
//     // console.log('groupDbItems', groupDbItems);

//     // Apply the lower bound (maximum value)
//     const maxPos = groupDbItems.length;

//     const lowerBoundIndex = Math.min(newIndexWithoutBounds, maxPos);

//     // Apply the upper bound (minimum value) and return the result
//     const updatedGroupIndex = Math.max(0, lowerBoundIndex);

//     if (!groupDbItems[updatedGroupIndex]) {
//       console.log('!groupDbItems[updatedGroupIndex]');
//       return false;
//     }

//     const replacedItem = groupDbItems[updatedGroupIndex];
//     const newIndex = dbItems.findIndex(
//       (dbItem) => dbItem.id === replacedItem.id,
//     );

//     return newIndex;
//   },
//   [],
// );

// const getUpdatedArr = (dbCopy, currentOrder, newIndex, droppedItem) => {
//   dbCopy.splice(currentOrder, 1);
//   dbCopy.splice(newIndex, 0, droppedItem);

//   return dbCopy;
// };

// const updateDbItemOrder = (updatedArr) => {
//   setDbItems(
//     updatedArr.map((dbItem, index) => ({
//       ...dbItem,
//       order: index,
//     })),
//   );
// };
// const updateDbItemOrderBackend = useCallback(
//   (batch, updatedDbItems) => {
//     updatedDbItems.forEach((dbItem, index) => {
//       batch.update(doc(userDbRef, 'dbItems', dbItem.id), { order: index });
//     });
//   },
//   [userDbRef],
// );
