// https://blog.logrocket.com/react-custom-datepicker-step-by-step/

// (int) The current year
export const THIS_YEAR = new Date().getFullYear();

// (int) The current month starting from 0 - 11
// 0 => January, 11 => December
export const THIS_MONTH = new Date().getMonth();

// Week day short names
export const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Calendar months names
export const CALENDAR_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SHORTENED_CALENDAR_MONTHS = [
  { name: 'jan', num: 0 },
  { name: 'feb', num: 1 },
  { name: 'mar', num: 2 },
  { name: 'apr', num: 3 },
  { name: 'may', num: 4 },
  { name: 'jun', num: 5 },
  { name: 'jul', num: 6 },
  { name: 'aug', num: 7 },
  { name: 'sep', num: 8 },
  { name: 'oct', num: 9 },
  { name: 'nov', num: 10 },
  { name: 'dec', num: 11 },
];

// Weeks displayed on calendar
export const CALENDAR_WEEKS = 6;

// Pads a string value with leading zeroes(0) until length is reached
// For example: zeroPad(5, 2) => "05"
export const zeroPad = (value) => parseInt(value.toString().padStart(2, '0'));

// (int) Number days in a month for a given year from 28 - 31
export const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
  const months30 = [3, 5, 8, 10];
  const leapYear = year % 4 === 0;
  return month === 1
    ? leapYear
      ? 29
      : 28
    : months30.includes(month)
    ? 30
    : 31;
};

// (int) First day of the month for a given year from 0 - 6
// 0 => Sunday, 6 => Saturday
export const getMonthFirstDay = (month = THIS_MONTH, year = THIS_YEAR) =>
  new Date(`${year}-${month + 1}-01`).getDay();

// (bool) Checks if a value is a date - this is just a simple check
export const isDate = (date) =>
  date &&
  Object.prototype.toString.call(date) === '[object Date]' &&
  !isNaN(date);

// (bool) Checks if two date values are of the same month and year
export const isSameMonth = (date, baseDate = new Date()) => {
  if (!(isDate(date) && isDate(baseDate))) return false;
  return (
    date.getMonth() === baseDate.getMonth() &&
    date.getFullYear() === baseDate.getFullYear()
  );
};

// (bool) Checks if two date values are the same day
export const isSameDay = (date, baseDate = new Date()) => {
  if (!(isDate(date) && isDate(baseDate))) return false;
  return (
    date.getDate() === baseDate.getDate() &&
    date.getMonth() === baseDate.getMonth() &&
    date.getFullYear() === baseDate.getFullYear()
  );
};

// (string) Formats the given date as YYYY-MM-DD
export const getDateISO = (date = new Date()) =>
  isDate(date)
    ? [
        date.getFullYear(),
        zeroPad(date.getMonth() + 1),
        zeroPad(date.getDate()),
      ].join('-')
    : null;

export const formatDateInput = (date) =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

// ({month, year}) Gets the month and year before the given month and year
// For example: getPreviousMonth(0, 2000) => {month: 11, year: 1999}
// while: getPreviousMonth(11, 2000) => {month: 10, year: 2000}
export const getPrevMonth = (month, year) =>
  month === 0
    ? { updatedMonth: 11, updatedYear: year - 1 }
    : { updatedMonth: month - 1, updatedYear: year };

// ({month, year}) Gets the month and year after the given month and year
// For example: getNextMonth(1, 2000) => {month: 2, year: 2000}
// while: getNextMonth(12, 2000) => {month: 1, year: 2001}
export const getNextMonth = (month, year) =>
  month === 11
    ? { updatedMonth: 1, updatedYear: year + 1 }
    : { updatedMonth: month + 1, updatedYear: year };

// Calendar builder for a month in the specified year
// Returns an array of the calendar dates.
// Each calendar date is represented as an array => [YYYY, MM, DD]
const calendarDates = (monthVal, yearVal) => {
  const month = monthVal ?? THIS_MONTH;
  const year = yearVal ?? THIS_YEAR;

  // Get number of days in the month and the month's first day
  const monthDays = getMonthDays(month, year);
  const monthFirstDay = getMonthFirstDay(month, year);

  // Get number of days to be displayed from previous and next months
  // These ensure a total of 42 days (6 weeks) displayed on the calendar
  const daysFromPrevMonth = monthFirstDay;
  const daysFromNextMonth =
    CALENDAR_WEEKS * 7 - (daysFromPrevMonth + monthDays);

  // Get the previous and next months and years
  const { updatedMonth: prevMonth, updatedYear: prevMonthYear } = getPrevMonth(
    month,
    year,
  );
  const { updatedMonth: nextMonth, updatedYear: nextMonthYear } = getNextMonth(
    month,
    year,
  );

  // Get number of days in previous month
  const prevMonthDays = getMonthDays(prevMonth, prevMonthYear);

  // Builds dates to be displayed from previous month
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((_, index) => {
    const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
    return [prevMonthYear, zeroPad(prevMonth), zeroPad(day)];
  });

  // Builds dates to be displayed from current month
  const thisMonthDates = [...new Array(monthDays)].map((_, index) => {
    const day = index + 1;
    return [year, zeroPad(month), zeroPad(day)];
  });

  // Builds dates to be displayed from next month
  const nextMonthDates = [...new Array(daysFromNextMonth)].map((_, index) => {
    const day = index + 1;
    return [nextMonthYear, zeroPad(nextMonth), zeroPad(day)];
  });

  // returns all dates from previous, current and next months
  return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
};

export default calendarDates;

export const findMonth = (
  dateArr,
  shortenedMonthList = SHORTENED_CALENDAR_MONTHS,
  monthList = CALENDAR_MONTHS,
) => {
  const lowerCaseDateArr = dateArr.map((datePart) => datePart.toLowerCase());

  return (
    shortenedMonthList.find((el) =>
      lowerCaseDateArr.some((datePart) =>
        datePart.includes(el.name.toLowerCase()),
      ),
    ) ||
    monthList.find((el) =>
      lowerCaseDateArr.some((datePart) => datePart.includes(el.toLowerCase())),
    )
  );
};

export const isValidYear = (year) => year.length % 2 === 0 && year.length <= 4;

export const createNewDate = (newMonth, dateArr) => {
  const dateIdx = dateArr[0].includes(newMonth.name);
  const dayIdx = dateIdx ? 1 : 0;

  const newDateString = `${newMonth.num + 1}/${dateArr[dayIdx]}/${dateArr[2]}`;

  const newDate = new Date(newDateString);
  return isDate(newDate) ? newDate : null;
};
