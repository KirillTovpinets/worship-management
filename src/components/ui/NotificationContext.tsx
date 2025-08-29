import { createContext, ReactNode, useContext, useReducer } from "react";
import { Toast } from "./WToast";
import { WToaster } from "./WToaster";

interface NotificationState {
  toasts: Toast[];
}

type NotificationAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: { id: string } }
  | { type: "CLEAR_ALL" };

interface NotificationContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (message: string, title?: string, options?: Partial<Toast>) => void;
  error: (message: string, title?: string, options?: Partial<Toast>) => void;
  warning: (message: string, title?: string, options?: Partial<Toast>) => void;
  info: (message: string, title?: string, options?: Partial<Toast>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction,
): NotificationState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

interface NotificationProviderProps {
  children: ReactNode;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
}

export const NotificationProvider = ({
  children,
  position = "top-right",
  maxToasts = 5,
}: NotificationProviderProps) => {
  const [state, dispatch] = useReducer(notificationReducer, { toasts: [] });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };
    dispatch({ type: "ADD_TOAST", payload: newToast });
  };

  const removeToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: { id } });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const success = (
    message: string,
    title?: string,
    options?: Partial<Toast>,
  ) => {
    addToast({
      type: "success",
      message,
      title,
      ...options,
    });
  };

  const error = (message: string, title?: string, options?: Partial<Toast>) => {
    addToast({
      type: "error",
      message,
      title,
      ...options,
    });
  };

  const warning = (
    message: string,
    title?: string,
    options?: Partial<Toast>,
  ) => {
    addToast({
      type: "warning",
      message,
      title,
      ...options,
    });
  };

  const info = (message: string, title?: string, options?: Partial<Toast>) => {
    addToast({
      type: "info",
      message,
      title,
      ...options,
    });
  };

  const value: NotificationContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <WToaster
        toasts={state.toasts}
        onRemove={removeToast}
        position={position}
        maxToasts={maxToasts}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
