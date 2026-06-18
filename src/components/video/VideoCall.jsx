import {
  Chat,
  MicrophoneOff,
  PhoneOffFilled,
  VideoOff,
} from "@carbon/icons-react";
import "./VideoCall.scss";

function VideoCall({ session, onClose }) {
  const title = session?.title || "Stress Management Workshop";
  const props = session?.extendedProps || {};
  const participant = props.participants?.[1] || "William Christopher";

  return (
    <main className="video-call-screen">
      <div className="video-brand">SelfTalk<span>Enterprise</span></div>

      <section className="video-stage">
        <div className="video-frame">
          <div className="video-name">{props.facilitator || "Saranya Loganathan"}</div>
          <div className="video-menu">⋮</div>
          <div className="video-person" aria-hidden="true">
            <div className="video-face" />
            <div className="video-hair" />
            <div className="video-shirt" />
          </div>
          <div className="video-controls">
            <button type="button" aria-label="Mute microphone">
              <MicrophoneOff size={24} />
            </button>
            <button type="button" aria-label="Turn off video">
              <VideoOff size={24} />
            </button>
            <button type="button" aria-label="Open chat">
              <Chat size={24} />
            </button>
            <button type="button" className="leave-call" aria-label="Leave call" onClick={onClose}>
              <PhoneOffFilled size={24} />
            </button>
          </div>
        </div>

        <aside className="video-details">
          <div className="video-session-title">
            <h1>{title}</h1>
            <span>{props.sessionType || "Individual Session"}</span>
          </div>
          <p>In 45 minutes</p>
          <div className="video-participant">
            <span>WC</span>
            <strong>{props.sessionType || "Individual Session"} with {participant}</strong>
          </div>
          <button type="button" onClick={onClose}>Join Session</button>
          <small>This session is secure and private. <b>Disclaimer</b></small>
        </aside>
      </section>
    </main>
  );
}

export default VideoCall;
