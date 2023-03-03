import { mdiDeleteOutline, mdiRenameBoxOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: absolute;
  width: 220px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 6px 0px;
  color: var(--main-font-color);
`;

const Row = styled.div`
  display: flex;
  gap: 4px;
  user-select: none;
  cursor: pointer;
  transition: background 20ms ease-in 0s;
  margin: 0 4px;
  padding: 0 8px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const InputRow = styled.div`
  display: flex;
  transition: background 20ms ease-in 0s;
  margin: 0 4px;
  padding: 0 8px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
`;

const LabelDropdown = forwardRef(({ style, propId }, ref) => {
  // need to import properties array
  const properties = [];
  const setProperties = () => {};

  const removeProperty = () =>
    setProperties(properties.filter((property) => property.name !== propId));

  const [isRenaming, setIsRenaming] = useState(false);
  const handleClickRename = () => {
    setTimeout(() => setIsRenaming(true));
  };

  // TODO add input state
  const renameProperty = (e) => {
    if (e.key !== 'Enter') return;

    console.log(e.target.value)
    const propertiesCopy = [...properties];
    const property = propertiesCopy.find(
      (property) => property.name === propId,
    );
    property.name = e.target.value;
    setProperties(propertiesCopy);
  };

  return (
    <DropdownContainer ref={ref} style={style}>
      {!isRenaming ? (
        <>
          <Row onClick={handleClickRename}>
            <Icon path={mdiRenameBoxOutline} size={0.75} />
            Rename
          </Row>
          <Row onClick={removeProperty}>
            <Icon path={mdiDeleteOutline} size={0.75} />
            Delete property
          </Row>
        </>
      ) : (
        <>
          <InputRow>
            <input autoFocus onKeyDown={renameProperty} />
          </InputRow>
        </>
      )}
    </DropdownContainer>
  );
});

export default LabelDropdown;
