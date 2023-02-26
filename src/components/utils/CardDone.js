import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline } from '@mdi/js';
import React, { useContext } from 'react';
import { TodosContext } from '../MainContent';

const DoneContainer = styled.button`
  display: flex;
  gap: 2px;
  font-size: 12px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  color: var(--main-font-color);
  padding: 2px 1px;
`;

const CardDone = ({ todo }) => {
  const { handleRemoveTodo } = useContext(TodosContext);

  return (
    <DoneContainer onClick={() => handleRemoveTodo(todo.id)}>
      <Icon path={mdiCheckboxBlankOutline} size={0.8} />
      <p>Done</p>
    </DoneContainer>
  );
};

export default CardDone;
