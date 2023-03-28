import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline } from '@mdi/js';
import React, { useCallback, useContext } from 'react';
import { DatabaseContext } from '../../../context/context';
import { deleteDoc, doc } from 'firebase/firestore';

const DoneContainer = styled.button`
  display: flex;
  gap: 2px;
  font-size: 12px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  color: var(--main-font-color);
  padding: 2px 1px;
  cursor: pointer;
`;

const CardDone = ({ dbItem: { id } }) => {
  const { userDbRef, removeDbItem } = useContext(DatabaseContext);

  const handleRemoveDbItem = useCallback(async () => {
    try {
      removeDbItem(id);
      const docRef = doc(userDbRef, 'dbItems', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.log('Error removing document: ', error);
    }
  }, [removeDbItem, id, userDbRef]);

  return (
    <DoneContainer onClick={handleRemoveDbItem}>
      <Icon path={mdiCheckboxBlankOutline} size={0.8} />
      <p>Done</p>
    </DoneContainer>
  );
};

export default CardDone;
