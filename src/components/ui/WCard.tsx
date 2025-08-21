import { ReactNode } from "react";

interface WCardProps {
  children: ReactNode;
  className?: string;
}

export const WCard = ({ children, className = "" }: WCardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
  );
};

interface WCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const WCardHeader = ({ children, className = "" }: WCardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface WCardContentProps {
  children: ReactNode;
  className?: string;
}

export const WCardContent = ({
  children,
  className = "",
}: WCardContentProps) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface WCardFooterProps {
  children: ReactNode;
  className?: string;
}

export const WCardFooter = ({ children, className = "" }: WCardFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
