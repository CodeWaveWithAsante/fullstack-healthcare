import React from "react";
import { FaSpinner } from "react-icons/fa6";

export const Loader = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center w-full justify-center">
      <FaSpinner size={size} className="animate-spin text-xl text-blue-600" />
    </div>
  );
};
