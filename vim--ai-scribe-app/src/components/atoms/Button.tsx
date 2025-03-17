import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
  tooltip?: string;
}

export const Button = ({
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  children,
  fullWidth = false,
  tooltip,
}: ButtonProps) => {
  const classnames = clsx(
    "inline-flex items-center justify-center transition-colors font-medium rounded-lg px-4 py-2",
    {
      "w-full": fullWidth,
      "text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500":
        variant === "primary",
      "text-gray-600 bg-gray-100 hover:bg-gray-200": variant === "secondary",
      "text-gray-500 hover:bg-gray-100 hover:text-gray-700":
        variant === "ghost",
      "cursor-not-allowed": disabled,
    },
    className
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classnames}
      title={tooltip}
    >
      {children}
    </button>
  );
};
