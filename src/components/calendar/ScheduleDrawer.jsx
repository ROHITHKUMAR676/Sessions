import { useState } from "react";
import { ChevronDown } from "@carbon/icons-react";
import "./ScheduleDrawer.scss";

const sessionTypeOptions = [
  "Individual Session",
  "Workshop",
  "Group Session",
  "Staff Training",
  "Follow Up",
  "Assessment",
];

const participantOptions = [
  "Saranya Loganathan",
  "William Christopher",
  "Swithika Aravind",
  "Shankar",
  "Staff Group",
  "STD 6th",
];

const emptyForm = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  sessionType: "",
  participant: "",
  mode: "",
  description: "",
  tag: "",
};

const getEventColors = (sessionType) => {
  if (sessionType === "Workshop" || sessionType === "Group Session") {
    return {
      backgroundColor: "#e6d6ff",
      borderColor: "#e6d6ff",
      textColor: "#6929c4",
    };
  }

  if (sessionType === "Staff Training") {
    return {
      backgroundColor: "#a7f0ba",
      borderColor: "#a7f0ba",
      textColor: "#0e6027",
    };
  }

  return {
    backgroundColor: "#d0e2ff",
    borderColor: "#d0e2ff",
    textColor: "#0f62fe",
  };
};

const splitDateTime = (value) => {
  if (!value) {
    return { date: "", time: "" };
  }

  const [date = "", time = ""] = String(value).split("T");
  return {
    date,
    time: time.slice(0, 5),
  };
};

const getInitialForm = (session) => {
  if (!session) {
    return { ...emptyForm };
  }

  const start = splitDateTime(session.start);
  const end = splitDateTime(session.end);
  const props = session.extendedProps || {};

  return {
      title: session.title || "",
      date: start.date,
      startTime: start.time,
      endTime: end.time,
      sessionType: props.sessionType || "",
      participant: props.participants?.[0] || "",
      mode: props.mode || "Online",
      description: props.description || "",
      tag: props.tags?.[0] || "Mental Health",
  };
};

function ScheduleDrawer({ open, onClose, onSave, session }) {
  const [form, setForm] = useState(() => getInitialForm(session));

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!form.title || !form.date || !form.sessionType) return;

    const startTime = form.startTime || "09:00";
    const endTime = form.endTime || "10:00";
    const eventColors = getEventColors(form.sessionType);

    onSave({
      id: session?.id || Date.now(),
      title: form.title,
      start: `${form.date}T${startTime}:00`,
      end: `${form.date}T${endTime}:00`,
      ...eventColors,
      extendedProps: {
        category: form.sessionType === "Workshop" ? "Workshop" : "Session",
        scope:
          session?.extendedProps?.scope ||
          (form.sessionType === "Staff Training" ? "team" : "my"),
        sessionType: form.sessionType,
        facilitator: "Saranya Loganathan",
        participants: [
          form.participant || "Saranya Loganathan",
          "William Christopher",
        ],
        mode: form.mode || "Online",
        description: form.description || form.title,
        tags: [form.tag || "Mental Health"],
        meetingLink: "#join-session",
      },
    });

    setForm({ ...emptyForm });
    onClose();
  };

  const canSave = Boolean(form.title && form.date && form.sessionType);

  return (
    <div className="schedule-drawer-overlay">
      <aside className="schedule-drawer" aria-label="Schedule Session">
        <header className="schedule-drawer-header">
          <h2>{session ? "Edit Session" : "Schedule Session"}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            x
          </button>
        </header>

        <div className="schedule-form">
          <label className="schedule-field">
            <span>Session Title</span>
            <input
              autoFocus
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Enter Session Name"
            />
          </label>

          <div className="schedule-grid">
            <label className="schedule-field">
              <span>Date</span>
              <input
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                type="date"
              />
            </label>
            <label className="schedule-field">
              <span>Time</span>
              <div className="time-pair">
                <input
                  value={form.startTime}
                  onChange={(event) => updateField("startTime", event.target.value)}
                  type="time"
                />
                <input
                  value={form.endTime}
                  onChange={(event) => updateField("endTime", event.target.value)}
                  type="time"
                />
              </div>
            </label>
          </div>

          <label className="schedule-field select-field">
            <span>Session Type</span>
            <select
              value={form.sessionType}
              onChange={(event) => updateField("sessionType", event.target.value)}
            >
              <option value="">Select Session Type</option>
              {sessionTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown size={16} />
          </label>

          <label className="schedule-field select-field">
            <span>Participants</span>
            <select
              value={form.participant}
              onChange={(event) => updateField("participant", event.target.value)}
            >
              <option value="">Select a participants</option>
              {participantOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown size={16} />
          </label>

          <label className="schedule-field select-field">
            <span>Session Mode</span>
            <select
              value={form.mode}
              onChange={(event) => updateField("mode", event.target.value)}
            >
              <option value="">Select mode of Delivery</option>
              <option>Online</option>
              <option>In person</option>
              <option>Hybrid</option>
            </select>
            <ChevronDown size={16} />
          </label>

          <label className="schedule-field">
            <span>
              Description <small>{form.description.length}/100</small>
            </span>
            <textarea
              maxLength="100"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Add notes"
            />
          </label>

          <label className="schedule-field">
            <span>Tags (Internal)</span>
            <input
              value={form.tag}
              onChange={(event) => updateField("tag", event.target.value)}
              placeholder="Search or create tags"
            />
          </label>

          <div className="schedule-tags">
            <span>Mental Health</span>
          </div>
        </div>

        <footer className="schedule-drawer-footer">
          <button type="button" className="drawer-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="drawer-save"
            disabled={!canSave}
            onClick={handleSave}
          >
            {session ? "Save" : "Schedule Session"}
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default ScheduleDrawer;
