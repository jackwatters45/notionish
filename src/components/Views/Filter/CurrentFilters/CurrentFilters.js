import Icon from '@mdi/react';
import React from 'react';
import styled from 'styled-components';
import { mdiClose } from '@mdi/js';
import propertyData from '../../../utils/helpers/propertyHelpers';
import PropertyDropdown from '../../Utils/PropertyDropdown';
import FilterTypeDropdown from './FilterTypeDropdown';
import FilterInput from './FilterInput';

const Container = styled.div`
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  padding: 1px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const CurrentFilters = ({
  selectedView,
  removeFilter,
  setViews,
  properties,
}) => {
  return (
    <Container>
      {selectedView.filter.map((filter) => {
        const { property, type, searchEl } = filter;
        const { icon } = propertyData[property.type];
        return (
          <Row key={property.id}>
            <LeftColumn>
              <PropertyDropdown
                type={'filter'}
                property={property}
                selectedView={selectedView}
                icon={icon}
                setViews={setViews}
                properties={properties}
              />
              <FilterTypeDropdown
                property={property}
                selectedView={selectedView}
                filterType={type}
                setViews={setViews}
                currentFilter={filter}
              />
              <FilterInput
                searchEl={searchEl}
                property={property}
                selectedView={selectedView}
                setViews={setViews}
                currentFilter={filter}
              />
            </LeftColumn>
            <StyledIcon
              onClick={() => removeFilter(property)}
              path={mdiClose}
              size={0.8}
            />
          </Row>
        );
      })}
    </Container>
  );
};

export default CurrentFilters;
