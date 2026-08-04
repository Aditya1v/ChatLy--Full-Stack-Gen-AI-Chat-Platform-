import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatLayout from "./components/ChatLayout";
import AuthScreen from "./components/AuthScreen";
import { useAuth } from "./context/useAuth";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[var(--bg)] text-[var(--text-muted)]">
        <p className="text-sm">Loading ChatLy…</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell flex h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text-main)]">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChatLayout isOpen={isOpen} />
    </div>
  );
}

export default App;
