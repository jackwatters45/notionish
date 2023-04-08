import React from 'react';
import viewsData from '../utils/helpers/viewHelpers';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Container = styled.div`
  overflow: auto;
`;

const DatabaseContent = (props) => {
  const { selectedView } = props;

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>{viewsData[selectedView.type].getComponent(props)}</Container>
    </DndProvider>
  );
};

export default DatabaseContent;
