import { mdiSubdirectoryArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../../../context/context';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../../firebase';
import useModal from '../../../../utils/custom/useModal';

const GroupNameInput = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  width: 300px;
  min-height: 44px;
  border-radius: 4px;
  background: rgb(37, 37, 37);
  padding: 8px;
`;

const NonErrorSection = styled.div`
  display: flex;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 0 4px;
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

const StyledHr = styled.hr`
  margin-top: 4px;
`;

const ErrorMsg = styled.span`
  align-self: start;
  padding: 2px 4px 0;
  font-size: 12px;
  color: rgb(235, 87, 87);
`;

const GroupTitleModal = (props) => {
  const {
    closeModal,
    buttonRef,
    groupData,
    setProperties,
    selectedProperty,
    setDbItems,
  } = props;
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

  const [nameInput, setGroupNameInput] = useState(groupData?.name ?? '');
  const handleChange = (e) => setGroupNameInput(e.target.value);

  const handleClickSubmitButton = () => handleSubmitInput();
  const handleEnterInput = (e) => {
    if (e.key === 'Enter') handleSubmitInput();
  };

  const isErrorMessage = useMemo(() => {
    return selectedProperty?.values?.some(
      (value) => value.name === nameInput && value.id !== groupData.id,
    );
  }, [selectedProperty?.values, nameInput, groupData.id]);

  // TODO
  const updateProperties = useCallback(
    (updatedProperty) => {
      setProperties((prev) =>
        prev.map((prop) => {
          return prop.id === selectedProperty.id ? updatedProperty : prop;
        }),
      );
    },
    [selectedProperty, setProperties],
  );

  const updatePropertiesBackend = useCallback(
    async (batch, updatedPropertyValues) => {
      batch.update(doc(userDbRef, 'properties', selectedProperty.id), {
        values: updatedPropertyValues,
      });
    },
    [selectedProperty.id, userDbRef],
  );

  const updateDbItems = useCallback(
    async (updatedPropertyValue) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((item) => {
          return item[selectedProperty.name]?.id === groupData.id
            ? { ...item, [selectedProperty.name]: updatedPropertyValue }
            : item;
        }),
      );
    },
    [selectedProperty.name, groupData.id, setDbItems],
  );

  const updateDbItemsBackend = useCallback(
    async (batch, updatedPropertyValue) => {
      try {
        const collectionRef = collection(userDbRef, 'dbItems');
        const q = query(
          collectionRef,
          where(`${selectedProperty.name}.id`, '==', groupData.id),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            [selectedProperty.name]: updatedPropertyValue,
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
    [groupData.id, selectedProperty.name, userDbRef],
  );

  const handleSubmitInput = async () => {
    if (!nameInput || isErrorMessage) return;

    closeModal();

    try {
      const updatedPropertyValue = { ...groupData, name: nameInput };

      const updatedPropertyValues = selectedProperty.values.map((value) =>
        value.id === groupData.id ? updatedPropertyValue : value,
      );
      const updatedProperty = {
        ...selectedProperty,
        values: updatedPropertyValues,
      };

      updateProperties(updatedProperty);
      updateDbItems(updatedPropertyValue);

      if (!userDbRef) return;

      const batch = writeBatch(db);
      updatePropertiesBackend(batch, updatedPropertyValues);
      await updateDbItemsBackend(batch, updatedPropertyValue);

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GroupNameInput {...modalProps}>
      <NonErrorSection>
        <StyledInput
          value={nameInput}
          autoFocus
          onInput={handleChange}
          onKeyDown={handleEnterInput}
          placeholder="Rename project"
        />

        <StyledButton onClick={handleClickSubmitButton}>
          Done
          <Icon path={mdiSubdirectoryArrowLeft} size={0.7} />
        </StyledButton>
      </NonErrorSection>
      {isErrorMessage && (
        <>
          <StyledHr />
          <ErrorMsg>
            A {selectedProperty.name} with this name already exists.
          </ErrorMsg>
        </>
      )}
    </GroupNameInput>
  );
};

export default GroupTitleModal;
