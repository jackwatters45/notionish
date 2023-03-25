import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../context/context';

const Input = styled.input`
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgb(32, 32, 32);
  height: 32px;
  padding: 0 8px;
  color: var(--main-font-color);
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  &:hover {
    background: var(--card-background-color);
  }
`;

const FilterInput = ({ searchEl, property, selectedView }) => {
  const { views, setViews } = useContext(DatabaseContext);

  const [input, setInput] = useState(searchEl);
  const handleChange = (e) => {
    setInput(e.target.value);

    const viewsCopy = [...views];
    const getSelected = viewsCopy.find((view) => view === selectedView);
    const editedFilter = getSelected.filter.find(
      (filter) => filter.property === property,
    );
    editedFilter.searchEl = e.target.value;
    setTimeout(() => setViews(viewsCopy));
  };

  return <Input placeholder="Empty..." value={input} onChange={handleChange} />;
};

export default FilterInput;
