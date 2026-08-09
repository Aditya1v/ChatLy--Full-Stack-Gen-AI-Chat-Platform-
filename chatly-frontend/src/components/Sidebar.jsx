import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  History,
  LogOut,
  Menu,
  MessageSquareText,
  MoonStar,
  Plus,
  SunMedium,
  Trash2,
  X,
} from "lucide-react";
import { useChat } from "../context/useChat";
import { useAuth } from "../context/useAuth";
import useTheme from "../hooks/useTheme";

const panelTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

const MotionAside = motion.aside;
const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionItem = motion.li;

function SidebarBody({
  chats,
  currentChatId,
  createNewChat,
  deleteChat,
  loadChat,
  onClose,
  theme,
  toggleTheme,
  user,
  logout,
  isMobile = false,
  selectedChatId,
  setSelectedChatId,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ink)] text-[var(--ink-contrast)]">
            <img src="/favicon.svg" alt="" className="h-5 w-5 object-contain" />
          </div>
          <h1 className="font-display flex items-center text-[17px] font-semibold text-[var(--text-main)]">
            ChatLy<span className="caret ml-0.5" aria-hidden="true" />
          </h1>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition hover:text-[var(--text-main)] md:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <MotionButton
        type="button"
        onClick={() => {
          createNewChat();
          onClose?.();
        }}
        className="flex items-center justify-between rounded-2xl bg-[var(--ink)] px-4 py-3.5 text-left text-[var(--ink-contrast)] transition"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.15 }}
      >
        <span className="text-sm font-medium">New chat</span>
        <Plus size={16} />
      </MotionButton>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-1 pb-2.5">
          <p className="font-mono-label text-[10px] font-medium uppercase text-[var(--text-muted)]">
            History
          </p>
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            {chats.length}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            <ul className="space-y-1">
              {chats.map((chat, index) => {
                const active = chat.id === currentChatId;

                return (
                  <MotionItem
                    key={chat.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.025, 0.2), duration: 0.18 }}
                  >
                    <div
                      className={`group flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition ${
                        active
                          ? "bg-[var(--accent-soft)]"
                          : "hover:bg-[var(--surface-muted)]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          loadChat(chat.id);
                          if (isMobile) {
                            setSelectedChatId?.(chat.id);
                          } else {
                            onClose?.();
                          }
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                      >
                        <MessageSquareText
                          size={15}
                          className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}
                        />
                        <span
                          className={`line-clamp-1 text-[13.5px] ${
                            active
                              ? "font-medium text-[var(--text-main)]"
                              : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                          }`}
                        >
                          {chat.title}
                        </span>
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${chat.title}`}
                        onClick={() => {
                          deleteChat(chat.id);
                          if (isMobile) setSelectedChatId?.(null);
                        }}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-500 ${
                          isMobile
                            ? selectedChatId === chat.id
                              ? "opacity-100"
                              : "opacity-0 pointer-events-none"
                            : "opacity-0 group-hover:opacity-100"
                        }` }
                      >
                        <Trash2 size={13.5} />
                      </button>
                    </div>
                  </MotionItem>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-5 py-10 text-center">
              <History size={18} className="text-[var(--text-muted)]" />
              <h3 className="font-display mt-3 text-sm font-semibold text-[var(--text-main)]">
                No chats yet
              </h3>
              <p className="mt-1.5 max-w-[15rem] text-[13px] leading-5 text-[var(--text-muted)]">
                Start a conversation and it'll show up here.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-between rounded-xl px-2.5 py-2 text-left transition hover:bg-[var(--surface-muted)]"
        >
          <span className="text-[13px] text-[var(--text-main)]">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
          {theme === "dark" ? (
            <SunMedium size={15} className="text-[var(--text-muted)]" />
          ) : (
            <MoonStar size={15} className="text-[var(--text-muted)]" />
          )}
        </button>

        {user && (
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-between rounded-xl px-2.5 py-2 text-left transition hover:bg-[var(--surface-muted)]"
          >
            <div className="min-w-0">
              <p className="text-[13px] text-[var(--text-main)]">Log out</p>
              <p className="truncate text-[11px] text-[var(--text-muted)]">{user.email}</p>
            </div>
            <LogOut size={15} className="shrink-0 text-[var(--text-muted)]" />
          </button>
        )}
      </div>
    </div>
  );
}

function Sidebar({ isOpen, setIsOpen }) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { chats, currentChatId, loadChat, createNewChat, deleteChat } = useChat();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const sidebarProps = {
    chats,
    currentChatId,
    createNewChat,
    deleteChat,
    loadChat,
    theme,
    toggleTheme,
    user,
    logout,
    isMobile: true,
    selectedChatId,
    setSelectedChatId,
  };

  return (
    <>
      <MotionButton
        type="button"
        onClick={() => setIsOpen(true)}
        className="panel fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-main)] md:hidden"
        whileTap={{ scale: 0.94 }}
      >
        <Menu size={17} />
      </MotionButton>

      <aside className="hidden w-[210px] shrink-0 border-r border-[var(--border)] md:flex">
        <SidebarBody {...sidebarProps} isMobile={false} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <MotionDiv
              className="fixed inset-0 z-40 bg-black/25 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
            />

            <MotionAside
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs overflow-hidden md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={panelTransition}
            >
              <div className="h-full w-full bg-[var(--bg)]">
                <SidebarBody
                  {...sidebarProps}
                  isMobile
                  onClose={() => setIsOpen(false)}
                />
              </div>
            </MotionAside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
