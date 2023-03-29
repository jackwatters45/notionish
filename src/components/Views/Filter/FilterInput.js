import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../context/context';
import { doc, updateDoc } from 'firebase/firestore';

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

const FilterInput = ({
  searchEl,
  property,
  selectedView,
  setViews,
  currentFilter,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const [input, setInput] = useState(searchEl);
  const handleChange = async (e) => {
    setInput(e.target.value);

    const updatedFilter = { ...currentFilter, searchEl: e.target.value };

    const updatedView = {
      ...selectedView,
      filter: selectedView.filter.map((filter) => {
        return filter.property === property ? updatedFilter : filter;
      }),
    };

    setViews((prevViews) =>
      prevViews.map((view) => (view === selectedView ? updatedView : view)),
    );

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), updatedView);
    } catch (e) {
      console.log(e);
    }
  };

  return <Input placeholder="Empty..." value={input} onChange={handleChange} />;
};

export default FilterInput;
