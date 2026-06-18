import { ArrowLeft, ChevronLeft, ChevronRight } from "@carbon/icons-react";
import { useMemo, useState } from "react";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

function MiniCalendar({
  calendarRef,
  filters,
  onClose,
  onFiltersChange,
  onNavigate,
}) {
  const [displayDate, setDisplayDate] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 13));

  const updateFilter = (field, checked) => {
    onFiltersChange((current) => ({
      ...current,
      [field]: checked,
    }));
  };

  const calendarDays = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const start = new Date(year, month, 1 - firstOfMonth.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return date;
    });
  }, [displayDate]);

  const moveDisplayMonth = (offset) => {
    setDisplayDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectDate = (date) => {
    const calendarApi = calendarRef.current?.getApi();

    setSelectedDate(date);
    setDisplayDate(new Date(date.getFullYear(), date.getMonth(), 1));

    if (calendarApi) {
      calendarApi.gotoDate(date);
      onNavigate?.();
    }
  };

  const isSameDate = (left, right) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-topbar">
        <button type="button" aria-label="Close mini calendar" onClick={onClose}>
          <ArrowLeft size={14} />
        </button>
      </div>

      <div className="mini-calendar-header">
        <button type="button" aria-label="Previous month" onClick={() => moveDisplayMonth(-1)}>
          <ChevronLeft size={14} />
        </button>
        <span>{monthFormatter.format(displayDate)}</span>
        <button type="button" aria-label="Next month" onClick={() => moveDisplayMonth(1)}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="mini-calendar-days">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div className="mini-weekday" key={`${day}-${index}`}>{day}</div>
        ))}

        {calendarDays.map((date) => (
          <button
            className={isSameDate(date, selectedDate) ? "selected-mini-day" : ""}
            key={date.toISOString()}
            type="button"
            onClick={() => selectDate(date)}
          >
            {date.getDate()}
          </button>
        ))}
      </div>

      <div className="mini-calendar-filters">
        <label>
          <input
            type="checkbox"
            checked={filters.mySessions}
            onChange={(event) =>
              updateFilter("mySessions", event.target.checked)
            }
          />
          My Sessions
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.teamSessions}
            onChange={(event) =>
              updateFilter("teamSessions", event.target.checked)
            }
          />
          Team Sessions
        </label>
      </div>
    </div>
  );
}

export default MiniCalendar;
