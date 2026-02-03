import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary-light dark:text-primary-dark`}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default Loader;
