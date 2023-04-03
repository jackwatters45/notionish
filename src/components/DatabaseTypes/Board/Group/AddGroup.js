import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import NewButton from '../../../utils/components/NewButton';
import { DatabaseContext } from '../../../../context/context';
import { v4 as uuid } from 'uuid';
import { doc, updateDoc } from 'firebase/firestore';

const AddGroupForm = styled.form`
  height: 33.59px;
  margin: 4px;
  min-width: 248px;
  border-radius: 4px;
  padding: 6px 8px 6px 2px;
  background-color: var(--section-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 10%) 0px 2px 4px;
`;

const GroupInput = styled.input`
  padding: 1px 2px;
  width: 100%;
`;

const StyledNewButton = styled(NewButton)`
  background-color: var(--section-background-color);
  margin: 4px;
`;

const AddGroup = ({ selectedProperty, setProperties }) => {
  const { userDbRef } = useContext(DatabaseContext);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const handleClickAddGroupBtn = () => setIsAddingGroup(true);

  const [groupInput, setGroupInput] = useState('');
  const handleChange = (e) => setGroupInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddingGroup(false);

    const newGroup = { name: groupInput, id: uuid() };
    setGroupInput();

    const values = [...selectedProperty.values, newGroup];
    const updatedProperty = { ...selectedProperty, values };

    setProperties((prev) =>
      prev.map((prop) => {
        return prop === selectedProperty ? updatedProperty : prop;
      }),
    );

    if (!userDbRef) return;
    
    try {
      const { id } = selectedProperty;
      await updateDoc(doc(userDbRef, 'properties', id), updatedProperty);
    } catch (e) {
      console.log(e);
    }
  };

  return isAddingGroup ? (
    <AddGroupForm onSubmit={handleSubmit}>
      <GroupInput
        autoFocus
        placeholder="Name your project..."
        required={true}
        onChange={handleChange}
      />
      <button style={{ display: 'none' }} type="submit" />
    </AddGroupForm>
  ) : (
    <StyledNewButton
      width={260}
      onClick={handleClickAddGroupBtn}
      text={'Add New Project'}
    />
  );
};

export default AddGroup;
