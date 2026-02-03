import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <AlertCircle className="w-6 h-6" />
        <p className="text-lg font-medium">Error</p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-center max-w-md">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-light hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-smooth"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
