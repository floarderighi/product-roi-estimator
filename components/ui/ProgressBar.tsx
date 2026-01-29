import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center relative">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-md scale-105'
                    : index < currentStep
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <span className="text-sm sm:text-base">✓</span>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                  index === currentStep
                    ? 'text-primary-600'
                    : index < currentStep
                    ? 'text-gray-700 hidden sm:block'
                    : 'text-gray-400 hidden sm:block'
                }`}
              >
                {step}
              </span>

              {/* Indicator dot for current step */}
              {index === currentStep && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600"></div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    index < currentStep
                      ? 'w-full bg-gray-700'
                      : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
