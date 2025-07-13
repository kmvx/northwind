export const notificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type NotificationType =
  (typeof notificationTypes)[keyof typeof notificationTypes];

export type NotificationMessageType = {
  id: number;
  type: NotificationType;
  message: string;
};

let counter = 0;
let notifications: NotificationMessageType[] = [];
let listener: ((notifications: NotificationMessageType[]) => void) | null =
  null;

function notifyCustom(message: string, type: NotificationType) {
  const newNotification: NotificationMessageType = {
    id: ++counter,
    type,
    message,
  };
  notifications.push(newNotification);

  if (listener) listener([...notifications]);
  else console.error('No notification listener');
}

export const notify = {
  success: (message: string) =>
    notifyCustom(message, notificationTypes.SUCCESS),
  error: (message: string) => notifyCustom(message, notificationTypes.ERROR),
} as const;

export function dismissNotification(id: number) {
  notifications = notifications.filter((n) => n.id !== id);
  listener?.([...notifications]);
}

export function subscribeNotifications(cb: typeof listener) {
  listener = cb;
  cb?.([...notifications]); // Initial render
}

export function unsubscribeNotifications() {
  listener = null;
}
