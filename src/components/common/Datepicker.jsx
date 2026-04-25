import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';

const Datepicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  disabled = false,
  minDate,
  maxDate,
  showTimePicker = false,
  format = 'DD/MM/YYYY',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
    if (onChange) {
      onChange(date);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Week days header
    const weekDaysHeader = (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateSelect(date)}
          disabled={isDisabled}
          className={`p-2 text-sm rounded hover:bg-blue-100 transition-colors ${
            isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
          } ${isToday ? 'font-bold border border-blue-300' : ''} ${
            isDisabled ? 'text-gray-300 cursor-not-allowed' : ''
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        {weekDaysHeader}
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className={`datepicker relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          readOnly
          disabled={disabled}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`absolute inset-y-0 right-0 px-3 flex items-center ${
            disabled ? 'text-gray-400' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiCalendar className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ minWidth: '280px' }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ‹
            </button>
            <div className="font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ›
            </button>
          </div>
          {renderCalendar()}
          <div className="flex justify-end p-4 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datepicker;
