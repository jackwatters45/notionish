import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';

const StyledContainer = styled.div`
  margin: 5px 0;
  height: 30px;
  align-self: start;
`;

const StyledIcon = styled(Icon)`
  margin: 1px 0 0 0;
`;

const PropertyLabel = ({icon, property}) => {
  return (
    <StyledContainer>
      <StyledIcon path={icon} size={0.75} />
      <p>{property}</p>
    </StyledContainer>
  );
};

export default PropertyLabel;
