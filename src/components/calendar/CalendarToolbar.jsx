import {
  Button,
  IconButton,
  Search,
  Select,
  SelectItem,
} from "@carbon/react";

import {
  Printer,
  Share,
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

        <IconButton kind="ghost" size="sm" label="Previous" onClick={goPrev}>
          <ChevronLeft size={16} />
        </IconButton>

        <IconButton kind="ghost" size="sm" label="Next" onClick={goNext}>
          <ChevronRight size={16} />
        </IconButton>

        <Button
          kind="secondary"
          size="lg"
          className="today-btn"
          onClick={goToday}
        >
          Today
        </Button>

        <Search
          id="calendar-search"
          size="lg"
          labelText="Search sessions"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search"
          className="calendar-search-field"
        />
      </div>

      <div className="toolbar-right">
        <IconButton kind="ghost" size="lg" label="Print calendar" onClick={printCalendar}>
          <Printer size={16} />
        </IconButton>
        <IconButton kind="ghost" size="lg" label="Share calendar">
          <Share size={16} />
        </IconButton>

        <Select
          id="calendar-view-select"
          labelText="Calendar view"
          hideLabel
          value={currentView}
          onChange={(event) => changeView(event.target.value)}
          className="calendar-view-select"
        >
          <SelectItem value="dayGridMonth" text="Month" />
          <SelectItem value="timeGridWeek" text="Week" />
          <SelectItem value="timeGridDay" text="Day" />
          <SelectItem value="listWeek" text="Schedules" />
        </Select>
      </div>
    </div>
  );
}

export default CalendarToolbar;
