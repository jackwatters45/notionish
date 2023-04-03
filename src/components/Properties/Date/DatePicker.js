import React, { useContext, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import calendarDates, {
  isSameDay,
  getNextMonth,
  getPrevMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS,
  formatDateInput,
  isDate,
  findMonth,
  isValidYear,
  createNewDate,
} from './calendarHelpers';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { DatabaseContext } from '../../../context/context';
import useModal from '../../utils/custom/useModal';
import { doc, updateDoc } from 'firebase/firestore';
import { hoverStyle } from '../../../context/theme';

const DropDown = styled.div`
  position: absolute;
  width: 270px;
  background: var(--secondary-background-color);
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
    rgb(15 15 15 / 20%) 0px 3px 6px, rgb(15 15 15 / 40%) 0px 9px 24px;
  border-radius: 20px;
  overflow: hidden;
  padding: 6px 0 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const InputForm = styled.form`
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
    ${hoverStyle}
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

const ClearButton = styled.div`
  padding: 12px 24px 10px;
  box-shadow: rgb(255 255 255 / 13%) 0px 1px inset;
  user-select: none;
  transition: background 20ms ease-in 0s;
  cursor: pointer;
  :hover {
    ${hoverStyle}
  }
`;

const DatePicker = ({
  data,
  selectedProperty,
  setDbItems,
  buttonRef,
  closeDatePicker,
}) => {
  const { userDbRef } = useContext(DatabaseContext);

  const datePickerProps = useModal(buttonRef, closeDatePicker);

  const currentDate = new Date();
  const initialDate = data?.Date ?? null;
  const initialMonth = initialDate
    ? initialDate.getMonth()
    : currentDate.getMonth();
  const initialYear = initialDate
    ? initialDate.getFullYear()
    : currentDate.getFullYear();

  const [date, setDate] = useState(initialDate);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const clearDate = () => {
    changeDate(null);
  };

  const changeDate = async (date) => {
    setDate(date);
    setMonth(date ? date.getMonth() : new Date().getMonth());
    setYear(date ? date.getFullYear() : new Date().getFullYear());

    const updatedProperty = { ...data, [selectedProperty.name]: date };
    setDbItems((prevDbItems) =>
      prevDbItems.map((item) => {
        return item.id === data.id ? updatedProperty : item;
      }),
    );

    if (!userDbRef) return;
    
    try {
      await updateDoc(doc(userDbRef, 'dbItems', data.id), updatedProperty);
    } catch (e) {
      console.log(e);
    }
  };

  const [dateInput, setDateInput] = useState('');
  const handleInput = (e) => setDateInput(e.target.value);
  useEffect(() => {
    setDateInput(date ? formatDateInput(date) : '');
  }, [date]);

  const handleSubmitInput = (e) => {
    e.preventDefault();

    const dateArr = dateInput.toLowerCase().split(/[^a-zA-Z0-9]/);
    const parsedDateArr = dateArr.map((el) => parseInt(el));

    if (!isValidYear(dateArr[2])) return null;

    const newMonth = findMonth(dateArr);
    if (!newMonth) {
      const newDate = new Date(parsedDateArr.join('/'));
      return isDate(newDate) ? changeDate(newDate) : false;
    }

    const newDate = createNewDate(newMonth, dateArr);
    if (newDate) changeDate(newDate);
  };

  const handleLeftArrowClick = () => {
    try {
      const { updatedMonth, updatedYear } = getPrevMonth(month, year);
      setMonth(updatedMonth);
      setYear(updatedYear);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRightArrowClick = () => {
    try {
      const { updatedMonth, updatedYear } = getNextMonth(month, year);
      setMonth(updatedMonth);
      setYear(updatedYear);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDayClick = (e) => {
    const clickedDateIso = e.target.id.split(',');
    const newDate = new Date(...clickedDateIso);
    changeDate(newDate);
  };

  // shared cell calendar attributes
  const getDefaultAttributes = (dateArr) => {
    const fontColor =
      dateArr[1] === month || isSameDay(new Date(...dateArr))
        ? 'var(--main-font-color)'
        : 'var(--empty-font-color)';

    return {
      onClick: handleDayClick,
      id: dateArr,
      style: { color: fontColor },
    };
  };

  return (
    <DropDown {...datePickerProps}>
      <InputForm onSubmit={handleSubmitInput}>
        <StyledInput onChange={handleInput} value={dateInput} autoFocus />
        <button style={{ display: 'none' }} type="submit" />
      </InputForm>
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
            const currentDay = new Date(...dateArr);
            const isToday = isSameDay(currentDay);
            const isSelectedDay = isSameDay(currentDay, date);

            return (
              <Fragment key={currentDay.toLocaleDateString()}>
                {isSelectedDay ? (
                  <SelectedCell {...defaultAttributes}>
                    {dateArr[2]}
                  </SelectedCell>
                ) : isToday ? (
                  <TodayCell {...defaultAttributes}>
                    <TodayCellBackgroundCircle>
                      {dateArr[2]}
                    </TodayCellBackgroundCircle>
                  </TodayCell>
                ) : (
                  <RegularCell {...defaultAttributes}>{dateArr[2]}</RegularCell>
                )}
              </Fragment>
            );
          })}
        </CalendarTable>
      </CalendarContainer>
      <ClearButton onClick={clearDate}>Clear</ClearButton>
    </DropDown>
  );
};

// TODO ad prop types
DatePicker.propTypes = {
  date: PropTypes.instanceOf(Date),
};

export default DatePicker;
