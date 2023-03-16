import React, { useState, useRef } from 'react';

interface DatePickerProps {
  // The currently selected date as a string
  selectedDate: string;
  // Function that is called when the date is changed by typing in the input
  onDateChange: (date: string) => void;
  // Function that is called when a date is picked from the calendar
  onDatePick: (date: Date) => void;
  // List of dates to be blacked out in the calendar
  blackoutDates: string[];
}

const DatePicker = ({
  selectedDate,
  onDateChange,
  onDatePick,
  blackoutDates,
}: DatePickerProps) => {
  // State variables
  const [showPopup, setShowPopup] = useState(false);
  const currentDate = new Date(selectedDate);
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  // Ref variables for the year and month dropdowns
  const yearDropdownRef = useRef<HTMLSelectElement>(null);
  const monthDropdownRef = useRef<HTMLSelectElement>(null);

  // Handler function for when the input date is changed
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //Check if regex is mm/dd/yyyy and if so, update the currentMonth and currentYear state
    const dateRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (dateRegex.test(event.target.value)) {
      const dateArray = event.target.value.split('/');
      const newMonth = Number(dateArray[0]) - 1;
      const newYear = Number(dateArray[2]);
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
    // Call the onDateChange function
    onDateChange(event.target.value);
  };

  // Handler function for toggling the calendar popup
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // Get the number of days in a month
  const getMonthDays = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get a matrix of dates for a given month
  const getDateMatrix = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getMonthDays(month, year);
    const daysInLastMonth = getMonthDays(month - 1, year);
    const dateMatrix = [];

    // Add days from last month
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInLastMonth - i;
      dateMatrix.push({ day, inMonth: false });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i;
      dateMatrix.push({ day, inMonth: true });
    }

    // Add days from next month
    for (let i = 1; i <= 42 - daysInMonth - firstDay; i++) {
      const day = i;
      dateMatrix.push({ day, inMonth: false });
    }

    return dateMatrix;
  };

  // Get the date matrix for the current month
  const currentDateMatrix = getDateMatrix(currentDate);

  // Short names of the days of the week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Handler function for when a date is clicked on the calendar
  const handleDatePick = (day: number, month: number, year: number) => {
    const newDate = new Date(year, month, day);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());

    // Call the onDatePick function
    onDatePick(newDate);
    // Hide the popup
    setShowPopup(false);
  };

  // Handler function for when the year dropdown is changed
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(event.target.value);
    setCurrentYear(newYear);
    onDateChange(`${currentMonth + 1}/1/${newYear}`);
  };

  // Handler function for when the month dropdown is changed
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(event.target.value);
    setCurrentMonth(newMonth);
    onDateChange(`${newMonth + 1}/1/${currentYear}`);
  };

  // Toggle the popup when the enter key is pressed, if the input is focused
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setShowPopup(!showPopup);
    }
  };

  // Check if a date is blacked out
  const isDateBlackout = (day: number, month: number, year: number) => {
    const dateString = `${(month + 1).toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}/${year}`;
    return blackoutDates.includes(dateString);
  };

  // Check if a date is valid
  const isValidDate = (dateString: string) => {
    const dateRegex = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    return true;
  };

  return (
    <div className='date-picker'>
      <div className='invalid-date'>
        {
          // Show the invalid date message if the date is invalid
          !isValidDate(selectedDate) && (
            <span>Invalid date format, should be MM/DD/YYYY</span>
          )
        }
      </div>
      <div className='date-picker-input'>
        <input
          type='text'
          value={selectedDate}
          onChange={handleDateChange}
          onFocus={() => setShowPopup(true)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handlePopupToggle}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
            <line x1='16' y1='2' x2='16' y2='6'></line>
            <line x1='8' y1='2' x2='8' y2='6'></line>
            <line x1='3' y1='10' x2='21' y2='10'></line>
          </svg>
        </button>
      </div>
      {showPopup && (
        <div className='date-picker-popup'>
          <div className='date-picker-popup-header'>
            <select
              ref={yearDropdownRef}
              value={currentYear}
              onChange={handleYearChange}
            >
              {/* Generate an array of years 50 years behind and 50 years ahead of the selected year and map through  */}
              {Array.from({ length: 50 }).map((_, index) => {
                const year = currentYear - 25 + index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <select
              ref={monthDropdownRef}
              value={currentMonth}
              onChange={handleMonthChange}
            >
              {/* Generate an array of months and map through */}
              {Array.from({ length: 12 }).map((_, index) => {
                const month = index;
                const monthName = new Date(0, month).toLocaleString(undefined, {
                  month: 'long',
                });
                return (
                  <option key={month} value={month}>
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='date-picker-popup-body'>
            <div className='date-picker-popup-days'>
              {dayNames.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className='date-picker-popup-dates'>
              {currentDateMatrix.map((date, index) => {
                const day = date.day;
                const inMonth = date.inMonth;
                const classNames = ['date-picker-popup-date'];
                if (!inMonth) classNames.push('other-month');
                if (isDateBlackout(day, currentMonth, currentYear))
                  classNames.push('blackout-date');
                return (
                  <div
                    key={index}
                    className={classNames.join(' ')}
                    onClick={() =>
                      handleDatePick(day, currentMonth, currentYear)
                    }
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
