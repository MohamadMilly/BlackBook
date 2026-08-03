import { useNotifications } from "../../../contexts/NotificationsContext";
import { ToastNotification } from "./ToastNotification";

export function ToastNotificationsList() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed md:top-4 md:right-4 top-2 z-1000 w-full max-w-120">
      {notifications.map((notification, index) => {
        return (
          <ToastNotification
            key={notification.id}
            notification={notification}
            index={index}
          />
        );
      })}
    </div>
  );
}
