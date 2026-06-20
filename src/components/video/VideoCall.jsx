import {
  Button,
  IconButton,
} from "@carbon/react";

import {
  Chat,
  MicrophoneOff,
  PhoneOffFilled,
  VideoOff,
  OverflowMenuVertical,
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
          <IconButton
  kind="ghost"
  label="Options"
  className="video-menu"
>
  <OverflowMenuVertical />
</IconButton>
          <div className="video-person" aria-hidden="true">
            <div className="video-face" />
            <div className="video-hair" />
            <div className="video-shirt" />
          </div>
          <div className="video-controls">
            <IconButton
  kind="ghost"
  label="Mute microphone"
>
  <MicrophoneOff />
</IconButton>
            <IconButton
  kind="ghost"
  label="Turn off video"
>
  <VideoOff />
</IconButton>
           <IconButton
  kind="ghost"
  label="Open chat"
>
  <Chat />
</IconButton>
            <IconButton
  kind="ghost"
  label="Leave call"
  className="leave-call"
  onClick={onClose}
>
  <PhoneOffFilled size={24} />
</IconButton>
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
          <Button
  kind="primary"
  onClick={onClose}
>
  Join Session
</Button>
          <small>This session is secure and private. <b>Disclaimer</b></small>
        </aside>
      </section>
    </main>
  );
}

export default VideoCall;
