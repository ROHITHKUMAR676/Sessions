import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  OverflowMenu,
  OverflowMenuItem,
  Tag,
  Tile,
} from "@carbon/react";
import {
  Close,
  Copy,
  Launch,
  OverflowMenuVertical,
} from "@carbon/icons-react";
import { createPortal } from "react-dom";
import "./EventPopup.scss";

const getPopupPosition = (anchorElement) => {
  if (!anchorElement || typeof window === "undefined") {
    return undefined;
  }

  const anchorRect = anchorElement.getBoundingClientRect();
  const popupWidth = 320;
  const gutter = 12;
  const popupHeight = 460;
  const top = Math.max(
    gutter,
    Math.min(anchorRect.top, window.innerHeight - popupHeight - gutter)
  );
  const availableRight = window.innerWidth - anchorRect.right;
  const left =
    availableRight >= popupWidth + gutter
      ? anchorRect.right + gutter
      : Math.max(gutter, anchorRect.left - popupWidth - gutter);

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
};

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

function EventPopup({ event, anchorElement, onClose, onDelete, onEdit, onJoin }) {
  const [popupPosition, setPopupPosition] = useState(() =>
    getPopupPosition(anchorElement)
  );

  useEffect(() => {
    if (!event || !anchorElement) {
      setPopupPosition(undefined);
      return undefined;
    }

    let frameId = 0;
    const updatePosition = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setPopupPosition(getPopupPosition(anchorElement));
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [event, anchorElement]);

  if (!event) return null;

  const props = event.extendedProps || {};
  const eventId = event.id || event._def?.publicId;
  const participants =
    props.participants?.length > 0
      ? props.participants
      : ["Saranya Loganathan", "William Christopher"];

  const popup = (
    <Tile
      className="event-popover"
      role="dialog"
      aria-label={event.title}
      style={popupPosition}
    >
      <div className="event-popover-top">
        <Tag type="blue" size="sm">
          {props.sessionType || "Individual Session"}
        </Tag>
        <div className="event-top-actions">
          <OverflowMenu
            aria-label="Event actions"
            direction="bottom"
            flipped
            iconDescription="Event actions"
            renderIcon={OverflowMenuVertical}
            size="sm"
          >
            <OverflowMenuItem
              itemText="Edit"
              onClick={() => onEdit?.(eventId)}
            />
            <OverflowMenuItem
              hasDivider
              isDelete
              itemText="Delete app"
              onClick={() => onDelete?.(eventId)}
            />
          </OverflowMenu>

          <IconButton
            kind="ghost"
            label="Close"
            size="sm"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </div>
      </div>

      <h3>{props.description || event.title}</h3>
      <p className="event-date">{formatTimeRange(event)}</p>

      <div className="event-actions-row">
        <Button
          kind="primary"
          className="join-meeting-button"
          renderIcon={Launch}
          size="md"
          onClick={onJoin}
        >
          Join Meeting
        </Button>
        <IconButton
          kind="ghost"
          className="copy-button"
          label="Copy meeting link"
          size="md"
        >
          <Copy />
        </IconButton>
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
    </Tile>
  );

  if (typeof document === "undefined") {
    return popup;
  }

  return createPortal(popup, document.body);
}

export default EventPopup;
