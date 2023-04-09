import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline } from '@mdi/js';
import React, { useCallback, useContext } from 'react';
import { DatabaseContext } from '../../../context/context';
import { deleteDoc, doc } from 'firebase/firestore';
import { useMatch, useNavigate } from 'react-router-dom';

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

const CardDone = ({ dbItem: { id }, removeDbItem }) => {
  const { userDbRef } = useContext(DatabaseContext);

  const navigate = useNavigate();

  const match = useMatch('todo-list-react/:viewId');
  // const
  console.log('match: ', match);

  const handleRemoveDbItem = useCallback(
    async (e) => {
      // container has onClick event that opens sidebar but if we click the isDone button we don't want to open the sidebar. Ugly fix but I believe it works
      e.stopPropagation();
      e.preventDefault();
      if (!match) navigate('../');

      removeDbItem(id);

      if (!userDbRef) return;

      try {
        const docRef = doc(userDbRef, 'dbItems', id);
        await deleteDoc(docRef);
      } catch (error) {
        console.log('Error removing document: ', error);
      }
    },
    [match, navigate, removeDbItem, id, userDbRef],
  );

  return (
    <DoneContainer onClick={handleRemoveDbItem}>
      <Icon path={mdiCheckboxBlankOutline} size={0.8} />
      <p>Done</p>
    </DoneContainer>
  );
};

export default CardDone;
