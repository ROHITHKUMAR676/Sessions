import {
  Search,
  Printer,
  Share,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "@carbon/icons-react";

function CalendarToolbar({
  calendarRef,
  currentView,
  query,
  title,
  onQueryChange,
  onTitleChange,
  onViewChange,
}) {
  const changeView = (view) => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.changeView(view);
    onTitleChange(calendarApi.view.title);
    onViewChange(view);
  };

  const goPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    onTitleChange(calendarApi.view.title);
  };

  const goNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    onTitleChange(calendarApi.view.title);
  };

  const goToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    onTitleChange(calendarApi.view.title);
  };

  const printCalendar = () => {
    window.print();
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <span>{title}</span>

        <button type="button" onClick={goPrev} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>

        <button type="button" onClick={goNext} aria-label="Next">
          <ChevronRight size={16} />
        </button>

        <button
          className="today-btn"
          onClick={goToday}
        >
          Today
        </button>

        <label className="calendar-search-field">
          <Search size={16} />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
            aria-label="Search sessions"
          />
        </label>
      </div>

      <div className="toolbar-right">
        <button type="button" aria-label="Print calendar" onClick={printCalendar}>
          <Printer size={16} />
        </button>
        <Share size={16} />

        <label className="calendar-view-select">
          <select
            value={currentView}
            onChange={(e) =>
              changeView(e.target.value)
            }
          >
            <option value="dayGridMonth">
              Month
            </option>

            <option value="timeGridWeek">
              Week
            </option>

            <option value="timeGridDay">
              Day
            </option>

            <option value="listWeek">
              Schedules
            </option>
          </select>
          <ChevronDown size={16} />
        </label>
      </div>
    </div>
  );
}

export default CalendarToolbar;
