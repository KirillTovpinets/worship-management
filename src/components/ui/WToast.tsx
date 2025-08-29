import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface WToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const WToast = ({
  toast,
  onRemove,
  position = "top-right",
}: WToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  const baseClasses =
    "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform";

  const typeClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const positionClasses = {
    "top-right": "translate-x-full",
    "top-left": "-translate-x-full",
    "bottom-right": "translate-x-full",
    "bottom-left": "-translate-x-full",
    "top-center": "translate-y-full",
    "bottom-center": "-translate-y-full",
  };

  const classes = `
    ${baseClasses}
    ${typeClasses[toast.type]}
    ${
      isVisible && !isLeaving
        ? "translate-x-0 translate-y-0"
        : positionClasses[position]
    }
    ${isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"}
  `;

  return (
    <div className={classes}>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-medium text-sm mb-1">{toast.title}</div>
        )}
        <div className="text-sm">{toast.message}</div>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-xs font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
