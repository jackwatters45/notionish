import { mdiDeleteOutline, mdiRenameBoxOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../context/context';
import useModal from '../../utils/custom/useModal';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../firebase';

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

const RenameForm = styled.form`
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

const LabelModal = ({
  buttonRef,
  closeModal,
  selectedProperty,
  properties,
  setProperties,
  removeProperty,
  setDbItems,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

  const [isRenaming, setIsRenaming] = useState(false);
  const handleClickRename = () => setIsRenaming(true);

  const [nameInput, setNameInput] = useState(selectedProperty.name ?? '');
  const handleChange = (e) => setNameInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isErrorMsg && !!nameInput && selectedProperty.name !== nameInput)
      renameProperty(e);
  };

  const updateProperties = useCallback(
    (updatedProperty) => {
      setProperties((prevProperties) =>
        prevProperties.map((property) => {
          return property.id === selectedProperty.id
            ? updatedProperty
            : property;
        }),
      );
    },
    [selectedProperty, setProperties],
  );

  const updatePropertiesBackend = useCallback(
    (batch, updatedProperty) => {
      batch.update(
        doc(userDbRef, 'properties', selectedProperty.id),
        updatedProperty,
      );
    },
    [selectedProperty.id, userDbRef],
  );

  const updateDbItems = useCallback(
    (updatedProperty) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((item) => {
          return {
            ...item,
            [updatedProperty.name]: item[selectedProperty.name],
          };
        }),
      );
    },
    [selectedProperty, setDbItems],
  );

  const updateDbItemsBackend = useCallback(
    async (batch, updatedProperty) => {
      try {
        const collectionRef = collection(userDbRef, 'dbItems');
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
          const propertyValue = doc.get(selectedProperty.name);
          const updatedField = { [updatedProperty.name]: propertyValue };
          const deletedField = { [selectedProperty.name]: deleteField() };
          batch.update(doc.ref, updatedField, deletedField);
        });
      } catch (e) {
        console.log(e);
      }
    },
    [selectedProperty.name, userDbRef],
  );

  const renameProperty = async () => {
    setIsRenaming(false);

    const updatedProperty = { ...selectedProperty, name: nameInput };

    updateProperties(updatedProperty);
    updateDbItems(updatedProperty);

    if (!userDbRef) return;

    const batch = writeBatch(db);

    try {
      updatePropertiesBackend(batch, updatedProperty);
      await updateDbItemsBackend(batch, updatedProperty);

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickRemoveProperty = async (propertyId) => {
    removeProperty(propertyId);

    if (!userDbRef) return;

    try {
      await deleteDoc(doc(userDbRef, 'properties', propertyId));
    } catch (e) {
      console.log(e);
    }
  };

  const isErrorMsg = useMemo(() => {
    return (
      !!properties.find(({ name }) => name === nameInput) &&
      !selectedProperty.name
    );
  }, [nameInput, properties, selectedProperty.name]);

  return (
    <DropdownContainer {...modalProps}>
      {!isRenaming ? (
        <>
          <Row onClick={handleClickRename}>
            <Icon path={mdiRenameBoxOutline} size={0.75} />
            Rename
          </Row>
          {selectedProperty.id !== 'CWn4hkG8N6XTyhPxLhnI' && (
            <Row onClick={() => handleClickRemoveProperty(selectedProperty.id)}>
              <Icon path={mdiDeleteOutline} size={0.75} />
              Delete property
            </Row>
          )}
        </>
      ) : (
        <>
          <RenameForm onSubmit={handleSubmit}>
            <StyledInput value={nameInput} autoFocus onChange={handleChange} />
            <button style={{ display: 'none' }} type="submit" />
            {isErrorMsg && (
              <>
                <hr />
                <ErrorMsg>
                  A property named {nameInput} already exists in this database.
                </ErrorMsg>
              </>
            )}
          </RenameForm>
        </>
      )}
    </DropdownContainer>
  );
};

export default LabelModal;
