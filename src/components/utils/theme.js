import { css } from 'styled-components';

export const propertySharedStyle = css`
  width: 100%;
  word-break: break-word;
  display: inline-block;
  color: var(--main-font-color);
  border-radius: 4px;
  align-self: start;
  justify-self: start;
  outline: none;
  user-select: none;
  transition: background 20ms ease-in 0s;
  text-decoration-color: var(--empty-font-color);
`;

export const hoverStyle = css`
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;
