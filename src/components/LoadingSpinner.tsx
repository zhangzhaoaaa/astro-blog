import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
  variant?: "default" | "accent" | "muted";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text,
  variant = "accent",
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  const variantClasses = {
    default: "border-skin-base",
    accent: "border-skin-accent",
    muted: "border-skin-muted",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      <div
        className={`
          animate-spin rounded-full border-2 border-t-transparent
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span
          className={`
            text-skin-muted
            ${textSizeClasses[size]}
          `}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
