import React from 'react';
import viewsData from '../utils/helpers/viewHelpers';
import styled from 'styled-components';

const Container = styled.div`
  overflow: auto;
`;

const DatabaseContent = ({ selectedView, editedTodos }) => (
  <Container>
    {viewsData[selectedView.type].getComponent(editedTodos)}
  </Container>
);

export default DatabaseContent;
