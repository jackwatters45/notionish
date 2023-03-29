import Icon from '@mdi/react';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import propertyData from '../../utils/helpers/propertyHelpers';

const FilterRow = styled.div`
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

const StyledInput = styled.input`
  margin: 6px 6px 12px;
  display: flex;
  align-items: center;
  width: calc(100% - 12px);
  font-size: 14px;
  line-height: 20px;
  padding: 3px 6px;
  position: relative;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 20%) 0px 0px 0px 1px inset;
  background: rgba(255, 255, 255, 0.055);
  cursor: text;
  height: 28px;
  &:focus {
    outline: 2px solid rgb(35, 131, 226);
  }
`;

const SearchPopup = ({
  handleSelectProperty,
  text,
  alreadyUsed,
  properties,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const handleSearchInputChange = (e) => setSearchInput(e.target.value);

  const searchArr = useMemo(() => {
    const usedProperties = alreadyUsed?.map((el) => el.property) ?? [];

    return usedProperties.some(Boolean)
      ? properties.filter((prop) => {
          return (
            !usedProperties.some((usedProp) => usedProp.id === prop.id) &&
            prop.id.includes(searchInput.toLowerCase())
          );
        })
      : properties;
  }, [searchInput, properties, alreadyUsed]);

  return (
    <>
      <StyledInput
        autoFocus
        placeholder={text}
        value={searchInput}
        onChange={handleSearchInputChange}
      />
      {searchArr.map((property) => {
        const { name, id, type } = property;
        const { icon } = propertyData[type];
        return (
          <FilterRow key={id} onClick={() => handleSelectProperty(property)}>
            <Icon path={icon} size={0.75} />
            {name}
          </FilterRow>
        );
      })}
    </>
  );
};

export default SearchPopup;
