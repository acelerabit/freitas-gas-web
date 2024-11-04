"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { useUser } from "./user-context";
import { fetchApi } from "@/services/fetchApi";

interface NotificationContextParams {
  clearMessages: () => void;
  messages: Message[];
}

interface Notification {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DELIVERYMAN";
  loggedWithGoogle: boolean;
  avatarUrl: string;
  acceptNotifications: boolean;
  accountAmount: number;
}

interface Message {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationContext = createContext({} as NotificationContextParams);

interface NotificationProviderProps {
  children: ReactNode;
}
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { loadingUser, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);

  const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", {
    autoConnect: false,
  });

  function clearMessages() {
    setMessages([]);
  }

  async function getNotifications() {
    const response = await fetchApi(`/notifications/without-paginate/${user?.id}`);


    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setMessages(data.notifications);
  }

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    (socket.auth = {
      userId: user?.id,
    }),
      socket.connect();
    socket.on("notify", (message: Message) => {
      setMessages((state) => [...state, message]);
    });
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    getNotifications()
  }, [user])

  return (
    <NotificationContext.Provider value={{ messages, clearMessages }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};
