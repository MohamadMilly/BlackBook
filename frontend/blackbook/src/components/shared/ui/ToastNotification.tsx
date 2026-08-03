import { memo, useEffect, useState, type CSSProperties } from "react";
import type { Notification } from "../../../shared/types/Notification.type";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { Check, CircleX, TriangleAlert, X } from "lucide-react";

const ToastTypeClasses: Record<"SUCCESS" | "WARNING" | "ERROR", string> = {
  SUCCESS:
    "bg-gradient-to-r from-emerald-950 via-neutral-950 to-neutral-950 border border-emerald-500/20 text-emerald-400",
  WARNING:
    "bg-gradient-to-r from-amber-950 via-neutral-950 to-neutral-950 border border-amber-500/20 text-amber-400",
  ERROR:
    "bg-gradient-to-r from-rose-950 via-neutral-950 to-neutral-950 border border-rose-500/20 text-rose-400",
};

const ToastTypeIcons = {
  SUCCESS: <Check size={20} />,
  ERROR: <CircleX size={20} />,
  WARNING: <TriangleAlert size={20} />,
};

export const ToastNotification = memo(function ToastNotification({
  notification,
  index,
}: {
  notification: Notification;
  index: number;
}) {
  const { remove } = useNotifications();
  const [isFadeRunnig, setIsfadeRunning] = useState<boolean>(false);
  const icon = ToastTypeIcons[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsfadeRunning(true);
      setTimeout(() => {
        setIsfadeRunning(false);
        remove(notification.id);
      }, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, remove]);

  const className = ToastTypeClasses[notification.type];

  return (
    <div
      style={
        {
          "--index": index,
        } as CSSProperties
      }
      className={`absolute p-4 rounded-xl w-[calc(100%-24px)] mx-3 shadow-xl ${className} ${isFadeRunnig ? "animate-fade" : "animate-slideDown"}`}
    >
      <div className="flex justify-between">
        <span className="capitalize flex items-center gap-1">
          {icon}
          {notification.type.toLowerCase()}
        </span>
        <button
          onClick={() => remove(notification.id)}
          className="text-white cursor-pointer"
        >
          <X size={18} />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div>
        <p className="text-neutral-300 mt-1 text-sm">{notification.message}</p>
      </div>
    </div>
  );
});
