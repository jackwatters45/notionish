import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import View from './NewViews/View';
import viewsData from '../utils/helpers/viewHelpers';
import Filter from './Filter/Filter';
import Sort from './Sort/Sort';
import { Link } from 'react-router-dom';
import NewView from './NewViews/NewView/NewView';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  color: var(--secondary-font-color);
  width: 100%;
`;

const NavContent = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 40px;
`;

const ViewsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
`;

const UnselectedView = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  border-radius: 4px;
  max-width: 220px;
  font-weight: 700;
  margin-bottom: 6px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const Options = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
`;

const ViewsNav = ({
  selectedView,
  views,
  setViews,
  removeView,
  addView,
  properties,
}) => {
  return (
    <NavContainer>
      <NavContent>
        <ViewsContainer>
          {views.map((view) => {
            const { type, name } = view;
            const { icon } = viewsData[type];
            return view === selectedView ? (
              <View
                key={name}
                selectedView={view}
                views={views}
                setViews={setViews}
                removeView={removeView}
              />
            ) : (
              <Link to={`/${view.id}`} key={name}>
                <UnselectedView>
                  <Icon path={icon} size={0.75} />
                  {name}
                </UnselectedView>
              </Link>
            );
          })}
          <NewView views={views} addView={addView} />
        </ViewsContainer>
        <Options>
          <Filter
            selectedView={selectedView}
            setViews={setViews}
            properties={properties}
          />
          <Sort
            selectedView={selectedView}
            setViews={setViews}
            properties={properties}
          />
        </Options>
      </NavContent>
    </NavContainer>
  );
};

export default ViewsNav;
