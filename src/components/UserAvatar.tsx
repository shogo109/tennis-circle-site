import { memo } from "react";

interface Props {
  displayName: string;
  size?: "sm" | "md";
  onClick?: () => void;
  isButton?: boolean;
}

function UserAvatar({ displayName, size = "md", onClick, isButton = true }: Props) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
  };

  const commonClasses = `${sizeClasses[size]} rounded-full bg-tennis-court/10 flex items-center justify-center hover:bg-tennis-court/20 transition-colors`;

  if (!isButton) {
    return (
      <div className={commonClasses}>
        <span className="font-medium text-tennis-court">{displayName.charAt(0)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={commonClasses}
    >
      <span className="font-medium text-tennis-court">{displayName.charAt(0)}</span>
    </button>
  );
}

export default memo(UserAvatar);
