import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiDrag } from '@mdi/js';
import { DatabaseContext } from '../../../context/context';
import useModal from '../../utils/custom/useModal';
import { v4 as uuid } from 'uuid';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase';

const DropdownContainer = styled.div`
  position: absolute;
  width: 270px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const Current = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  cursor: text;
  box-shadow: rgb(255 255 255 / 13%) 0px -1px inset;
  max-height: 240px;
  min-height: 34px;
  padding: 0 8px;
  gap: 8px;
`;

const CategoryName = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 0px;
  height: 20px;
  border-radius: 3px;
  padding: 0 6px;
  font-size: 14px;
  line-height: 120%;
  color: rgba(255, 255, 255, 0.804);
  background: rgb(90, 90, 90);
`;

const StyledInput = styled.input``;

const ErrorMsg = styled.span`
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 12px;
  font-size: 12px;
  color: rgb(235, 87, 87);
  box-shadow: rgb(255 255 255 / 13%) 0px -1px inset;
`;

const Categories = styled.div`
  padding: 6px 4px;
`;

const StyledOptionsText = styled.div`
  font-size: 12px;
  color: var(--secondary-font-color);
  margin-left: 8px;
  font-weight: 700;
`;

const DropdownRow = styled.div`
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  margin: 0 4px;
  padding: 0 4px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const SelectDropdown = ({
  data,
  selectedProperty,
  setDbItems,
  setProperties,
  buttonRef,
  closeDropdown,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const dropdownProps = useModal(buttonRef, closeDropdown);

  const [input, setInput] = useState('');
  const handleChange = (e) => setInput(e.target.value);
  const resetInput = () => setInput('');

  const isErrorMsg = useMemo(() => {
    return !!selectedProperty.values.find(({ name }) => name === input);
  }, [selectedProperty, input]);

  const handleClickPropertyValue = async (value) => {
    closeDropdown();

    setDbItems((prevDbItems) =>
      prevDbItems.map((item) => {
        return item.id === data.id
          ? { ...item, [selectedProperty.name]: value }
          : item;
      }),
    );

    try {
      await updateDoc(doc(userDbRef, 'dbItems', data.id), {
        [selectedProperty.name]: value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const ChangeDbPropertyValueInput = useCallback(
    (newValue) => {
      setDbItems((prevDbItems) =>
        prevDbItems.map((item) => {
          return item.id === data.id
            ? { ...item, [selectedProperty.name]: newValue }
            : item;
        }),
      );
    },
    [setDbItems, data.id, selectedProperty.name],
  );

  const ChangeDbPropertyValueInputBackend = useCallback(
    (batch, newValue) => {
      try {
        batch.update(doc(userDbRef, 'dbItems', data.id), {
          [selectedProperty.name]: newValue,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [data.id, selectedProperty.name, userDbRef],
  );

  const addValueToProperty = useCallback(
    async (updatedValues) => {
      const updatedProp = { ...selectedProperty, values: updatedValues };

      setProperties((prevProperties) =>
        prevProperties.map((property) => {
          return property.id === selectedProperty.id ? updatedProp : property;
        }),
      );
    },
    [selectedProperty, setProperties],
  );

  const addValueToPropertyBackend = useCallback(
    (batch, updatedValues) => {
      try {
        batch.update(doc(userDbRef, 'properties', selectedProperty.id), {
          values: updatedValues,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [selectedProperty.id, userDbRef],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isErrorMsg || !input) return;

    const newValue = { id: uuid(), name: input };
    const updatedValues = [...selectedProperty.values, newValue];
    resetInput();

    ChangeDbPropertyValueInput(newValue);
    addValueToProperty(updatedValues);

    if (!userDbRef) return;

    const batch = writeBatch(db);

    try {
      ChangeDbPropertyValueInputBackend(batch, newValue);
      await addValueToPropertyBackend(batch, updatedValues);

      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  };

  const currentValueRef = useRef();
  const [inputWidth, setInputWidth] = useState(0);
  useLayoutEffect(() => {
    const newWidth = currentValueRef.current
      ? 245 - currentValueRef.current?.offsetWidth
      : 253;
    setInputWidth(newWidth);
  }, [inputWidth, data, selectedProperty.name]);

  return (
    <DropdownContainer {...dropdownProps}>
      <Current onSubmit={handleSubmit}>
        {data[selectedProperty.name]?.name && (
          <CategoryName ref={currentValueRef}>
            {data[selectedProperty.name]?.name}
          </CategoryName>
        )}
        <StyledInput
          autoFocus
          style={{ width: `${inputWidth}px` }}
          value={input}
          onChange={handleChange}
        />
        <button style={{ display: 'none' }} type="submit" />
      </Current>
      {isErrorMsg && (
        <ErrorMsg>
          A {selectedProperty.name} named {input} already exists in this
          database.
        </ErrorMsg>
      )}

      <Categories>
        <StyledOptionsText>Select an option or create one</StyledOptionsText>

        {!!selectedProperty?.values?.length &&
          selectedProperty.values.map((value) => (
            <DropdownRow
              key={value.id}
              onClick={() => handleClickPropertyValue(value)}
            >
              <Icon
                path={mdiDrag}
                size={0.85}
                color={'var(--secondary-font-color)'}
              />
              <CategoryName>{value.name}</CategoryName>
            </DropdownRow>
          ))}
      </Categories>
    </DropdownContainer>
  );
};

export default SelectDropdown;
