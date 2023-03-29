import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Group from './Group/Group';
import AddGroup from './Group/AddGroup';
import { DatabaseContext } from '../../../context/context';

const GroupsContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
  height: 100%;
`;

const Board = (props) => {
  const {
    editedTodos,
    selectedView,
    propertyName = 'project',
    propertyId = 'CWn4hkG8N6XTyhPxLhnI',
  } = props;
  const { properties } = useContext(DatabaseContext);

  // might still want to get property data from context

  const groups = useMemo(() => {
    const property = properties.find(({ id }) => id === propertyName);
    return property.values;
  }, [properties, propertyName]);

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
              propertyName={propertyName}
              propertyId={propertyId}
              editedTodos={editedTodos}
              dragHeight={maxHeight}
              selectedView={selectedView}
            />
          );
        })}
      <Group
        propertyName={propertyName}
        editedTodos={editedTodos}
        dragHeight={maxHeight}
        selectedView={selectedView}
      />
      <AddGroup
        width={260}
        propertyId={propertyId}
        propertyName={propertyName}
        groups={groups}
      />
    </GroupsContainer>
  );
};

export default Board;
