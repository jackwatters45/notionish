import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useContext } from 'react';
import { DatabaseContext } from '../../../context/context';

const useDnDPosition = (
  firstItemStart,
  rowHeight,
  groupData = null,
  selectedProperty = null,
) => {
  const { userDbRef } = useContext(DatabaseContext);

  const getLocationNewGroup = useCallback(
    (allDbItems, groupDbItems, draggedItemIndex, offset) => {
      const lastItemEnd = firstItemStart + rowHeight * groupDbItems.length;

      let { y } = offset;
      if (y < firstItemStart) y = firstItemStart;
      if (y > lastItemEnd) y = lastItemEnd;

      const distanceFromTop = Math.floor(
        Math.abs(y - firstItemStart) / rowHeight,
      );

      // If dragged to bottom of group, place after last item
      if (distanceFromTop === groupDbItems.length) {
        const dbItemBefore = groupDbItems[distanceFromTop - 1];
        const dbItemBeforeOrder = dbItemBefore.order;

        const isLastItem = dbItemBeforeOrder === allDbItems.length - 1;
        return isLastItem ? dbItemBeforeOrder : dbItemBeforeOrder + 1;
      }

      const targetDbItem = groupDbItems[distanceFromTop];

      // if no change in order return null
      if (targetDbItem.order === draggedItemIndex) return null;

      // if dragged to top of group, place before first item
      if (targetDbItem.order > draggedItemIndex) return targetDbItem.order - 1;

      // if dragged to middle of group, place after target item
      return targetDbItem.order;
    },
    [firstItemStart, rowHeight],
  );

  const getLocationSameGroup = useCallback(
    (groupDbItems, draggedItemIndex, offset) => {
      const draggedItemGroupIndex = groupDbItems.findIndex(({ order }) => {
        return order === draggedItemIndex;
      });

      let { y } = offset;
      if (y < firstItemStart) y = firstItemStart;
      const lastItemEnd = firstItemStart + rowHeight * groupDbItems.length;
      if (y > lastItemEnd) y = lastItemEnd;

      const draggedItemMiddle =
        draggedItemGroupIndex * rowHeight + firstItemStart + rowHeight / 2;

      const isValidMoveAbove = y < draggedItemMiddle - rowHeight;
      const isValidMoveBelow = y > draggedItemMiddle + rowHeight;
      if (!isValidMoveAbove && !isValidMoveBelow) return null;

      let distanceMovedNoDirection = Math.floor(
        Math.abs(y - draggedItemMiddle) / rowHeight,
      );

      const distanceMoved = isValidMoveAbove
        ? -distanceMovedNoDirection
        : distanceMovedNoDirection;

      // The todo should be moved right before the target
      const targetGroupIndex = draggedItemGroupIndex + distanceMoved;
      const targetDbItem = groupDbItems[targetGroupIndex];
      const targetDbItemIndex = targetDbItem.order;
      return targetDbItemIndex;
    },
    [firstItemStart, rowHeight],
  );

  const updateDbItemOrder = (currentDbItems, draggedItemIndex, newOrder) => {
    const draggedItem = currentDbItems[draggedItemIndex];

    currentDbItems.splice(draggedItemIndex, 1);
    currentDbItems.splice(newOrder, 0, draggedItem);

    const updatedOrder = currentDbItems.map((item, index) => {
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

  const updateGroup = useCallback(
    (currentDbItemsCopy, draggedItemIndex) => {
      return currentDbItemsCopy.map((item, index) => {
        return index === draggedItemIndex
          ? { ...item, [selectedProperty?.name]: groupData }
          : item;
      });
    },
    [groupData, selectedProperty?.name],
  );

  const updateGroupBackend = useCallback(
    async (draggedItemId) => {
      const docRef = doc(userDbRef, 'dbItems', draggedItemId);
      const updatedGroup = { [selectedProperty?.name]: groupData };
      try {
        await updateDoc(docRef, updatedGroup);
      } catch (e) {
        console.log(e);
      }
    },
    [groupData, selectedProperty?.name, userDbRef],
  );

  return {
    getLocationNewGroup,
    getLocationSameGroup,
    updateDbItemOrder,
    updateDbItemOrderBackend,
    updateGroup,
    updateGroupBackend,
  };
};

export default useDnDPosition;
