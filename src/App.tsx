import React, { useState } from 'react';
import DatePicker from './components/DatePicker';
import './App.css';

interface AppProps {}

/**
 * Returns the formatted date string in the format of MM/DD/YYYY.
 * @param date - The date object to be formatted.
 * @returns The formatted date string.
 */
function getFormattedDate(date: Date): string {
  const dd: string | number = date.getDate().toString().padStart(2, '0');
  const mm: string | number = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy: string | number = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

const App: React.FC<AppProps> = () => {
  // State variables to store and set the selected date and the blackout dates.
  const [selectedDate, setSelectedDate] = useState<string>(
    getFormattedDate(new Date())
  );
  //Format of blackout dates strings in array should be: MM/DD/YYYY, testing with 2 dates for now
  // eslint-disable-next-line
  const [blackoutDates, setBlackoutDates] = useState<string[]>([
    '03/16/2023',
    '03/30/2023',
  ]);

  // Handles the date change event when the user types in the date.
  const onDateChange = (date: string): void => {
    setSelectedDate(date);
  };

  // Handles the date pick event when the user selects a date from the calendar.
  const onDatePick = (date: Date): void => {
    const formattedDate = getFormattedDate(date);
    setSelectedDate(formattedDate);
  };

  return (
    <div className='App'>
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        onDatePick={onDatePick}
        blackoutDates={blackoutDates}
      />
    </div>
  );
};

export default App;
