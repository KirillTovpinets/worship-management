import { ReactNode } from "react";

interface WTableProps {
  children: ReactNode;
  className?: string;
}

export const WTable = ({ children, className = "" }: WTableProps) => {
  return (
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  );
};

interface WTheadProps {
  children: ReactNode;
  className?: string;
}

export const WThead = ({ children, className = "bg-gray-50" }: WTheadProps) => {
  return <thead className={className}>{children}</thead>;
};

interface WThProps {
  children: ReactNode;
  className?: string;
}

export const WTh = ({ children, className = "" }: WThProps) => {
  const defaultClasses =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  return <th className={`${defaultClasses} ${className}`}>{children}</th>;
};

interface WTbodyProps {
  children: ReactNode;
  className?: string;
}

export const WTbody = ({
  children,
  className = "bg-white divide-y divide-gray-200",
}: WTbodyProps) => {
  return <tbody className={className}>{children}</tbody>;
};

interface WTrProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const WTr = ({ children, className = "", onClick }: WTrProps) => {
  const baseClasses = onClick ? "cursor-pointer hover:bg-gray-50" : "";
  return (
    <tr className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
};

interface WTdProps {
  children: ReactNode;
  className?: string;
}

export const WTd = ({ children, className = "" }: WTdProps) => {
  const defaultClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";
  return <td className={`${defaultClasses} ${className}`}>{children}</td>;
};

interface WTableContainerProps {
  children: ReactNode;
  className?: string;
}

export const WTableContainer = ({
  children,
  className = "",
}: WTableContainerProps) => {
  return (
    <div
      className={`bg-white shadow overflow-hidden sm:rounded-md ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};
