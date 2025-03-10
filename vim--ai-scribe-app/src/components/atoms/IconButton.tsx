import { DivideIcon as LucideIcon } from "lucide-react";

interface IconButtonProps {
  Icon: typeof LucideIcon;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const IconButton = ({
  Icon,
  onClick,
  active = false,
  disabled = false,
  label,
  className,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 flex flex-col items-center ${
        active
          ? "text-green-500"
          : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-400 hover:text-gray-600"
      } ${className}`}
    >
      <Icon className="h-6 w-6" />
      {label && <span className="text-sm mt-1">{label}</span>}
    </button>
  );
};
