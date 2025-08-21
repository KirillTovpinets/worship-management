import { ReactNode } from "react";

interface WModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const WModal = ({
  isOpen,
  onClose,
  children,
  className = "",
}: WModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

interface WModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const WModalHeader = ({
  children,
  onClose,
  className = "",
}: WModalHeaderProps) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <h3 className="text-xl font-medium text-gray-900">{children}</h3>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

interface WModalContentProps {
  children: ReactNode;
  className?: string;
}

export const WModalContent = ({
  children,
  className = "",
}: WModalContentProps) => {
  return <div className={`mt-3 ${className}`}>{children}</div>;
};

interface WModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const WModalFooter = ({
  children,
  className = "",
}: WModalFooterProps) => {
  return (
    <div className={`flex justify-end space-x-3 mt-6 ${className}`}>
      {children}
    </div>
  );
};
