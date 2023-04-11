import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import Group from './Group/Group';
import AddGroup from './Group/AddGroup';

const GroupsContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  height: 100%;
`;

const Board = ({
  editedDbItems,
  selectedView,
  properties,
  setProperties,
  dbItems,
  setDbItems,
  addDbItem,
  removeDbItem,
}) => {
  const selectedProperty = useMemo(() => {
    return properties.find(({ id }) => id === 'CWn4hkG8N6XTyhPxLhnI');
  }, [properties]);

  const groups = useMemo(() => {
    const groupedDbItems = editedDbItems.reduce((result, dbItem) => {
      const groupId = dbItem[selectedProperty.name]?.id ?? 'No Status';
      if (!result[groupId]) result[groupId] = [];
      result[groupId].push(dbItem);
      return result;
    }, {});

    // TODO fix eventually
    const meep = selectedProperty.values
      .map((group) => {
        return {
          groupData: group,
          groupDbItems: groupedDbItems[group.id] ?? [],
        };
      })
      .concat({
        groupData: null,
        groupDbItems: groupedDbItems['No Status'] ?? [],
      });

    return meep;
  }, [editedDbItems, selectedProperty]);

  const groupsContainerRef = useRef();
  const maxBoardHeight = useMemo(() => {
    return groups && groupsContainerRef?.current?.offsetHeight;
  }, [groups]);

  return (
    <GroupsContainer ref={groupsContainerRef}>
      {groups &&
        groups.map((group) => {
          const { groupData } = group;
          return (
            <Group
              key={groupData?.id ?? 0}
              group={group}
              selectedProperty={selectedProperty}
              properties={properties}
              setProperties={setProperties}
              selectedView={selectedView}
              dbItems={dbItems}
              setDbItems={setDbItems}
              addDbItem={addDbItem}
              removeDbItem={removeDbItem}
              dragHeight={maxBoardHeight}
            />
          );
        })}
      <AddGroup
        selectedProperty={selectedProperty}
        setProperties={setProperties}
      />
    </GroupsContainer>
  );
};

export default Board;
