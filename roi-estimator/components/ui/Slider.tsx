import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  tooltip?: {
    term: string;
    definition: string;
    example?: string;
    defaultValue?: string;
    typicalRange?: string;
  };
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  helpText,
  tooltip,
}: SliderProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
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
        <span className="text-sm font-semibold text-primary-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
