'use client';

interface ModeToggleProps {
  isExpertMode: boolean;
  onChange: (isExpert: boolean) => void;
}

export function ModeToggle({ isExpertMode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 mb-6">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium transition-colors ${!isExpertMode ? 'text-primary-700' : 'text-gray-500'}`}>
          ⚡ Mode Simple
        </span>
        <button
          type="button"
          onClick={() => onChange(!isExpertMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isExpertMode ? 'bg-primary-600' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={isExpertMode}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isExpertMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${isExpertMode ? 'text-primary-700' : 'text-gray-500'}`}>
          🔧 Mode Expert
        </span>
      </div>

      <div className="ml-4 pl-4 border-l border-blue-300">
        {!isExpertMode ? (
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Rapide :</span> Seulement les champs essentiels
          </p>
        ) : (
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Contrôle total :</span> Tous les paramètres avancés
          </p>
        )}
      </div>
    </div>
  );
}
