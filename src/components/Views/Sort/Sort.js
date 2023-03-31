import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import SortModal from './SortDropdown/SortModal';

const SortButton = styled.div`
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 28px;
  border-radius: 3px;
  padding: 6px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const Sort = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickSort = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { selectedView } = props;
  const isSort = useMemo(() => !!selectedView?.sort.length, [selectedView]);

  return (
    <div>
      <SortButton
        ref={buttonRef}
        onClick={handleClickSort}
        style={{ color: isSort && 'rgb(35, 131, 226)' }}
      >
        Sort
      </SortButton>
      {isModalVisible && (
        <SortModal buttonRef={buttonRef} closeModal={closeModal} {...props} />
      )}
    </div>
  );
};

export default Sort;
