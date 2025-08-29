import { Toast, WToast } from "./WToast";

interface WToasterProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
}

export const WToaster = ({
  toasts,
  onRemove,
  position = "top-right",
  maxToasts = 5,
}: WToasterProps) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const containerClasses = `
    fixed z-50 flex flex-col gap-2 pointer-events-none
    ${positionClasses[position]}
  `;

  // Limit the number of toasts displayed
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div className={containerClasses}>
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <WToast toast={toast} onRemove={onRemove} position={position} />
        </div>
      ))}
    </div>
  );
};
