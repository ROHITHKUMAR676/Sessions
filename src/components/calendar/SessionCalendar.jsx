import "./SessionCalendar.scss";
import { useMemo, useRef, useState } from "react";

import FullCalendarView from "./FullCalendarView";
import MiniCalendar from "./MiniCalendar";
import CalendarToolbar from "./CalendarToolbar";

function SessionCalendar({
  sessions,
  onEventClick,
  onSlotClick,
}) {
  const calendarRef = useRef(null);
  const [filters, setFilters] = useState({
    mySessions: true,
    teamSessions: true,
  });
  const [query, setQuery] = useState("");
  const [calendarTitle, setCalendarTitle] = useState("June 2026");
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [miniCalendarOpen, setMiniCalendarOpen] = useState(true);

  const syncCalendarTitle = () => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      setCalendarTitle(calendarApi.view.title);
    }
  };

  const visibleSessions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sessions.filter((session) => {
      const scope = session.extendedProps?.scope || "my";
      const matchesScope =
        (scope === "my" && filters.mySessions) ||
        (scope === "team" && filters.teamSessions);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          session.title,
          session.extendedProps?.description,
          session.extendedProps?.sessionType,
          session.extendedProps?.facilitator,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          );

      return matchesScope && matchesQuery;
    });
  }, [filters, query, sessions]);

  return (
    <div className={`session-calendar-layout ${miniCalendarOpen ? "" : "mini-calendar-collapsed"}`}>
      {miniCalendarOpen ? (
        <div className="calendar-sidebar">
          <MiniCalendar
            calendarRef={calendarRef}
            filters={filters}
            onClose={() => setMiniCalendarOpen(false)}
            onFiltersChange={setFilters}
            onNavigate={syncCalendarTitle}
          />
        </div>
      ) : (
        <div className="calendar-sidebar-toggle">
          <button type="button" aria-label="Open mini calendar" onClick={() => setMiniCalendarOpen(true)}>
            <span />
          </button>
        </div>
      )}

      <div className="calendar-main">
        <CalendarToolbar
          calendarRef={calendarRef}
          currentView={currentView}
          query={query}
          title={calendarTitle}
          onQueryChange={setQuery}
          onTitleChange={setCalendarTitle}
          onViewChange={setCurrentView}
        />

        <FullCalendarView
  calendarRef={calendarRef}
  calendarTitle={calendarTitle}
  events={visibleSessions}
  currentView={currentView}
  onEventClick={onEventClick}
  onSlotClick={onSlotClick}
/>
      </div>
    </div>
  );
}

export default SessionCalendar;
