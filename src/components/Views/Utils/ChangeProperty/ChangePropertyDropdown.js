import React, { useContext, useMemo } from 'react';
import { DatabaseContext } from '../../../../context/context';
import useModal from '../../../utils/custom/useModal';
import { doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import SearchDropdown from '../SearchDropdown';

const Container = styled.div`
  min-width: 300px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--secondary-background-color);
  transition: background 20ms ease-in 0s;
  padding: 6px 4px;
  border-radius: 4px;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
`;

const ChangePropertyDropdown = ({
  selectedView,
  setViews,
  property,
  type,
  properties,
  buttonRef,
  closeDropdown,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const dropdownProps = useModal(buttonRef, closeDropdown);

  const handleSelectProperty = async (clickedProp) => {
    setViews((prevViews) =>
      prevViews.map((view) => {
        return view === selectedView
          ? {
              ...view,
              [type]: view[type].map((el) => {
                return property === el.property
                  ? { ...el, property: clickedProp }
                  : el;
              }),
            }
          : view;
      }),
    );

    if (!userDbRef) return;

    try {
      await updateDoc(doc(userDbRef, 'views', selectedView.id), {
        ...selectedView,
        [type]: selectedView[type].map((el) => {
          return property === el.property
            ? { ...el, property: clickedProp }
            : el;
        }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const alreadyUsed = useMemo(() => {
    return selectedView[type];
  }, [selectedView, type]);

  return (
    <Container {...dropdownProps}>
      <SearchDropdown
        alreadyUsed={alreadyUsed}
        handleSelectProperty={handleSelectProperty}
        text={'Search for a property...'}
        properties={properties}
      />
    </Container>
  );
};

export default ChangePropertyDropdown;
