import React from "react";
import classNames from "classnames";

const CustomButton = ({
  title,
  variant = "primary",
  fitWidth = false,
  type = "button",
  onClick,
  icon,
  iconPosition = "right",
  isLoading,
  className,
}) => {
  const buttonClasses = classNames(
    "flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md",
    className,
    {
      "bg-primary text-white hover:bg-primary/90":
        variant === "primary",
      "border-2 border-primary text-primary hover:bg-primary hover:text-white":
        variant === "outline",
      "w-fit": fitWidth,
      "w-full": !fitWidth,
      "opacity-50 cursor-not-allowed": isLoading,
    }
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={buttonClasses}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {!isLoading ? title : "Loading..."}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default CustomButton;
