import { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  IconButton,
  DatePicker,
  DatePickerInput,
  TimePicker,
} from "@carbon/react";
import { Close } from "@carbon/icons-react";

import "./QuickSchedulePopup.scss";

const getPopupPosition = (selectedSlot) => {
  if (typeof window === "undefined") return {};

  const popupWidth = 282;
  const popupHeight = 548;
  const gutter = 16;
  const anchor = selectedSlot?.anchorRect;
  const fallbackLeft =
    typeof selectedSlot?.clientX === "number"
      ? selectedSlot.clientX
      : window.innerWidth / 2;
  const fallbackTop =
    typeof selectedSlot?.clientY === "number"
      ? selectedSlot.clientY
      : window.innerHeight / 2;

  const preferredLeft = anchor
    ? anchor.left + anchor.width / 2 - popupWidth / 2
    : fallbackLeft - popupWidth / 2;
  const preferredTop = anchor
    ? anchor.top + Math.min(28, anchor.height / 3)
    : fallbackTop - 120;

  return {
    left: `${Math.min(
      Math.max(gutter, preferredLeft),
      window.innerWidth - popupWidth - gutter
    )}px`,
    top: `${Math.min(
      Math.max(gutter, preferredTop),
      window.innerHeight - popupHeight - gutter
    )}px`,
  };
};

function QuickSchedulePopup({ open, selectedSlot, onClose, onSave }) {
  const initialDate = selectedSlot?.start?.split("T")[0] || "";

  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(initialDate);
  const [sessionType, setSessionType] = useState("Individual");
  const [participant, setParticipant] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (open) {
      setEventDate(initialDate);
    }
  }, [initialDate, open]);

  if (!open) return null;

  const selectedDate = eventDate
    ? new Date(`${eventDate}T00:00:00`)
    : undefined;

  const category = activeTab === 1 ? "Workshop" : "Session";
  const eventColors =
    activeTab === 1
      ? { background: "#e6d6ff", border: "#e6d6ff", text: "#6929c4" }
      : { background: "#d0e2ff", border: "#d0e2ff", text: "#0f62fe" };

  const handleSave = () => {
    onSave({
      id: Date.now(),
      title,
      start: `${eventDate}T${startTime || "09:00"}:00`,
      end: `${eventDate}T${endTime || "10:00"}:00`,
      backgroundColor: eventColors.background,
      borderColor: eventColors.border,
      textColor: eventColors.text,
      extendedProps: {
        category,
        sessionType,
        participants: [participant],
        description: notes,
        tags: ["Mental Health"],
      },
    });
  };

  return (
    <div className="quick-popup-overlay" onClick={onClose}>
      <div
        className="quick-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Quick schedule"
        style={getPopupPosition(selectedSlot)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="quick-popup-header">
          <div className="quick-tabs" role="tablist" aria-label="Session type">
            {["Session", "Workshop"].map((label, index) => (
              <Button
                key={label}
                kind="ghost"
                size="sm"
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                className={`quick-tab-button ${
                  activeTab === index ? "quick-tab-button--active" : ""
                }`}
                onClick={() => setActiveTab(index)}
              >
                {label}
              </Button>
            ))}
          </div>

          <IconButton
            kind="ghost"
            label="Close"
            size="sm"
            className="popup-close-btn"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </div>

        <div className="quick-popup-body">
          <TextInput
            id="event-title"
            labelText="Event title"
            hideLabel
            placeholder="Enter Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="quick-date-time-row">
            <div className="date-field">
              <DatePicker
                datePickerType="single"
                dateFormat="m/d/Y"
                value={selectedDate}
                onChange={(dates) => {
                  if (dates?.[0]) {
                    const iso = dates[0].toISOString().split("T")[0];
                    setEventDate(iso);
                  }
                }}
              >
                <DatePickerInput
                  id="popup-date"
                  labelText="Date"
                  placeholder="mm/dd/yyyy"
                />
              </DatePicker>
            </div>

            <div className="time-field">
              <span className="time-field-label">Time</span>
              <div className="time-field-inputs">
                <TimePicker
                  id="popup-start-time"
                  labelText="Start time"
                  hideLabel
                  placeholder="hh:mm"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <TimePicker
                  id="popup-end-time"
                  labelText="End time"
                  hideLabel
                  placeholder="hh:mm"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Select
            id="popup-session-type"
            labelText="Session Type"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <SelectItem value="Individual" text="Individual" />
            <SelectItem value="Group" text="Group" />
            <SelectItem value="Workshop" text="Workshop" />
          </Select>

          <Select
            id="popup-participants"
            labelText="Participants"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
          >
            <SelectItem value="" text="Select Participant" />
            <SelectItem value="Shankar" text="Shankar" />
            <SelectItem value="Swithika" text="Swithika" />
            <SelectItem value="William" text="William" />
          </Select>

          <div className="notes-header">
            <span>Notes</span>
            <span>{notes.length}/100</span>
          </div>

          <TextArea
            id="popup-notes"
            labelText="Notes"
            hideLabel
            maxLength={100}
            placeholder="Add notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="quick-popup-footer">
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button kind="primary" disabled={!title} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuickSchedulePopup;
