import { ButtonHTMLAttributes, ReactNode } from "react";

interface WButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "success"
    | "warning"
    | "ghost";
  size?: "sm" | "md" | "lg" | "none";
  className?: string;
}

export const WButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: WButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantClasses = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary:
      "bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500",
    tertiary:
      "hover:text-indigo-600 hover:underline bg-transparent text-indigo-600 focus:outline-none",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning:
      "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-500 border border-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    none: "",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

interface WIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "ghost"
    | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string;
}

export const WIconButton = ({
  children,
  variant = "ghost",
  size = "md",
  className = "",
  title,
  ...props
}: WIconButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantClasses = {
    primary:
      "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 focus:ring-indigo-500",
    secondary:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500",
    danger:
      "text-red-600 hover:text-red-900 hover:bg-red-50 focus:ring-red-500",
    success:
      "text-green-600 hover:text-green-900 hover:bg-green-50 focus:ring-green-500",
    warning:
      "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 focus:ring-yellow-500",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500",
    info: "text-blue-600 hover:text-blue-900 hover:bg-blue-50 focus:ring-blue-500",
  };

  const sizeClasses = {
    sm: "p-1",
    md: "p-1",
    lg: "p-2",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} title={title} {...props}>
      {children}
    </button>
  );
};
