import { mdiDeleteOutline, mdiRenameBoxOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React, { forwardRef, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DatabaseContext } from '../../../context/context';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

const DropdownContainer = styled.div`
  position: absolute;
  width: 220px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 6px 0px;
  color: var(--main-font-color);
`;

const Row = styled.div`
  display: flex;
  gap: 4px;
  user-select: none;
  cursor: pointer;
  transition: background 20ms ease-in 0s;
  margin: 0 4px;
  padding: 0 8px;
  height: 28px;
  align-items: center;
  border-radius: 4px;
  gap: 8px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  transition: background 20ms ease-in 0s;
  margin: 0 4px;
  padding: 0 8px;
  min-height: 28px;
  align-items: center;
  border-radius: 4px;
`;

const StyledInput = styled.input`
  padding: 8px 4px;
`;

const ErrorMsg = styled.span`
  padding: 4px 4px 0;
  font-size: 12px;
  color: rgb(235, 87, 87);
`;

const ViewDropdown = forwardRef(
  (
    { style, data: selectedView, setIsDropdown, setViews, views, removeView },
    ref,
  ) => {
    const { userDbRef } = useContext(DatabaseContext);
    const viewRef = doc(userDbRef, 'views', selectedView.id);

    const [isRenaming, setIsRenaming] = useState(false);
    // TODO removed set timeout
    const handleClickRename = () => setIsRenaming(true);

    const [input, setInput] = useState('');
    const handleChange = (e) => setInput(e.target.value);
    const isErrorMsg = useMemo(
      () => !!views.find(({ name }) => name === input),
      [views, input],
    );

    const handleKeyDown = async (e) => {
      if (e.key !== 'Enter' || isErrorMsg || !input) return;
      setIsDropdown(false);

      const updatedView = { ...selectedView, name: input };

      const { id } = selectedView;
      setViews((prev) =>
        prev.map((view) => (view.id === id ? updatedView : view)),
      );

      try {
        await updateDoc(viewRef, updatedView);
      } catch (e) {
        console.error(e);
      }
    };

    const handleDeleteView = async () => {
      if (views.length < 2) return;

      removeView(selectedView.id);

      try {
        await deleteDoc(viewRef);
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <DropdownContainer ref={ref} style={style}>
        {!isRenaming ? (
          <>
            <Row onClick={handleClickRename}>
              <Icon path={mdiRenameBoxOutline} size={0.75} />
              Rename
            </Row>
            <Row onClick={handleDeleteView}>
              <Icon path={mdiDeleteOutline} size={0.75} />
              Delete view
            </Row>
          </>
        ) : (
          <>
            <InputRow>
              <StyledInput
                autoFocus
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {isErrorMsg && (
                <>
                  <hr />
                  <ErrorMsg>
                    A view named {input} already exists in this database.
                  </ErrorMsg>
                </>
              )}
            </InputRow>
          </>
        )}
      </DropdownContainer>
    );
  },
);

export default ViewDropdown;
