import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

function FullCalendarView({
  calendarRef,
  calendarTitle,
  currentView,
  events,
  onEventClick,
}) {
  const dateKeyFormatter = new Intl.DateTimeFormat("en-CA");
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    meridiem: "short",
  });

  const scheduleGroups = () => {
    const calendarApi = calendarRef.current?.getApi();
    const rangeStart = calendarApi?.view?.activeStart || new Date(2026, 5, 14);
    const rangeEnd = calendarApi?.view?.activeEnd || new Date(2026, 5, 21);
    const grouped = new Map();

    events
      .filter((event) => {
        const start = new Date(event.start);

        return start >= rangeStart && start < rangeEnd;
      })
      .sort((left, right) => new Date(left.start) - new Date(right.start))
      .forEach((event) => {
        const start = new Date(event.start);
        const key = dateKeyFormatter.format(start);

        if (!grouped.has(key)) {
          grouped.set(key, {
            date: start,
            events: [],
          });
        }

        grouped.get(key).events.push(event);
      });

    return Array.from(grouped.values());
  };

  const formatScheduleTime = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "12 - 11 AM";
    }

    return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
  };

  const renderDayHeader = (info) => {
    if (currentView === "dayGridMonth") {
      return (
        <span className="calendar-month-header">
          {info.date.toLocaleDateString("en-US", { weekday: "long" })}
        </span>
      );
    }

    if (currentView !== "timeGridWeek" && currentView !== "timeGridDay") {
      return info.text;
    }

    return (
      <span className="calendar-day-header">
        <span>{info.date.toLocaleDateString("en-US", { weekday: "long" })}</span>
        <strong>{info.date.getDate()}</strong>
      </span>
    );
  };

  return (
    <div className={`full-calendar-surface ${currentView === "listWeek" ? "schedule-view-active" : ""}`}>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        initialDate="2026-06-13"
        headerToolbar={false}
        events={events}
        height="690px"
        slotMinTime="07:00:00"
        slotMaxTime="25:00:00"
        slotDuration="01:00:00"
        slotLabelFormat={{
          hour: "numeric",
          meridiem: "short",
        }}
        allDaySlot={false}
        nowIndicator
        dayMaxEventRows={3}
        eventDisplay="block"
        displayEventTime={false}
        dayHeaderFormat={{ weekday: "long" }}
        dayHeaderContent={renderDayHeader}
        eventTimeFormat={{
          hour: "numeric",
          meridiem: "short",
        }}
        listDayFormat={{
          weekday: "long",
          day: "numeric",
        }}
        listDaySideFormat={{
          month: "short",
        }}
        eventContent={(info) => (
          <span
            className="calendar-event-pill"
            style={{
              backgroundColor: info.event.backgroundColor,
              color: info.event.textColor,
            }}
          >
            {info.event.title}
          </span>
        )}
        eventClick={(info) => {
          onEventClick(info.event);
        }}
      />

      {currentView === "listWeek" && (
        <div className="custom-schedule-view" aria-label={`Schedules for ${calendarTitle}`}>
          {scheduleGroups().map((group) => (
            <div className="schedule-day-group" key={dateKeyFormatter.format(group.date)}>
              <div className="schedule-date-cell">
                <strong>{weekdayFormatter.format(group.date)}</strong>
                <span>
                  {group.date.getDate()} <small>{monthFormatter.format(group.date)}</small>
                </span>
              </div>

              <div className="schedule-events-cell">
                {group.events.map((event) => (
                  <button
                    className="schedule-event-row"
                    key={event.id}
                    type="button"
                    onClick={() => onEventClick(event)}
                  >
                    <span className="schedule-event-time">{formatScheduleTime(event)}</span>
                    <span
                      className="calendar-event-pill"
                      style={{
                        backgroundColor: event.backgroundColor,
                        color: event.textColor,
                      }}
                    >
                      {event.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {scheduleGroups().length === 0 && (
            <div className="schedule-empty-row">No schedules found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FullCalendarView;
