import React from "react";

interface StepProgressProps {
  currentStep: number;
  steps: { id: string; name: string; fields?: string[] }[];
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="w-full flex justify-between items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="relative w-full">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                index <= currentStep
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-100 bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            {/* Line connector */}
            {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-full  w-28 h-1 bg-gray-300 z-[-1]"></div>
            )}
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">{step.name}</p>
        </div>
      ))}
    </div>
  );
};
