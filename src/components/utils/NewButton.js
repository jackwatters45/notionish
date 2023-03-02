import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

const StyledButton = styled.button`
  gap: 6px;
  margin-top: 4px;
  color: var(--secondary-font-color);
  display: flex;
  padding: 6px 6px 6px 2px;
  height: fit-content;
`;

const NewButton = ({ onClick, className, text, width = 248 }) => {
  return (
    <StyledButton
      className={className}
      onClick={onClick}
      style={{
        width: typeof width === 'number' ? `${width}px` : 'fit-content',
      }}
    >
      <Icon path={mdiPlus} size={.9} />
      <p>{text}</p>
    </StyledButton>
  );
};

export default NewButton;
