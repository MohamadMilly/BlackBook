import { useCallback, useMemo, useState, type ReactNode } from "react";
import { NotificationsContext } from "../contexts/NotificationsContext";
import type {
  Notification,
  NotificationType,
} from "../shared/types/Notification.type";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const add = useCallback(
    (message: string, type: NotificationType) => {
      const newNotification = {
        id: crypto.randomUUID(),
        message,
        type,
      };
      setNotifications((prev) => [...prev, newNotification]);
    },
    [setNotifications],
  );

  const remove = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications],
  );
  const contextValue = useMemo(
    () => ({ notifications, add, remove }),
    [notifications, add, remove],
  );
  return (
    <NotificationsContext value={contextValue}>{children}</NotificationsContext>
  );
}
