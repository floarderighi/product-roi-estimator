'use client';

import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  emoji?: string;
  tooltip?: {
    term: string;
    definition: string;
    example?: string;
    defaultValue?: string;
    typicalRange?: string;
  };
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 1000000,
  step = 1,
  unit,
  helpText,
  emoji,
  tooltip,
}: NumberStepperProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        {emoji && <span className="mr-2">{emoji}</span>}
        <span>{label}</span>
        {tooltip && (
          <InfoTooltip
            term={tooltip.term}
            definition={tooltip.definition}
            example={tooltip.example}
            defaultValue={tooltip.defaultValue}
            typicalRange={tooltip.typicalRange}
          />
        )}
      </label>

      {/* Stepper Controls */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 hover:shadow-md"
        >
          <span className="text-xl font-bold text-gray-700">−</span>
        </button>

        <div className="flex-1 relative">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-full px-4 py-2.5 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium pointer-events-none">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 hover:shadow-md"
        >
          <span className="text-xl font-bold text-gray-700">+</span>
        </button>
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="mt-1.5 text-xs text-gray-500 ml-1">{helpText}</p>
      )}
    </div>
  );
}
