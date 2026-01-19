'use client';

import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface RiskSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  tooltip?: {
    term: string;
    definition: string;
    example?: string;
    defaultValue?: string;
    typicalRange?: string;
  };
}

const riskLevels = [
  { value: 1, label: 'Très faible', emoji: '😌', color: 'bg-green-100 border-green-400 text-green-700' },
  { value: 2, label: 'Faible', emoji: '🙂', color: 'bg-lime-100 border-lime-400 text-lime-700' },
  { value: 3, label: 'Moyen', emoji: '😐', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  { value: 4, label: 'Élevé', emoji: '😟', color: 'bg-orange-100 border-orange-400 text-orange-700' },
  { value: 5, label: 'Très élevé', emoji: '😰', color: 'bg-red-100 border-red-400 text-red-700' },
];

export function RiskSlider({
  label,
  value,
  onChange,
  helpText,
  tooltip,
}: RiskSliderProps) {
  const currentLevel = riskLevels.find(level => level.value === value) || riskLevels[2];

  return (
    <div className="w-full bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-gray-300 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-base font-semibold text-gray-800">
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
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${currentLevel.color} font-semibold`}>
          <span className="text-2xl">{currentLevel.emoji}</span>
          <span className="text-sm">{currentLevel.label}</span>
        </div>
      </div>

      {/* Risk Level Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {riskLevels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
              value === level.value
                ? `${level.color} border-current shadow-md scale-105`
                : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="text-2xl mb-1">{level.emoji}</span>
            <span className="text-xs font-medium text-center leading-tight">{level.label}</span>
          </button>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer risk-slider"
      />

      {/* Help Text */}
      {helpText && (
        <p className="mt-3 text-sm text-gray-600 italic">{helpText}</p>
      )}

      <style jsx>{`
        .risk-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s;
        }
        .risk-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        }
        .risk-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s;
        }
        .risk-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}
