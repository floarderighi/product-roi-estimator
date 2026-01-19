import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  unit?: string;
  tooltip?: {
    term: string;
    definition: string;
    example?: string;
    defaultValue?: string;
    typicalRange?: string;
  };
}

export function Input({
  label,
  helpText,
  error,
  unit,
  tooltip,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
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
      )}
      <div className="relative">
        <input
          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
            error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
          } ${unit ? 'pr-16' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
