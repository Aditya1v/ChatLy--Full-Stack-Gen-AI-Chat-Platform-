import { useContext } from "react";
import { ChatContext } from "./chat-store";

export const useChat = () => useContext(ChatContext);
