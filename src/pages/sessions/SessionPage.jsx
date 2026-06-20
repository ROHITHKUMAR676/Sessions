import { useState } from "react";

import { Button } from "@carbon/react";
import QuickSchedulePopup from "../../components/calendar/QuickSchedulePopup";
import ScheduleDrawer from "../../components/calendar/ScheduleDrawer";
import SessionCalendar from "../../components/calendar/SessionCalendar";
import EventPopup from "../../components/calendar/EventPopup";
import SessionHistory from "../../components/calendar/SessionHistory";
import VideoCall from "../../components/video/VideoCall";
import "./SessionPage.scss";
import {
  Add,
  Attachment,
} from "@carbon/icons-react";
import {
  Button,
  Tabs,
  TabList,
  Tab,
} from "@carbon/react";
function SessionPage() {
  const [selectedEvent, setSelectedEvent] =
    useState(null);
  const [selectedEventAnchorElement, setSelectedEventAnchorElement] =
    useState(null);
  const [quickPopupOpen, setQuickPopupOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] =
  useState(false);
  const [editingSession, setEditingSession] =
  useState(null);
  const [selectedSlot, setSelectedSlot] =
  useState(null);
  const [activeTab, setActiveTab] =
  useState("calendar");
  const [activeCallSession, setActiveCallSession] =
  useState(null);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Nisha - Individual Session",
      start: "2026-06-02T09:00:00",
      end: "2026-06-02T10:00:00",
      backgroundColor: "#d0e2ff",
      borderColor: "#d0e2ff",
      textColor: "#0f62fe",
      extendedProps: {
        category: "Session",
        scope: "my",
        sessionType: "Individual Session",
        facilitator: "Saranya Loganathan",
        participants: ["Saranya Loganathan", "William Christopher"],
        meetingLink: "#join-session",
        description: "Stress management workshop",
      },
    },

    {
      id: 2,
      title: "Shankar - Individual Session",
      start: "2026-06-02T10:00:00",
      end: "2026-06-02T11:00:00",
      backgroundColor: "#d0e2ff",
      borderColor: "#d0e2ff",
      textColor: "#0f62fe",
      extendedProps: {
        category: "Session",
        scope: "my",
        sessionType: "Individual Session",
        facilitator: "Saranya Loganathan",
        participants: ["Saranya Loganathan", "William Christopher"],
        meetingLink: "#join-session",
        description: "One to one counselling",
      },
    },
    {
      id: 3,
      title: "Stress Workshop - G08",
      start: "2026-06-02T11:00:00",
      end: "2026-06-02T12:00:00",
      backgroundColor: "#e6d6ff",
      borderColor: "#e6d6ff",
      textColor: "#6929c4",
      extendedProps: {
        category: "Workshop",
        scope: "my",
        sessionType: "Workshop",
        facilitator: "Saranya Loganathan",
        participants: ["Grade 08 Group", "William Christopher"],
        meetingLink: "#join-session",
        description: "Stress Management Workshop",
      },
    },
    {
      id: 4,
      title: "Staff Training - STD 6th",
      start: "2026-06-05T11:00:00",
      end: "2026-06-05T12:00:00",
      backgroundColor: "#a7f0ba",
      borderColor: "#a7f0ba",
      textColor: "#0e6027",
      extendedProps: {
        category: "Training",
        scope: "team",
        sessionType: "Staff Training",
        facilitator: "Saranya Loganathan",
        participants: ["Staff Group"],
        meetingLink: "#join-session",
        description: "Staff wellbeing training",
      },
    },
    {
      id: 5,
      title: "Pressure - STD 6th",
      start: "2026-06-12T13:00:00",
      end: "2026-06-12T14:00:00",
      backgroundColor: "#e6d6ff",
      borderColor: "#e6d6ff",
      textColor: "#6929c4",
      extendedProps: {
        category: "Workshop",
        scope: "team",
        sessionType: "Group Session",
        facilitator: "Saranya Loganathan",
        participants: ["STD 6th"],
        meetingLink: "#join-session",
        description: "Pressure management session",
      },
    },
    {
      id: 6,
      title: "Shankar - Individual Session",
      start: "2026-06-16T15:00:00",
      end: "2026-06-16T16:00:00",
      backgroundColor: "#d0e2ff",
      borderColor: "#d0e2ff",
      textColor: "#0f62fe",
      extendedProps: {
        category: "Session",
        scope: "my",
        sessionType: "Individual Session",
        facilitator: "Saranya Loganathan",
        participants: ["Saranya Loganathan", "William Christopher"],
        meetingLink: "#join-session",
        description: "Stress Management Workshop",
      },
    },
    {
      id: 7,
      title: "Shankar - Individual Session",
      start: "2026-06-11T10:00:00",
      end: "2026-06-11T11:00:00",
      backgroundColor: "#e0e0e0",
      borderColor: "#e0e0e0",
      textColor: "#393939",
      extendedProps: {
        category: "Session",
        scope: "my",
        sessionType: "Individual Session",
        facilitator: "Saranya Loganathan",
        participants: ["Saranya Loganathan", "William Christopher"],
        meetingLink: "#join-session",
        description: "Individual check-in",
      },
    },
    {
      id: 8,
      title: "Staff Training - STD 7th",
      start: "2026-06-19T10:00:00",
      end: "2026-06-19T11:00:00",
      backgroundColor: "#a7f0ba",
      borderColor: "#a7f0ba",
      textColor: "#0e6027",
      extendedProps: {
        category: "Training",
        scope: "team",
        sessionType: "Staff Training",
        facilitator: "Saranya Loganathan",
        participants: ["Staff Group"],
        meetingLink: "#join-session",
        description: "Staff wellbeing training",
      },
    },
  ]);

  if (activeCallSession) {
    return (
      <VideoCall
        session={activeCallSession}
        onClose={() => setActiveCallSession(null)}
      />
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="sessions-breadcrumb">
        <p>
          <span>
            Bread Crumb / Bread Crumb /
            Bread Crumb /
          </span>

          <span className="breadcrumb-current">
            {" "}
            Sessions /
          </span>
        </p>
      </div>

      {/* Main Content */}
      <main className={`sessions-page ${activeTab === "history" ? "history-active" : ""}`}>
        <div className="sessions-page-header">
          <h1>
            Sessions
          </h1>

          <div className="sessions-actions">
            <Button
              kind="secondary"
              renderIcon={Add}
              size="lg"
              className="session-action-button"
              onClick={() => setActiveCallSession(sessions[0])}
            >
              Start Session
            </Button>

            <Button
              kind="primary"
              renderIcon={Attachment}
              onClick={() => {
                setEditingSession(null);
                setDrawerOpen(true);
              }}
              size="lg"
              className="session-action-button"
            >
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
  selectedIndex={activeTab === "calendar" ? 0 : 1}
  onChange={({ selectedIndex }) =>
    setActiveTab(
      selectedIndex === 0
        ? "calendar"
        : "history"
    )
  }
  className="session-tabs"
>
  <TabList aria-label="Session Navigation">
    <Tab>Session Calendar</Tab>
    <Tab>Session History</Tab>
  </TabList>
</Tabs>

    {activeTab === "calendar" && (
 <SessionCalendar
  sessions={sessions}
  onEventClick={(event, anchorElement) => {
    setSelectedEvent(event);
    setSelectedEventAnchorElement(anchorElement);
  }}
 onSlotClick={(slotInfo) => {
  setSelectedSlot(slotInfo);
  setQuickPopupOpen(true);
}}
/>
)}

{activeTab === "history" && (
  <SessionHistory
    sessions={sessions}
    onEdit={(id) => {
      const session = sessions.find(
        (item) => String(item.id) === String(id)
      );
      if (session) {
        setEditingSession(session);
        setDrawerOpen(true);
      }
    }}
    onDelete={(id) => {
      setSessions((prev) =>
        prev.filter(
          (session) => session.id !== id
        )
      );
    }}
  />
)}
    </main>
        {drawerOpen && (
        <ScheduleDrawer
          open={drawerOpen}
          session={editingSession}
          onClose={() => {
            setDrawerOpen(false);
            setEditingSession(null);
          }}
          onSave={(savedSession) => {
          setSessions((prev) => {
            const exists = prev.some(
              (session) => String(session.id) === String(savedSession.id)
            );

            if (exists) {
              return prev.map((session) =>
                String(session.id) === String(savedSession.id)
                  ? savedSession
                  : session
              );
            }

            return [
              ...prev,
              savedSession,
            ];
          });
      }}
/>
        )}
        <QuickSchedulePopup
  open={quickPopupOpen}
  selectedSlot={selectedSlot}
  onClose={() => {
    setQuickPopupOpen(false);
    setSelectedSlot(null);
  }}
  onSave={(newSession) => {
    setSessions((prev) => [
      ...prev,
      newSession,
    ]);

    setQuickPopupOpen(false);
    setSelectedSlot(null);
  }}
/>
      <EventPopup
        event={selectedEvent}
        anchorElement={selectedEventAnchorElement}
        onClose={() => {
          setSelectedEvent(null);
          setSelectedEventAnchorElement(null);
        }}
        onDelete={(id) => {
          setSessions((prev) =>
            prev.filter((session) => String(session.id) !== String(id))
          );
          setSelectedEvent(null);
          setSelectedEventAnchorElement(null);
        }}
        onEdit={(id) => {
          const session = sessions.find(
            (item) => String(item.id) === String(id)
          );
          if (session) {
            setEditingSession(session);
            setSelectedEvent(null);
            setSelectedEventAnchorElement(null);
            setDrawerOpen(true);
          }
        }}
        onJoin={() => {
          setActiveCallSession(sessions.find(
            (item) => String(item.id) === String(selectedEvent.id)
          ) || sessions[0]);
          setSelectedEvent(null);
          setSelectedEventAnchorElement(null);
        }}
      />
    </>
  );
}

export default SessionPage;
