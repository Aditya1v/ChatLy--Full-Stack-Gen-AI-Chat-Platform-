import { useEffect, useState } from "react";
import { ChatContext } from "./chat-store";
import { api, streamMessage } from "../services/apiClient";
import { useAuth } from "./useAuth";

const toFrontendMessages = (messages = []) =>
  messages.map((m) => ({
    type: m.role === "user" ? "q" : "a",
    text: m.text,
    loading: false,
    sources: m.sources || [],
  }));

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [querry, setQuerry] = useState("");
  const [result, setResult] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [useDocuments, setUseDocuments] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Load the user's chat list once they're authenticated
  useEffect(() => {
    if (!user) {
      setChats([]);
      setCurrentChatId(null);
      setResult([]);
      return;
    }

    api
      .listChats()
      .then((list) => setChats(list.map((c) => ({ ...c, id: c._id }))))
      .catch((err) => setError(err.message));
  }, [user]);

  const refreshDocuments = async (chatId) => {
    if (!chatId) return setDocuments([]);
    try {
      setDocuments(await api.listDocuments(chatId));
    } catch {
      setDocuments([]);
    }
  };

  const loadChat = async (id) => {
    try {
      const chat = await api.getChat(id);
      setCurrentChatId(id);
      setResult(toFrontendMessages(chat.messages));
      refreshDocuments(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const createNewChat = async () => {
    try {
      const chat = await api.createChat();
      const mapped = { ...chat, id: chat._id };
      setChats((prev) => [mapped, ...prev]);
      setCurrentChatId(mapped.id);
      setResult([]);
      setDocuments([]);
      setUseDocuments(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteChat = async (id) => {
    try {
      await api.deleteChat(id);
      const updated = chats.filter((c) => c.id !== id);
      setChats(updated);

      if (currentChatId === id) {
        const next = updated[0];
        if (next) {
          loadChat(next.id);
        } else {
          setCurrentChatId(null);
          setResult([]);
          setDocuments([]);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadDocument = async (file) => {
    let chatId = currentChatId;

    if (!chatId) {
      const chat = await api.createChat();
      const mapped = { ...chat, id: chat._id };
      setChats((prev) => [mapped, ...prev]);
      setCurrentChatId(mapped.id);
      chatId = mapped.id;
    }

    try {
      await api.uploadDocument(chatId, file);
      setUseDocuments(true);
      refreshDocuments(chatId);
    } catch (err) {
      setError(err.message);
    }
  };

  const askQuerry = async () => {
    const prompt = querry.trim();
    if (!prompt || isSending) return;

    let chatId = currentChatId;

    // Auto-create a chat on first message, same UX as before
    if (!chatId) {
      try {
        const chat = await api.createChat();
        const mapped = { ...chat, id: chat._id };
        setChats((prev) => [mapped, ...prev]);
        setCurrentChatId(mapped.id);
        chatId = mapped.id;
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    setQuerry("");
    setIsSending(true);

    setResult((prev) => [
      ...prev,
      { type: "q", text: prompt },
      { type: "a", text: "", loading: true },
    ]);

    let streamedText = "";

    try {
      await streamMessage({
        chatId,
        text: prompt,
        useDocuments,
        onChunk: (delta) => {
          streamedText += delta;
          setResult((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              type: "a",
              text: streamedText,
              loading: false,
            };
            return updated;
          });
        },
        onDone: ({ sources, title }) => {
          setResult((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              type: "a",
              text: streamedText,
              loading: false,
              sources: sources || [],
            };
            return updated;
          });

          setChats((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, title } : c)),
          );
        },
      });
    } catch (err) {
      setError(err.message);
      setResult((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: "a",
          text: "Something went wrong reaching the model. Please try again.",
          loading: false,
        };
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        querry,
        setQuerry,
        result,
        chats,
        currentChatId,
        askQuerry,
        loadChat,
        createNewChat,
        deleteChat,
        isSending,
        error,
        documents,
        useDocuments,
        setUseDocuments,
        uploadDocument,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
