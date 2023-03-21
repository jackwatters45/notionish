import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../utils/theme';
import SelectDropdown from './SelectDropdown';
import usePopup from '../../utils/custom/usePopup';

const SelectContainer = styled.div`
  ${propertySharedStyle};
`;

const SelectButtonBackground = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
`;

const StyledContentEditable = styled(ContentEditable)`
  cursor: pointer;
  width: fit-content;
  background: rgb(90, 90, 90);
  padding: 0 6px;
  border-radius: 4px;
  height: 20px;
  margin: 0 0 0 6px;
`;

const SelectProperty = (props) => {
  const {
    innerRef: selectButtonRef,
    html,
    style: _,
    ...editableDivProps
  } = useEditableDiv({ ...props, disabled: true });

  const { isDropdown, ...popupProps } = usePopup(props, selectButtonRef);

  return (
    <SelectContainer>
      <SelectButtonBackground ref={selectButtonRef}>
        <StyledContentEditable {...editableDivProps} html={html.name} />
      </SelectButtonBackground>
      {isDropdown ? <SelectDropdown {...popupProps} /> : ''}
    </SelectContainer>
  );
};

export default SelectProperty;
