import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import TextProperty from '../Properties/TextProperty';
import { SidebarContext } from '../MainContent';
import PropertyLabel from './PropertyLabel';
import { tabPress } from '../utils/cursorHelpers';
import Icon from '@mdi/react';
import {
  mdiArrowDownDropCircleOutline as dropdownIcon,
  mdiFormatListBulleted as bulletedListIcon,
  mdiClockTimeNineOutline as clockIcon,
  mdiCheckboxOutline as checkboxIcon,
  mdiCheckboxBlankOutline as emptyCheckboxIcon,
  mdiCalendarMonth as calendarIcon,
} from '@mdi/js';
import UrlProperty from '../Properties/UrlProperty';
import NotesProperty from '../Properties/NotesProperty';
import DateProperty from '../Properties/Date/DateProperty';
import SelectProp from '../Properties/Select/SelectProperty';

const SidebarContentContainer = styled.div`
  padding: 48px 48px 0 48px;
`;

// TODO once I start adding properties -> make rows responsive (flex)
const PropertiesContainer = styled.form`
  display: grid;
  height: 100%;
  grid-template-columns: 140px 1fr;
  grid-template-rows: repeat(7, auto) 1fr;
  & > * {
    display: flex;
    gap: 8px;
  }
`;

const TodoName = styled(TextProperty)`
  margin: 0 0 10px 0;
  font-size: 30px;
  font-weight: 700;
  grid-column: 1 / -1;
`;

const PropertyStyle = css`
  padding: 6px 8px 7px;
  height: fit-content;
  &:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;
const StyledTextInput = styled(TextProperty)`
  ${PropertyStyle}
`;
const StyledUrlInput = styled(UrlProperty)`
  ${PropertyStyle}
`;

const StyledSelect = styled(SelectProp)`
  &:focus {
    background: rgb(37, 37, 37);
    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  }
`;

const StyledDateInput = styled(DateProperty)`
  padding: 6px 8px 7px;
  height: fit-content;
`;

const DoneButton = styled(Icon)`
  cursor: pointer;
  align-self: start;
  margin: 6px 8px 7px;
  color: var(--main-font-color);
`;

const StyledHr = styled.hr`
  grid-column: 1 / -1;
`;

const StyledNotes = styled(NotesProperty)`
  height: 100%;
  width: 100%;
  grid-column: 1 / -1;
  margin: 10px 0;
`;

const SidebarContents = () => {
  const { selectedTodo, handleRemoveTodoAndSidebar } =
    useContext(SidebarContext);

  useEffect(() => {
    window.addEventListener('keydown', tabPress);
    return () => window.removeEventListener('keydown', tabPress);
  }, []);

  return (
    <SidebarContentContainer>
      <PropertiesContainer id="properties">
        <TodoName property={'name'} todo={selectedTodo} autoFocus />
        <PropertyLabel icon={dropdownIcon} property={'Project'} />
        <StyledSelect
          property={'project'}
          todo={selectedTodo}
          disabled={true}
        />
        <PropertyLabel icon={bulletedListIcon} property={'Priority'} />
        <StyledUrlInput property={'priority'} todo={selectedTodo} />
        <PropertyLabel icon={calendarIcon} property={'Date'} />
        <StyledDateInput property={'date'} type={'date'} todo={selectedTodo} />
        <PropertyLabel icon={clockIcon} property={'Time Created'} />
        <StyledTextInput
          property={'created'}
          type={'date'}
          styledValue={selectedTodo.created.toDateString()}
          todo={selectedTodo}
          disabled={true}
        />
        <PropertyLabel icon={checkboxIcon} property={'Done?'} />
        <DoneButton
          path={emptyCheckboxIcon}
          size={0.85}
          onClick={handleRemoveTodoAndSidebar}
        />
        <StyledHr />
        <StyledNotes
          property={'notes'}
          todo={selectedTodo}
          placeholder={'Add notes here...'}
        />
      </PropertiesContainer>
    </SidebarContentContainer>
  );
};

export default SidebarContents;
