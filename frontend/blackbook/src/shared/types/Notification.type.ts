export type NotificationType = "SUCCESS" | "WARNING" | "ERROR";

export type Notification = {
  id: string;
  message: string;
  type: NotificationType
};
