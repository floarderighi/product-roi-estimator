'use client';

interface TypicalRangeProps {
  range: string;
}

export function TypicalRange({ range }: TypicalRangeProps) {
  // Parse typical range string like "Excellent: <3% | Bon: 3-5% | À améliorer: 5-10%"
  const segments = range.split('|').map(s => s.trim());

  return (
    <div className="mt-2 p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      <div className="flex items-start gap-1.5">
        <svg
          className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
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
        <div className="flex-1">
          <p className="text-xs font-medium text-blue-900 mb-1">💡 Ordres de grandeur :</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {segments.map((segment, idx) => (
              <span key={idx} className="text-xs text-blue-800">
                {segment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
