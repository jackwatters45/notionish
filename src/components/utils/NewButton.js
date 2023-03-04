import React, { forwardRef } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

const StyledButton = styled.button`
  gap: 6px;
  margin-top: 4px;
  color: var(--secondary-font-color);
  display: flex;
  padding: 6px 8px 6px 2px;
  height: fit-content;
`;

const NewButton = forwardRef(
  ({ onClick, className, text, width = 248 }, ref) => {
    return (
      <StyledButton
        ref={ref}
        className={className}
        onClick={onClick}
        style={{
          width: typeof width === 'number' ? `${width}px` : 'fit-content',
        }}
      >
        <Icon path={mdiPlus} size={0.9} />
        <p style={{ marginTop: '2px' }}>{text}</p>
      </StyledButton>
    );
  },
);

export default NewButton;
