import { mdiDeleteOutline, mdiRenameBoxOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { forwardRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PropertiesContext } from '../../MainContent';

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
  flex-direction: column;
  transition: background 20ms ease-in 0s;
  margin: 0 4px;
  padding: 0 8px;
  min-height: 28px;
  align-items: center;
  border-radius: 4px;
`;

const StyledInput = styled.input`
  padding: 8px 4px;
`;

const ErrorMsg = styled.span`
  padding: 4px 4px 0;
  font-size: 12px;
  color: rgb(235, 87, 87);
`;

// maybe add ability to change prop type eventually but for now nah
const LabelDropdown = forwardRef(({ style, propId }, ref) => {
  const { properties, setProperties, removeProperty } =
    useContext(PropertiesContext);

  const [isRenaming, setIsRenaming] = useState(false);
  const handleClickRename = () => {
    setTimeout(() => setIsRenaming(true));
  };

  const [nameInput, setNameInput] = useState('');
  const [isErrorMsg, setIsErrorMsg] = useState(false);
  const handleChange = (e) => setNameInput(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    renameProperty(e);
  };

  const renameProperty = (e) => {
    e.preventDefault();
    if (isErrorMsg || !nameInput) return;

    const propertiesCopy = [...properties];
    const property = propertiesCopy.find(({ id }) => id === propId);

    property.name = nameInput;
    property.id = nameInput.toLowerCase();
    setProperties(propertiesCopy);
  };

  useEffect(() => {
    setIsErrorMsg(properties.find(({ id }) => id === nameInput) ? true : false);
  }, [properties, nameInput]);

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
            <StyledInput
              autoFocus
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {isErrorMsg ? (
              <>
              <hr />
              <ErrorMsg>
                A property named {nameInput} already exists in this database.
              </ErrorMsg></>
            ) : (
              ''
            )}
          </InputRow>
        </>
      )}
    </DropdownContainer>
  );
});

export default LabelDropdown;