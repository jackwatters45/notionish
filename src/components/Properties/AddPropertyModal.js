import Icon from '@mdi/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import propertyData from '../utils/helpers/propertyHelpers';
import useModal from '../utils/custom/useModal';
import { DatabaseContext } from '../../context/context';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { v4 as uuid } from 'uuid';

const AddPropContainer = styled.form`
  width: 220px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 8px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const AddPropRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--main-font-color);
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const TypeLabel = styled.div`
  display: flex;
  padding: 0 8px;
  margin: 8px 0 2px 0;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
`;

const StyledInput = styled.input`
  padding: 8px;
`;

const ErrorMsg = styled.span`
  padding: 4px;
  font-size: 12px;
  color: rgb(235, 87, 87);
`;

const AddPropertyModal = ({
  addProperty,
  properties,
  closeModal,
  buttonRef,
  setDbItems,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

  const [propertyNameInput, setPropertyNameInput] = useState('');
  const [selectedType, setPropertyType] = useState('text');

  const addPropertyToProperties = useCallback(
    (newProperty) => {
      addProperty(newProperty);
    },
    [addProperty],
  );

  const addPropertyToPropertiesBackend = useCallback(
    async (batch, newProperty) => {
      const newDocRef = doc(userDbRef, 'properties', newProperty.id);
      batch.set(newDocRef, newProperty);
    },
    [userDbRef],
  );

  const addPropertyToDbItems = useCallback(
    (newProperty) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((item) => {
          return { ...item, [newProperty.name]: null };
        }),
      );
    },
    [setDbItems],
  );

  const addPropertyToDbItemsBackend = useCallback(
    async (batch, newProperty) => {
      try {
        const collectionRef = collection(userDbRef, 'dbItems');
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { ...doc.data(), [newProperty.name]: null });
        });
      } catch (e) {
        console.log(e);
      }
    },
    [userDbRef],
  );

  // TODO idk if did right
  const addNewProperty = async () => {
    closeModal();

    const newProperty = {
      name: propertyNameInput,
      id: uuid(),
      type: selectedType,
      values: selectedType === 'Select' ? [] : null,
    };

    addPropertyToProperties(newProperty);
    addPropertyToDbItems(newProperty);

    if (!userDbRef) return;

    const batch = writeBatch(db);
    addPropertyToPropertiesBackend(batch, newProperty);
    await addPropertyToDbItemsBackend(batch, newProperty);
    await batch.commit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isErrorMsg && !!propertyNameInput) addNewProperty();
  };

  const isErrorMsg = useMemo(() => {
    return !!properties.find(({ name }) => name === propertyNameInput);
  }, [properties, propertyNameInput]);

  return (
    <AddPropContainer onSubmit={handleSubmit} {...modalProps}>
      <button style={{ display: 'none' }} type="submit" />
      <StyledInput
        autoFocus
        placeholder="Property name"
        onChange={(e) => setPropertyNameInput(e.target.value)}
      />
      {isErrorMsg && (
        <>
          <hr />
          <ErrorMsg>
            A property named {propertyNameInput} already exists in this
            database.
          </ErrorMsg>
        </>
      )}
      <hr />
      <TypeLabel>Type</TypeLabel>
      {Object.keys(propertyData).map((propertyType) => {
        const { name, icon } = propertyData[propertyType];
        if (propertyType === 'created') return null;
        return (
          <AddPropRow
            key={propertyType}
            onClick={() => setPropertyType(propertyType)}
            style={
              propertyType === selectedType
                ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.11)',
                  }
                : {}
            }
          >
            <Icon path={icon} size={0.75} />
            {name}
          </AddPropRow>
        );
      })}
    </AddPropContainer>
  );
};

export default AddPropertyModal;
