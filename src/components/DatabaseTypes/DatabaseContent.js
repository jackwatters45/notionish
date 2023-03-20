import React from 'react';
import viewsData from '../utils/helpers/viewHelpers';

const DatabaseContent = ({ selectedView, editedTodos }) => (
  <>{viewsData[selectedView.type].getComponent(editedTodos)}</>
);

export default DatabaseContent;
