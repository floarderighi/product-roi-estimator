'use client';

import React from 'react';

interface ConfidenceSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    emoji: string;
    description: string;
    color: string;
  }[];
  helpText?: string;
}

export function ConfidenceSelector({
  label,
  value,
  onChange,
  options,
  helpText,
}: ConfidenceSelectorProps) {
  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-base font-semibold text-gray-800 mb-3">
        {label}
      </label>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all transform hover:scale-105 active:scale-95 text-left ${
              value === option.value
                ? `${option.color} border-current shadow-lg scale-105`
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{option.emoji}</span>
              <span className={`text-sm font-semibold ${
                value === option.value ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </div>
            <p className={`text-xs ${
              value === option.value ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="mt-2 text-sm text-gray-600 italic">{helpText}</p>
      )}
    </div>
  );
}
