import { Theme } from "@carbon/react";
import AppHeader from "./components/header/Header";
import SessionPage from "./pages/sessions/SessionPage";

function App() {
  return (
    <>
      <Theme theme="g100">
        <AppHeader />
      </Theme>

      <SessionPage />
    </>
  );
}

export default App;