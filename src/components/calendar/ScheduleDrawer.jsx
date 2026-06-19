import { useState } from "react";
import {
  Button,
  DatePicker,
  DatePickerInput,
  IconButton,
  Select,
  SelectItem,
  Tag,
  TextInput,
  TextArea,
  TimePicker,
} from "@carbon/react";
import { Close } from "@carbon/icons-react";
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
          <IconButton
            kind="ghost"
            label="Close"
            size="sm"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </header>

        <div className="schedule-form">
          <div className="schedule-field">
            <TextInput
              id="session-title"
              labelText="Session Title"
              placeholder="Enter Session Name"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="schedule-date-time-row">
            <DatePicker
              datePickerType="single"
              dateFormat="Y-m-d"
              value={form.date}
              onChange={(dates) => {
                if (dates?.[0]) {
                  updateField("date", dates[0].toISOString().split("T")[0]);
                }
              }}
            >
              <DatePickerInput
                id="session-date"
                labelText="Date"
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>

            <TimePicker
              id="start-time"
              labelText="Time"
              maxLength={5}
              pattern="[0-2][0-9]:[0-5][0-9]"
              placeholder="hh:mm"
              value={form.startTime}
              onChange={(event) =>
                updateField("startTime", event.target.value)
              }
            />

            <div className="schedule-end-time-field">
              <TimePicker
                id="end-time"
                labelText="End Time"
                maxLength={5}
                pattern="[0-2][0-9]:[0-5][0-9]"
                placeholder="hh:mm"
                value={form.endTime}
                onChange={(event) =>
                  updateField("endTime", event.target.value)
                }
              />
            </div>
          </div>

          <div className="schedule-field">
            <Select
              id="session-type"
              labelText="Session Type"
              value={form.sessionType}
              onChange={(event) =>
                updateField("sessionType", event.target.value)
              }
            >
              <SelectItem value="" text="Select Session Type" />

              {sessionTypeOptions.map((option) => (
                <SelectItem key={option} value={option} text={option} />
              ))}
            </Select>
          </div>

          <div className="schedule-field">
            <Select
              id="participants"
              labelText="Participants"
              value={form.participant}
              onChange={(event) =>
                updateField("participant", event.target.value)
              }
            >
              <SelectItem value="" text="Select a participants" />

              {participantOptions.map((option) => (
                <SelectItem key={option} value={option} text={option} />
              ))}
            </Select>
          </div>

          <div className="schedule-field">
            <Select
              id="session-mode"
              labelText="Session Mode"
              value={form.mode}
              onChange={(event) => updateField("mode", event.target.value)}
            >
              <SelectItem value="" text="Select mode of Delivery" />
              <SelectItem value="Online" text="Online" />
              <SelectItem value="In person" text="In person" />
              <SelectItem value="Hybrid" text="Hybrid" />
            </Select>
          </div>

          <div className="schedule-field">
            <div className="schedule-description-label">
              <span>Description</span>
              <span>{form.description.length}/100</span>
            </div>
            <TextArea
              id="description"
              labelText=""
              hideLabel
              maxLength={100}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Add notes"
            />
          </div>

          <div className="schedule-field">
            <TextInput
              id="session-tag"
              labelText="Tags (Internal)"
              value={form.tag}
              onChange={(event) => updateField("tag", event.target.value)}
              placeholder="Search or create tags"
            />
          </div>

          <Tag type="blue">{form.tag || "Mental Health"}</Tag>
        </div>

        <footer className="schedule-drawer-footer">
          <Button kind="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button kind="primary" disabled={!canSave} onClick={handleSave}>
            {session ? "Save" : "Schedule Session"}
          </Button>
        </footer>
      </aside>
    </div>
  );
}

export default ScheduleDrawer;
