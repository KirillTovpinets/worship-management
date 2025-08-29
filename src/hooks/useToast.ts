import { useNotification } from "../components/ui";

export const useToast = () => {
  const notification = useNotification();

  return {
    toast: notification.addToast,
    success: notification.success,
    error: notification.error,
    warning: notification.warning,
    info: notification.info,
    remove: notification.removeToast,
    clearAll: notification.clearAll,
  };
};
