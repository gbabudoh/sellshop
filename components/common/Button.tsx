import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-hover disabled:opacity-50",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ""}`}
    >
      {isLoading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
}
