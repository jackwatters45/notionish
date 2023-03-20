import React, { forwardRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import calendarDates, {
  isSameDay,
  getNextMonth,
  getPrevMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS,
  formatDateInput,
  SHORTENED_CALENDAR_MONTHS,
  isDate,
} from './calendarHelpers';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { DatabaseContext } from '../../utils/context/context';

const DropDown = styled.div`
  position: absolute;
  // margin: 30px 0px;
  width: 270px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  padding: 6px 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const InputDiv = styled.div`
  padding: 8px 14px;
  display: flex;
`;

const StyledInput = styled.input`
  display: flex;
  border-radius: 4px;
  height: 28px;
  background: rgba(255, 255, 255, 0.055);
  padding: 0 8px;
  width: 100%;
  box-shadow: rgb(15 15 15 / 20%) 0px 0px 0px 1px inset;
`;

const CalendarContainer = styled.div`
  width: 224px;
  align-self: center;
  display: flex;
  flex-direction: column;
  height: 250px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  text-align: left;
`;

const MonthYear = styled.h2`
  font-weight: 500;
  font-size: 14px;
  color: var(--main-font-color);
  padding: 0 8px;
`;

const Arrows = styled.div`
  display: flex;
`;

const Arrow = styled(Icon)`
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const CalendarTable = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 32px);
  grid-template-columns: repeat(7, 32px);
  & * {
    cursor: pointer;
    font-weight: normal;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TableHeader = styled.div`
  font-size: 12px;
  align-items: center;
  display: flex;
`;

const TodayCell = styled.div`
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;
const TodayCellBackgroundCircle = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: rgb(235, 87, 87);
`;
const SelectedCell = styled.div`
  border-radius: 4px;
  background-color: rgb(35, 131, 226);
`;
const RegularCell = styled.div`
  &:hover {
    background-color: rgba(255, 255, 255, 0.055);
    border-radius: 4px;
  }
`;

const DatePicker = forwardRef(({ style, data, propId }, ref) => {
  const { setTodos, todos } = useContext(DatabaseContext);

  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    const addDateToState = () => {
      const date = data.date || new Date();
      setDate(date);
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    };
    addDateToState();
  }, [data.date]);

  const changeDate = (date) => {
    setDate(date);
    setMonth(date.getMonth());
    setYear(date.getFullYear());

    const todosCopy = [...todos];
    const todoCopy = todosCopy.find(({ id }) =>  id === data.id);
    todoCopy[propId] = date;
    setTodos(todosCopy);
  };

  // Handlers
  const [dateInput, setDateInput] = useState('');
  const handleInput = (e) => setDateInput(e.target.value);
  const handleInputEnter = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    e.target.blur();

    const dateArr = e.target.value.toLowerCase().split(/[^a-zA-Z0-9]/);
    const parsedDateArr = dateArr.map((el) => parseInt(el).toString());
    // check if input contains a month name (vs all ints)
    const newMonth = SHORTENED_CALENDAR_MONTHS.find(
      (el) => dateArr[0].includes(el.name) || dateArr[1].includes(el.name),
    );

    if (!newMonth) {
      if (parsedDateArr[2].length % 2 !== 0 || parsedDateArr[2].length > 4)
        return;
      const newDate = new Date(parsedDateArr.join('/'));
      return isDate(newDate) ? changeDate(newDate) : false;
    }

    // if month is first 'arg'
    if (dateArr[0].includes(newMonth.name)) {
      if (parsedDateArr[2].length % 2 !== 0 || parsedDateArr[2].length > 4)
        return;
      const newDateString = `${newMonth.num + 1}/${dateArr[1]}/${dateArr[2]}`;
      const newDate = new Date(newDateString);
      return isDate(newDate) ? changeDate(newDate) : false;
    }
    // if month is second 'arg'
    if (dateArr[1].includes(newMonth.name)) {
      if (parsedDateArr[2].length % 2 !== 0 || parsedDateArr[2].length > 4)
        return;
      const newDateString = `${newMonth.num + 1}/${dateArr[0]}/${dateArr[2]}`;
      const newDate = new Date(newDateString);
      return isDate(newDate) ? changeDate(newDate) : false;
    }

    // not perfect and should def show an error message if invalid but I need to move on
  };

  useEffect(() => {
    if (!date) return;
    setDateInput(formatDateInput(date));
  }, [date]);

  const handleLeftArrowClick = () => {
    const { updatedMonth, updatedYear } = getPrevMonth(month, year);
    setMonth(updatedMonth);
    setYear(updatedYear);
  };

  const handleRightArrowClick = () => {
    const { updatedMonth, updatedYear } = getNextMonth(month, year);
    setMonth(updatedMonth);
    setYear(updatedYear);
  };

  const handleDayClick = (e) => {
    setTimeout(() => {
      const clickedDateIso = e.target.id.split(',');
      const newDate = new Date(...clickedDateIso);
      changeDate(newDate);
    });
  };

  // shared cell calendar attributes
  const getDefaultAttributes = (dateArr) => {
    return {
      onClick: handleDayClick,
      className: 'calendarCell',
      key: dateArr,
      id: dateArr,
      style: {
        color:
          dateArr[1] === month || isSameDay(new Date(...dateArr))
            ? 'var(--main-font-color)'
            : 'var(--empty-font-color)',
      },
    };
  };

  return (
    <DropDown id="datePicker" ref={ref} style={style}>
      <InputDiv>
        <StyledInput
          onChange={handleInput}
          onKeyDown={handleInputEnter}
          value={dateInput}
          autoFocus
        />
      </InputDiv>
      <CalendarContainer>
        <SecondRow>
          <MonthYear>
            {CALENDAR_MONTHS[month]} {year}
          </MonthYear>
          <Arrows>
            <Arrow
              onClick={handleLeftArrowClick}
              path={mdiChevronLeft}
              size={1}
            />
            <Arrow
              onClick={handleRightArrowClick}
              path={mdiChevronRight}
              size={1}
            />
          </Arrows>
        </SecondRow>
        <CalendarTable>
          {WEEK_DAYS.map((day) => (
            <TableHeader key={day}>{day}</TableHeader>
          ))}
          {calendarDates(month, year).map((dateArr) => {
            const defaultAttributes = getDefaultAttributes(dateArr);
            if (isSameDay(new Date(...dateArr), date)) {
              return (
                <SelectedCell {...defaultAttributes}>{dateArr[2]}</SelectedCell>
              );
            }
            if (isSameDay(new Date(...dateArr))) {
              return (
                <TodayCell {...defaultAttributes}>
                  <TodayCellBackgroundCircle>
                    {dateArr[2]}
                  </TodayCellBackgroundCircle>
                </TodayCell>
              );
            }
            return (
              <RegularCell {...defaultAttributes}>{dateArr[2]}</RegularCell>
            );
          })}
        </CalendarTable>
      </CalendarContainer>
    </DropDown>
  );
});

DatePicker.propTypes = {
  date: PropTypes.instanceOf(Date),
};

export default DatePicker;
