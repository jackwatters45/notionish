import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import useModal from '../../../utils/custom/useModal';
import viewsData from '../../../utils/helpers/viewHelpers';
import { v4 as uuid } from 'uuid';
import { DatabaseContext } from '../../../../context/context';
import { doc, setDoc } from 'firebase/firestore';

const DropdownContainer = styled.form`
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

const AddViewRow = styled.div`
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

const NewViewModal = ({ views, addView, buttonRef, closeModal }) => {
  const { userDbRef } = useContext(DatabaseContext);

  const modalProps = useModal(buttonRef, closeModal);

  const [input, setInput] = useState('');
  const handleNameChange = (e) => setInput(e.target.value);

  const [type, setType] = useState('board');
  const handleClickType = (propertyType) => setType(propertyType);

  const handleKeyDown = async (e) => {
    if (e.key !== 'Enter' || isErrorMsg || !input) return;
    closeModal();

    const id = uuid();
    const newView = {
      name: input,
      id,
      type: type,
      sort: [],
      filter: [],
    };

    addView(newView);

    if (!userDbRef) return;

    try {
      await setDoc(doc(userDbRef, 'views', id), newView);
    } catch (err) {
      console.log(err);
    }
  };

  const isErrorMsg = useMemo(() => {
    return !!views.find(({ name }) => name === input);
  }, [views, input]);

  return (
    <DropdownContainer {...modalProps} onKeyDown={handleKeyDown}>
      <StyledInput
        autoFocus
        placeholder="Property name"
        onChange={handleNameChange}
      />
      <button style={{ display: 'none' }} type="submit" />
      {isErrorMsg && (
        <>
          <hr />
          <ErrorMsg>
            A view named {input} already exists in this database.
          </ErrorMsg>
        </>
      )}
      <hr />
      <TypeLabel>Type</TypeLabel>
      {Object.keys(viewsData).map((viewType) => {
        const { name, icon } = viewsData[viewType];
        return (
          <AddViewRow
            key={viewType}
            onClick={() => handleClickType(viewType)}
            style={{
              backgroundColor:
                type === viewType ? 'rgba(255, 255, 255, 0.11)' : '',
            }}
          >
            <Icon path={icon} size={0.75} />
            {name}
          </AddViewRow>
        );
      })}
    </DropdownContainer>
  );
};

export default NewViewModal;
