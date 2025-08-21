import { ReactNode } from "react";

interface WAlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  className?: string;
}

export const WAlert = ({
  children,
  variant = "info",
  className = "",
}: WAlertProps) => {
  const baseClasses = "border rounded-md px-4 py-3";

  const variantClasses = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
};

interface WAlertTitleProps {
  children: ReactNode;
  className?: string;
}

export const WAlertTitle = ({ children, className = "" }: WAlertTitleProps) => {
  return <h3 className={`font-medium ${className}`}>{children}</h3>;
};

interface WAlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const WAlertDescription = ({
  children,
  className = "",
}: WAlertDescriptionProps) => {
  return <div className={`mt-2 text-sm ${className}`}>{children}</div>;
};
