import {
  ChevronLeft,
  ChevronRight,
  CollapseStripe,
} from "@carbon/icons-react";

import {
  Checkbox,
  IconButton,
  Button,
} from "@carbon/react";

import { useMemo, useState } from "react";

const monthFormatter =
  new Intl.DateTimeFormat("en-US", {
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
  const today = new Date();

  const [displayDate, setDisplayDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [selectedDate, setSelectedDate] =
    useState(today);

  const updateFilter = (
    field,
    checked
  ) => {
    onFiltersChange((current) => ({
      ...current,
      [field]: checked,
    }));
  };

  const calendarDays = useMemo(() => {
    const year =
      displayDate.getFullYear();

    const month =
      displayDate.getMonth();

    const firstOfMonth =
      new Date(year, month, 1);

    const start =
      new Date(
        year,
        month,
        1 - firstOfMonth.getDay()
      );

    return Array.from(
      { length: 42 },
      (_, index) => {
        const date =
          new Date(start);

        date.setDate(
          start.getDate() + index
        );

        return date;
      }
    );
  }, [displayDate]);

  const moveDisplayMonth = (
    offset
  ) => {
    setDisplayDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            offset,
          1
        )
    );
  };

  const selectDate = (date) => {
    setSelectedDate(date);

    setDisplayDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      )
    );

    const calendarApi =
      calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.gotoDate(date);

      onNavigate?.();
    }
  };

  const isSameDate = (
    left,
    right
  ) =>
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth() &&
    left.getDate() ===
      right.getDate();

  return (
    <div
      style={{
        padding: "0 22px 24px",
      }}
    >
      {/* Top Bar */}
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "52px",
    borderBottom: "1px solid #e0e0e0",
    margin: "0 -22px 0 -22px",
  }}
>
  <IconButton
    kind="ghost"
    size="sm"
    label="Close"
    onClick={onClose}
    style={{
      marginTop: "4px",
    }}
  >
    <CollapseStripe size={16} />
  </IconButton>
</div>

      {/* Month Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "32px 1fr 32px",
          alignItems: "center",
          margin:
            "18px 0 24px",
        }}
      >
        <IconButton
          kind="ghost"
          size="sm"
          label="Previous Month"
          onClick={() =>
            moveDisplayMonth(-1)
          }
        >
          <ChevronLeft size={14} />
        </IconButton>

        <span
          style={{
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 600,
            color: "#161616",
          }}
        >
          {monthFormatter.format(
            displayDate
          )}
        </span>

        <IconButton
          kind="ghost"
          size="sm"
          label="Next Month"
          onClick={() =>
            moveDisplayMonth(1)
          }
        >
          <ChevronRight size={14} />
        </IconButton>
      </div>

      {/* Weekdays + Dates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(7, 1fr)",
          gap: "16px 13px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        {[
          "S",
          "M",
          "T",
          "W",
          "T",
          "F",
          "S",
        ].map((day, index) => (
          <div
            key={`${day}-${index}`}
            style={{
              fontSize: "12px",
              color: "#525252",
            }}
          >
            {day}
          </div>
        ))}

        {calendarDays.map((date) => {
          const isSelected =
            isSameDate(
              date,
              selectedDate
            );

          const isCurrentMonth =
            date.getMonth() ===
            displayDate.getMonth();

          return (
            <Button
  key={date.toISOString()}
  kind="ghost"
  size="sm"
  onClick={() => selectDate(date)}
  style={{
    minHeight: "24px",
    width: "14px",
    padding: 0,
    justifyContent: "center",
    color: !isCurrentMonth
      ? "#a8a8a8"
      : isSelected
      ? "#0f62fe"
      : "#525252",
    fontWeight: isSelected ? 600 : 400,
  }}
>
  {date.getDate()}
</Button>
          );
        })}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexDirection:
            "column",
          gap: "12px",
        }}
      >
        <Checkbox
          id="mini-my-sessions"
          labelText="My Sessions"
          checked={
            filters.mySessions
          }
          onChange={(
            _,
            { checked }
          ) =>
            updateFilter(
              "mySessions",
              checked
            )
          }
        />

        <Checkbox
          id="mini-team-sessions"
          labelText="Team Sessions"
          checked={
            filters.teamSessions
          }
          onChange={(
            _,
            { checked }
          ) =>
            updateFilter(
              "teamSessions",
              checked
            )
          }
        />
      </div>
    </div>
  );
}

export default MiniCalendar;