function MonthCalendar() {
  const days = [
    31, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 1, 2, 3, 4
  ];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="month-view">

      <div className="month-header">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="month-grid">
        {days.map((day, index) => (
          <div className="month-cell" key={index}>
            <span>{day}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MonthCalendar;