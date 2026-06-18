import { useState } from "react";
import {
  Copy,
  Launch,
  OverflowMenuVertical,
} from "@carbon/icons-react";
import "./EventPopup.scss";

const formatTimeRange = (event) => {
  const start = event?.start ? new Date(event.start) : null;
  const end = event?.end ? new Date(event.end) : null;

  if (!start || Number.isNaN(start.getTime())) return "Fri, 12 May 2026";

  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(start);
  const startTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(start);
  const endTime =
    end && !Number.isNaN(end.getTime())
      ? new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }).format(end)
      : "1:00 PM";

  return `${date} - ${startTime}-${endTime}`;
};

function EventPopup({ event, onClose, onDelete, onEdit, onJoin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!event) return null;

  const props = event.extendedProps || {};
  const eventId = event.id || event._def?.publicId;
  const participants =
    props.participants?.length > 0
      ? props.participants
      : ["Saranya Loganathan", "William Christopher"];

  return (
    <div className="event-popover" role="dialog" aria-label={event.title}>
      <div className="event-popover-top">
        <span>{props.sessionType || "Individual Session"}</span>
        <div className="event-top-actions">
          <button
            type="button"
            className="event-icon-button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <OverflowMenuVertical size={16} />
          </button>
          <button
            type="button"
            className="event-icon-button"
            aria-label="Close"
            onClick={onClose}
          >
            x
          </button>
        </div>
        {menuOpen && (
          <div className="event-menu">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit?.(eventId);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete?.(eventId)}
            >
              Delete app
            </button>
          </div>
        )}
      </div>

      <h3>{props.description || event.title}</h3>
      <p className="event-date">{formatTimeRange(event)}</p>

      <div className="event-actions-row">
        <button
          type="button"
          className="join-meeting-button"
          onClick={onJoin}
        >
          Join Meeting
          <Launch size={14} />
        </button>
        <button type="button" className="copy-button" aria-label="Copy meeting link">
          <Copy size={16} />
        </button>
      </div>

      <div className="participants-block">
        <h4>Participants</h4>
        {participants.slice(0, 2).map((participant, index) => (
          <div className="participant-row" key={participant}>
            <span className={index === 0 ? "avatar-photo" : "avatar-initials"}>
              {index === 0 ? "" : "WC"}
            </span>
            <div>
              <small>{index === 0 ? "Psychologist | PSY-DR34M" : "Participant | STU-X097P"}</small>
              <strong>{participant}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventPopup;
