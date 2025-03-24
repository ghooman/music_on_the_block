import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.scss";

const CustomDatePicker = ({ minYear = 1940, maxYear = new Date().getFullYear(), defaultDate, onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(defaultDate || null);
    const [selectedYear, setSelectedYear] = useState(defaultDate ? defaultDate.getFullYear() : new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(defaultDate ? defaultDate.getMonth() : new Date().getMonth());
    const [yearOpen, setYearOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);

    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
    const months = Array.from({ length: 12 }, (_, i) =>
        new Date(2023, i).toLocaleString("en-US", { month: "long" })
    );

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth());
        if (onDateChange) onDateChange(date);
    };

    return (
    <DatePicker
      dateFormat="yyyy-MM-dd"
      selected={selectedDate}
      onChange={handleDateChange}
      placeholderText="YYYY-MM-DD"
      maxDate={new Date()}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="custom-header">
          <button
            onClick={() => {
              decreaseMonth();
              if (selectedMonth === 0) {
                setSelectedYear(selectedYear - 1);
              }
              setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
            }}
            disabled={prevMonthButtonDisabled}
          >
            &lt;
          </button>

          {/* 연도 선택 (클릭하면 드롭다운 표시) */}
          <div className="year-container">
            <p onClick={() => setYearOpen(!yearOpen)}>{selectedYear} <span>▼</span></p>
            {yearOpen && (
              <ul className="year-list">
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      changeYear(year);
                      setSelectedYear(year);
                      setYearOpen(false);
                    }}
                    className={year === selectedYear ? "active" : ""}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 월 선택 (클릭하면 드롭다운 표시) */}
          <div className="month-container">
            <p onClick={() => setMonthOpen(!monthOpen)}>{months[selectedMonth]} <span>▼</span></p>
            {monthOpen && (
              <ul className="month-list">
                {months.map((month, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      changeMonth(index);
                      setSelectedMonth(index);
                      setMonthOpen(false);
                    }}
                    className={index === selectedMonth ? "active" : ""}
                  >
                    {month}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => {
              increaseMonth();
              if (selectedMonth === 11) {
                setSelectedYear(selectedYear + 1);
              }
              setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
            }}
            disabled={nextMonthButtonDisabled}
          >
            &gt;
          </button>
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
