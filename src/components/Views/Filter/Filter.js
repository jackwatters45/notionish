import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import FilterModal from './FilterPopup/FilterModal';

const FilterButton = styled.div`
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

const Filter = (props) => {
  const buttonRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClickFilter = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const { selectedView } = props;
  const isFilter = useMemo(() => {
    return !!selectedView?.filter.length;
  }, [selectedView]);

  return (
    <div>
      <FilterButton
        ref={buttonRef}
        onClick={handleClickFilter}
        style={{ color: isFilter && 'rgb(35, 131, 226)' }}
      >
        Filter
      </FilterButton>
      {isModalVisible && (
        <FilterModal buttonRef={buttonRef} closeModal={closeModal} {...props} />
      )}
    </div>
  );
};

export default Filter;
