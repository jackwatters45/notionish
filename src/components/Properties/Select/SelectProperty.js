import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import useEditableDiv from '../../utils/custom/useEditableDiv';
import { propertySharedStyle } from '../../utils/theme';
import SelectDropdown from './SelectDropdown';

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
  const buttonRef = useRef();

  const { html, ...editableDivProps } = useEditableDiv({
    ...props,
    disabled: true,
  });

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleClickSelectButton = () => setIsDropdownVisible(true);
  const closeDropdown = () => setIsDropdownVisible(false);

  const { name } = html;

  // TODO placeholder
  return (
    <SelectContainer>
      <ButtonContainer onClick={handleClickSelectButton} ref={buttonRef}>
        {html && (
          <SelectButtonBackground>
            <StyledContentEditable html={name} {...editableDivProps} />
          </SelectButtonBackground>
        )}
      </ButtonContainer>
      {isDropdownVisible && (
        <SelectDropdown
          buttonRef={buttonRef}
          closeDropdown={closeDropdown}
          {...props}
        />
      )}
    </SelectContainer>
  );
};

export default SelectProperty;
