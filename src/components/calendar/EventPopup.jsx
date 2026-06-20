import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  OverflowMenu,
  OverflowMenuItem,
  Tag,
} from "@carbon/react";
import {
  Close,
  Copy,
  Launch,
  OverflowMenuVertical,
} from "@carbon/icons-react";
import { createPortal } from "react-dom";
import "./EventPopup.scss";

// ─── Position helper ──────────────────────────────────────────────────────────

const getPopupPosition = (anchorEl) => {
  if (!anchorEl || typeof window === "undefined") return null;

  const rect = anchorEl.getBoundingClientRect();
  const popupW = 340;
  const popupH = 420;
  const gutter = 10;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  // Prefer right side, fall back to left
  let left =
    rect.right + gutter + popupW <= winW - gutter
      ? rect.right + gutter
      : Math.max(gutter, rect.left - popupW - gutter);

  let top = Math.max(
    gutter,
    Math.min(rect.top, winH - popupH - gutter)
  );

  return { top: `${top}px`, left: `${left}px` };
};

// ─── Time formatter ───────────────────────────────────────────────────────────

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

  return `${date} · ${startTime}–${endTime}`;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, photo }) {
  if (photo) {
    return (
      <span className="ep-avatar ep-avatar--photo">
        <img src={photo} alt={name} />
      </span>
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <span className="ep-avatar ep-avatar--initials">{initials}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

function EventPopup({ event, anchorElement, onClose, onDelete, onEdit, onJoin }) {
  const [pos, setPos] = useState(() => getPopupPosition(anchorElement));

  useEffect(() => {
    if (!event || !anchorElement) {
      setPos(null);
      return;
    }

    let frameId = 0;
    const update = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() =>
        setPos(getPopupPosition(anchorElement))
      );
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [event, anchorElement]);

  if (!event) return null;

  const props = event.extendedProps || {};
  const eventId = event.id || event._def?.publicId;
  const sessionType = props.sessionType || "Individual Session";
  const tags = props.tags?.length > 0 ? props.tags : ["Mental Health"];

  const participants =
    props.participants?.length > 0
      ? props.participants
      : ["Saranya Loganathan", "William Christopher"];

  // Tag color by session type
  const tagType = (() => {
    if (sessionType === "Workshop" || sessionType === "Group Session")
      return "purple";
    if (sessionType === "Staff Training") return "green";
    return "blue";
  })();

  const popup = (
    <>
      {/* Backdrop – clicking outside closes */}
      <div
        className="ep-backdrop"
        role="presentation"
        onClick={onClose}
      />

      <div
        className="ep-popup"
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        style={pos || { top: "20%", left: "50%", transform: "translateX(-50%)" }}
      >
        {/* ── Header row ── */}
        <div className="ep-header">
          <div className="ep-tags">
            <Tag type={tagType} size="sm" className="ep-session-tag">
              {sessionType}
            </Tag>
            {tags.slice(0, 2).map((tag) => (
              <Tag key={tag} type="gray" size="sm" className="ep-internal-tag">
                {tag}
              </Tag>
            ))}
          </div>

          <div className="ep-header-actions">
            <OverflowMenu
              ariaLabel="More options"
              direction="bottom"
              flipped
              renderIcon={OverflowMenuVertical}
              size="sm"
              iconDescription="More options"
            >
              <OverflowMenuItem
                itemText="Edit"
                onClick={() => onEdit?.(eventId)}
              />
              <OverflowMenuItem
                hasDivider
                isDelete
                itemText="Delete"
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

        {/* ── Title & date ── */}
        <h3 className="ep-title">
          {props.description || event.title}
        </h3>
        <p className="ep-date">{formatTimeRange(event)}</p>

        {/* ── Join + Copy ── */}
        <div className="ep-cta-row">
          <Button
            kind="primary"
            renderIcon={Launch}
            size="md"
            className="ep-join-btn"
            onClick={onJoin}
          >
            Join Meeting
          </Button>
          <IconButton
            kind="ghost"
            label="Copy meeting link"
            size="md"
            className="ep-copy-btn"
          >
            <Copy />
          </IconButton>
        </div>

        {/* ── Participants ── */}
        <div className="ep-participants">
          <div className="ep-participants-header">
            <span className="ep-participants-title">Participants</span>
          </div>

          {participants.slice(0, 2).map((name, idx) => (
            <div className="ep-participant-row" key={name}>
              <Avatar
                name={name}
                photo={idx === 0 ? undefined : undefined}
              />
              <div className="ep-participant-info">
                <small className="ep-participant-role">
                  {idx === 0
                    ? `Psychologist | PSY-DR34M`
                    : `Participant | STU-X097P`}
                </small>
                <strong className="ep-participant-name">{name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return popup;
  return createPortal(popup, document.body);
}

export default EventPopup;
