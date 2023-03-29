import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiSubdirectoryArrowLeft } from '@mdi/js';
import { DatabaseContext } from '../../../../context/context';
import {
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../firebase';

const StyledNameContainer = styled.div`
  padding: 4px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;
const GroupTitleText = styled.p`
  width: fit-content;
  border-radius: 4px;
  background: rgb(90, 90, 90);
  padding: 0 6px;
`;

const GroupNameInput = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  width: 300px;
  height: 44px;
  border-radius: 4px;
  background: rgb(37, 37, 37);
  padding: 8px 10px;
`;

const StyledInput = styled.input`
  font-size: 16px;
`;

const StyledButton = styled.button`
  white-space: nowrap;
  height: 28px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 20%) 0px 0px 0px 1px inset,
    rgb(15 15 15 / 10%) 0px 1px 2px;
  background: rgb(35, 131, 226);
  color: white;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  gap: 10px;
  font-size: 14px;
  &:hover {
    background-color: rgb(0, 117, 211);
  }
`;

const GroupTitle = ({ group, groups, propertyId, propertyName }) => {
  const { userDbRef, setDbItems, setProperties } = useContext(DatabaseContext);
  const inputRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const handleClickName = () => setTimeout(() => setIsEditing(true));
  const closeInput = () => setIsEditing(false);

  const [nameInput, setGroupNameInput] = useState(group ? group.name : '');
  const handleChange = (e) => setGroupNameInput(e.target.value);
  const submitInput = async () => {
    if (group.name === nameInput) return;

    const name = nameInput;

    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id !== propertyId) return prop;
        return {
          ...prop,
          values: prop.values.map((value) => {
            return value.id === group.id ? { ...value, name } : value;
          }),
        };
      }),
    );

    const batch = writeBatch(db);
    const propertyRef = doc(userDbRef, 'properties', propertyId);
    const getValues = (values) => {
      return values.map((value) =>
        value.id === group.id ? { ...value, name } : value,
      );
    };
    batch.update(propertyRef, { values: getValues(groups) });

    setDbItems((prev) =>
      prev.map((item) => {
        if (item[propertyName]?.id !== group.id) return item;

        const dbItemRef = doc(userDbRef, 'dbItems', item.id);
        batch.update(dbItemRef, {
          [propertyName]: { ...item[propertyName], name },
        });

        return { ...item, [propertyName]: { ...item[propertyName], name } };
      }),
    );

    await batch.commit();

    closeInput();
  };

  const handleClickSubmitButton = () => submitInput();
  const handleEnterInput = (e) => {
    if (e.key === 'Enter') submitInput();
  };

  useEffect(() => {
    const checkClickOff = (e) => {
      if (!inputRef.current || !isEditing) return;
      if (inputRef.current.contains(e.target)) return;
      closeInput();
    };
    window.addEventListener('click', checkClickOff);
    return () => window.removeEventListener('click', checkClickOff);
  }, [isEditing]);

  return (
    <div>
      <StyledNameContainer>
        <GroupTitleText onClick={handleClickName}>
          {group ? group.name : 'No Status'}
        </GroupTitleText>
      </StyledNameContainer>
      {isEditing && group && (
        <GroupNameInput ref={inputRef}>
          <StyledInput
            value={nameInput}
            onInput={handleChange}
            onKeyDown={handleEnterInput}
            placeholder="Rename project"
          />
          <StyledButton onClick={handleClickSubmitButton}>
            Done
            <Icon path={mdiSubdirectoryArrowLeft} size={0.7} />
          </StyledButton>
        </GroupNameInput>
      )}
    </div>
  );
};

export default GroupTitle;
