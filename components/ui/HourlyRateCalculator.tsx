'use client';

import { useState } from 'react';
import { Button } from './Button';

interface HourlyRateCalculatorProps {
  onCalculated: (hourlyRate: number) => void;
  defaultAnnualSalary?: number;
}

// Profiles prédéfinis pour faciliter la saisie
const PROFILES = [
  { label: 'Support N1', annualSalary: 28000, description: 'Agent de support junior' },
  { label: 'Support N2', annualSalary: 35000, description: 'Technicien confirmé' },
  { label: 'Support N3', annualSalary: 45000, description: 'Expert technique' },
  { label: 'Backoffice', annualSalary: 32000, description: 'Opérations administratives' },
  { label: 'Commercial', annualSalary: 50000, description: 'Sales representative' },
  { label: 'Développeur', annualSalary: 55000, description: 'Ingénieur logiciel' },
];

export function HourlyRateCalculator({ onCalculated, defaultAnnualSalary = 35000 }: HourlyRateCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [annualSalary, setAnnualSalary] = useState(defaultAnnualSalary);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Formule de calcul du taux horaire chargé
  // Salaire brut annuel → avec charges patronales (×1.42) → overhead (×1.2) → horaire (÷1600h)
  const calculateHourlyRate = (salary: number): number => {
    const withCharges = salary * 1.42; // +42% charges patronales
    const withOverhead = withCharges * 1.2; // +20% overhead (bureau, outils, management)
    const hourlyRate = withOverhead / 1600; // 1600h travaillées/an (220j × ~7.3h)
    return Math.round(hourlyRate);
  };

  const currentHourlyRate = calculateHourlyRate(annualSalary);

  const handleProfileSelect = (profile: typeof PROFILES[0]) => {
    setSelectedProfile(profile.label);
    setAnnualSalary(profile.annualSalary);
  };

  const handleApply = () => {
    onCalculated(currentHourlyRate);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>Calculer le taux horaire</span>
      </button>
    );
  }

  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">🧮 Calculateur de taux horaire</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Choisissez un profil ou saisissez un salaire annuel brut
      </p>

      {/* Profils prédéfinis */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {PROFILES.map((profile) => (
          <button
            key={profile.label}
            type="button"
            onClick={() => handleProfileSelect(profile)}
            className={`p-2 text-left text-xs border rounded-lg transition-all ${
              selectedProfile === profile.label
                ? 'bg-indigo-100 border-indigo-500 text-indigo-900'
                : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <div className="font-semibold">{profile.label}</div>
            <div className="text-gray-600 text-[10px]">{profile.description}</div>
          </button>
        ))}
      </div>

      {/* Saisie manuelle */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Ou saisissez le salaire annuel brut
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={annualSalary}
            onChange={(e) => {
              setAnnualSalary(Number(e.target.value));
              setSelectedProfile(null);
            }}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min={0}
            step={1000}
          />
          <span className="text-sm text-gray-600 whitespace-nowrap">€/an</span>
        </div>
      </div>

      {/* Résultat */}
      <div className="bg-white rounded-lg p-3 mb-3 border border-indigo-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Taux horaire chargé :</span>
          <span className="text-lg font-bold text-indigo-600">
            {currentHourlyRate} €/h
          </span>
        </div>
        <div className="text-[10px] text-gray-500 space-y-0.5">
          <div>• Salaire brut : {annualSalary.toLocaleString()} €/an</div>
          <div>• Avec charges (×1.42) : {Math.round(annualSalary * 1.42).toLocaleString()} €</div>
          <div>• Avec overhead (×1.2) : {Math.round(annualSalary * 1.42 * 1.2).toLocaleString()} €</div>
          <div>• Sur 1600h/an : {currentHourlyRate} €/h</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          className="flex-1"
        >
          Appliquer {currentHourlyRate} €/h
        </Button>
      </div>
    </div>
  );
}
