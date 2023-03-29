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

const AddGroup = ({ width, groups, propertyId, propertyName }) => {
  const { userDbRef, setProperties } = useContext(DatabaseContext);

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const handleClickAddGroupBtn = () => setIsAddingGroup(true);

  const [groupInput, setGroupInput] = useState('');
  const handleChange = (e) => setGroupInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGroup = { name: groupInput, id: uuid() };
    setIsAddingGroup(false);
    setGroupInput();

    // TODO Broken
    setProperties((prev) =>
      prev.map((prop) => {
        return prop.id === propertyName
          ? { ...prop, values: [...groups, newGroup] }
          : prop;
      }),
    );

    const addGroupToFirestore = async () => {
      const propertyRef = doc(userDbRef, 'properties', propertyId);
      await updateDoc(propertyRef, { values: [...groups, newGroup] });
    };
    addGroupToFirestore();
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
      width={width}
      onClick={handleClickAddGroupBtn}
      text={'Add New Project'}
    />
  );
};

export default AddGroup;
