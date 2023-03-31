import React from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../utils/theme';
import SelectDropdown from './SelectDropdown';
import useModal from '../../utils/custom/useModal';

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

const ButtonContainer = styled.div`
  height: inherit;
  width: inherit;
`;

const SelectProperty = (props) => {
  const {
    innerRef: selectButtonRef,
    html,
    style: _,
    ...editableDivProps
  } = useEditableDiv({ ...props, disabled: true });

  const { isDropdown, ...popupProps } = useModal(selectButtonRef, props);

  // html used to be html.name below
  return (
    <SelectContainer>
      <ButtonContainer ref={selectButtonRef}>
        {html && (
          <SelectButtonBackground>
            <StyledContentEditable {...editableDivProps} html={html.name} />
          </SelectButtonBackground>
        )}
      </ButtonContainer>
      {isDropdown ? <SelectDropdown {...popupProps} /> : ''}
    </SelectContainer>
  );
};

export default SelectProperty;
