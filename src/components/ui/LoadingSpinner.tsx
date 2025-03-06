
import React from 'react';

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const LoadingSpinner = ({ size = "medium", className = "" }: LoadingSpinnerProps) => {
  const getSize = () => {
    switch (size) {
      case "small": return "w-5 h-5";
      case "large": return "w-10 h-10";
      default: return "w-8 h-8";
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${getSize()} border-4 border-zou-purple/20 border-t-zou-purple rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
