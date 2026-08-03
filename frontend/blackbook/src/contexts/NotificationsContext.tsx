import { createContext, useContext } from "react";
import type {
  Notification,
  NotificationType,
} from "../shared/types/Notification.type";

type NotificationsContextType = {
  notifications: Notification[];
  add: (message: string, type: NotificationType) => void;
  remove: (id: string) => void;
};

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
  const contextValue = useContext(NotificationsContext);
  if (!contextValue) {
    throw new Error("Notification context should be used inside its provider.");
  }

  return contextValue;
};
