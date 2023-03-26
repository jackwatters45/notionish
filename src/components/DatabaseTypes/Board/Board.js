import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Group from './Group/Group';
import AddGroup from './Group/AddGroup';
import { DatabaseContext } from '../../../context/context';
import useArrayOfObjects from '../../utils/custom/useArrayOfObjects';

const GroupsContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  height: 100%;
`;

const Board = (props) => {
  const {
    editedTodos,
    selectedView,
    propertyData = { id: 'CWn4hkG8N6XTyhPxLhnI', name: 'project' },
  } = props;
  const { properties } = useContext(DatabaseContext);

  const [groups, setGroups, removeGroup, addGroup] = useArrayOfObjects();
  useEffect(() => {
    const property = properties.find(({ id }) => id === propertyData.name);
    setGroups(property.values);
  }, [properties, propertyData, setGroups]);

  const groupsContainerRef = useRef();
  const [maxHeight, setMaxHeight] = useState();
  useEffect(() => {
    setMaxHeight(groupsContainerRef?.current.offsetHeight);
  }, [groups]);

  return (
    <GroupsContainer ref={groupsContainerRef}>
      {groups &&
        groups.map((group) => {
          return (
            <Group
              key={group.id}
              group={group}
              groups={groups}
              propertyData={propertyData}
              removeGroup={removeGroup}
              editedTodos={editedTodos}
              dragHeight={maxHeight}
              selectedView={selectedView}
            />
          );
        })}
      <Group
        editedTodos={editedTodos}
        dragHeight={maxHeight}
        selectedView={selectedView}
      />
      <AddGroup
        width={260}
        addGroup={addGroup}
        propId={propertyData.id}
        groups={groups}
      />
    </GroupsContainer>
  );
};

export default Board;
