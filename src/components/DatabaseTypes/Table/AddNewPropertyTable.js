import Icon from '@mdi/react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import propertyData from '../../utils/helpers/propertyHelpers';
import { mdiPlus } from '@mdi/js';
import usePopup from '../../utils/custom/usePopup';
import { DatabaseContext, SidebarContext } from '../../../context/context';

const ButtonDiv = styled.div`
  overflow: hidden;
  display: flex;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  padding: 0 8px;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  color: var(--empty-font-color);
  margin: 6px 0;
`;

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

const AddNewPropertyTable = (props) => {
  const { properties, setProperties } = useContext(DatabaseContext);
  const { setIsPopupVisible } = useContext(SidebarContext);

  const buttonRef = useRef();

  const { isDropdown, setIsDropdown, ...popupProps } = usePopup({}, buttonRef);

  const [nameInput, setNameInput] = useState('');
  const handleNameChange = (e) => setNameInput(e.target.value);
  const [type, setType] = useState('text');
  const handleClickType = (propertyType) => setType(propertyType);

  const resetAddingNew = useCallback(() => {
    setIsPopupVisible(false);
    setIsDropdown(false);
    setIsErrorMsg(false);
    setType('text');
  }, [setIsDropdown, setIsPopupVisible]);

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    addProperty(e);
  };

  const addProperty = (e) => {
    e.preventDefault();
    if (isErrorMsg || !nameInput) return;

    const newProperty = {
      name: nameInput,
      id: nameInput.toLowerCase(),
      type: type,
    };

    setProperties([...properties, newProperty]);
    resetAddingNew();
  };

  const [isErrorMsg, setIsErrorMsg] = useState(false);
  useEffect(() => {
    setIsErrorMsg(properties.find(({ id }) => id === nameInput) ? true : false);
  }, [properties, nameInput]);

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div>
      <ButtonDiv>
        <StyledIcon size={0.9} path={mdiPlus} ref={buttonRef} />
      </ButtonDiv>
      {isDropdown && (
        <AddPropContainer
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          {...popupProps}
        >
          <button style={{ display: 'none' }} type="submit" />
          <StyledInput
            autoFocus
            placeholder="Property name"
            onChange={handleNameChange}
          />
          {isErrorMsg && (
            <>
              <hr />
              <ErrorMsg>
                A property named {nameInput} already exists in this database.
              </ErrorMsg>
            </>
          )}
          <hr />
          <TypeLabel>Type</TypeLabel>
          {Object.keys(propertyData).map((propertyType) => {
            const { name, icon } = propertyData[propertyType];
            return (
              <AddPropRow
                key={propertyType}
                onClick={() => handleClickType(propertyType)}
                style={{
                  backgroundColor:
                    type === propertyType ? 'rgba(255, 255, 255, 0.11)' : '',
                }}
              >
                <Icon path={icon} size={0.75} />
                {name}
              </AddPropRow>
            );
          })}
        </AddPropContainer>
      )}
    </div>
  );
};

export default AddNewPropertyTable;
