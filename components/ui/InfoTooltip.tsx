'use client';

import { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
  term: string;
  definition: string;
  example?: string;
  defaultValue?: string;
  typicalRange?: string;
  children?: React.ReactNode;
}

export function InfoTooltip({
  term,
  definition,
  example,
  defaultValue,
  typicalRange,
  children
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 ml-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-label={`Information about ${term}`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-80 p-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 left-0 sm:left-auto sm:right-0"
          role="tooltip"
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Term */}
          <div className="mb-2 pr-6">
            <h4 className="text-sm font-semibold text-gray-900">{term}</h4>
          </div>

          {/* Definition */}
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {definition}
          </p>

          {/* Example */}
          {example && (
            <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-xs font-medium text-blue-900 mb-1">💡 Exemple</p>
              <p className="text-xs text-blue-800 leading-relaxed">{example}</p>
            </div>
          )}

          {/* Typical Range */}
          {typicalRange && (
            <div className="p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-100">
              <p className="text-xs font-medium text-green-900 mb-1">📊 Ordres de grandeur</p>
              <div className="space-y-0.5">
                {typicalRange.split('|').map((segment, idx) => (
                  <p key={idx} className="text-xs text-green-800">
                    {segment.trim()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Custom children content */}
          {children && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
