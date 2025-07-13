import React from 'react';
import {
  type NotificationMessageType,
  subscribeNotifications,
  unsubscribeNotifications,
  dismissNotification,
  notificationTypes,
} from './notification';

const HIDE_DELAY = 2000; // in milliseconds

export const NotificationHost: React.FC = () => {
  const [notifications, setNotifications] = React.useState<
    NotificationMessageType[]
  >([]);

  React.useEffect(() => {
    subscribeNotifications(setNotifications);
    return unsubscribeNotifications;
  }, []);

  return (
    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3 d-flex flex-column align-items-center gap-2">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};

const NotificationItem: React.FC<{ notification: NotificationMessageType }> = ({
  notification,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const hideTimeout = React.useRef<number | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseEnter = () => {
      clearHideTimeout();
    };

    el.addEventListener('mouseenter', onMouseEnter);

    clearHideTimeout();
    hideTimeout.current = setTimeout(() => {
      dismissNotification(notification.id);
    }, HIDE_DELAY);

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      clearHideTimeout();
    };
  }, [notification.id]);

  const isSuccess = notification.type === notificationTypes.SUCCESS;

  return (
    <div
      ref={ref}
      className={`toast show align-items-center text-white border-0 ${
        isSuccess ? 'bg-success' : 'bg-danger'
      }`}
    >
      <div className="d-flex align-items-center">
        <i
          className={`bi ${isSuccess ? 'bi-check-circle' : 'bi-exclamation-triangle'} mx-3 fs-5`}
        />
        <div className="toast-body">{notification.message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-3 m-auto"
          onClick={() => dismissNotification(notification.id)}
        ></button>
      </div>
    </div>
  );
};
