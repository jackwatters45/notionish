import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { ViewsContext } from '../MainContent';
import View from './View';
import NewViewPopup from './NewViewPopup';
import viewsData from '../utils/helpers/viewHelpers';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  color: var(--secondary-font-color);
  width: calc(100vw - 100px);
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

const ViewContainer = styled.div`
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
  margin-bottom: 4px;
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

const Option = styled.div`
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

const StyledHr = styled.hr`
  height: 1px;
  background: var(--card-background-color);
  margin-bottom: 10px;
`;

// filter or sort active - font is blue -> rgb(35, 131, 226);
// if view ? color ...

// TODO This is also gonna have to change the content being rendered but can't really do rn
const ViewsNav = ({ isHovered }) => {
  const { views } = useContext(ViewsContext);

  const [selectedView, setSelectedView] = useState(views[0]);
  const handleClickUnselectedView = (view) => setSelectedView(view);
  useEffect(() => {
    const isSelectedExists = views.find((view) => view === selectedView) 
    if(isSelectedExists) return 

    setSelectedView(views[0]);
  }, [selectedView, views]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  // const toggleAddingNew = () => setIsAddingNew(!isAddingNew);

  // TODO gonna need to set false eventually

  // const [isSortedPopup, setIsSortedPopup] = useState(false);
  // const [isFilteredPopup, setIsFilteredPopup] = useState(false);

  return (
    <NavContainer>
      <NavContent>
        <ViewsContainer>
          {views.map((view) => {
            const { type, name } = view;
            // eslint-disable-next-line no-unused-vars
            const { icon, getComponent } = viewsData[type];
            return view === selectedView ? (
              <View key={name} data={view} />
            ) : (
              <ViewContainer
                key={name}
                onClick={() => handleClickUnselectedView(view)}
              >
                <Icon path={icon} size={0.75} />
                {name}
              </ViewContainer>
            );
          })}
          {isHovered || isAddingNew ? (
            <NewViewPopup setIsAddingNew={setIsAddingNew} />
          ) : (
            ''
          )}
        </ViewsContainer>
        {isHovered ? (
          <Options>
            <Option>Filter</Option>
            <Option>Sort</Option>
          </Options>
        ) : (
          ''
        )}
      </NavContent>
      <StyledHr />
    </NavContainer>
  );
};

export default ViewsNav;
