'use client';

import { useState } from 'react';
import { InfoTooltip } from './InfoTooltip';
import { SALARY_SOURCES } from '@/lib/sources';

type TeamMember = {
  id: string;
  role: 'dev' | 'pm' | 'designer' | 'qa';
  level: 'junior' | 'confirmed' | 'senior';
  monthlyCost: number;
};

const roleConfig = {
  dev: {
    label: 'Développeur',
    emoji: '👨‍💻',
    defaultCost: 5600, // ~67k€/an ÷ 12 (confirmé)
    salaryData: SALARY_SOURCES.developer,
    sources: SALARY_SOURCES.developer.sources,
  },
  pm: {
    label: 'Product Manager',
    emoji: '🎯',
    defaultCost: 6500, // ~78k€/an ÷ 12 (confirmé)
    salaryData: SALARY_SOURCES.productManager,
    sources: SALARY_SOURCES.productManager.sources,
  },
  designer: {
    label: 'Product Designer',
    emoji: '🎨',
    defaultCost: 5150, // ~61.75k€/an ÷ 12 (confirmé)
    salaryData: SALARY_SOURCES.designer,
    sources: SALARY_SOURCES.designer.sources,
  },
  qa: {
    label: 'QA',
    emoji: '🔍',
    defaultCost: 4500, // ~54k€/an ÷ 12 (similaire designer)
    salaryData: {
      junior: { grossAnnual: 38000, totalCost: 49000, description: 'QA junior' },
      confirmed: { grossAnnual: 44000, totalCost: 57000, description: 'QA confirmé' },
      senior: { grossAnnual: 55000, totalCost: 71000, description: 'QA senior' },
    },
    sources: [],
  },
};

interface SquadBuilderProps {
  timeMonths: number;
  onTimeChange: (months: number) => void;
  onSquadChange: (people: number, avgCost: number) => void;
  initialSquad?: TeamMember[];
  onSquadUpdate?: (squad: TeamMember[]) => void;
}

export function SquadBuilder({ timeMonths, onTimeChange, onSquadChange, initialSquad, onSquadUpdate }: SquadBuilderProps) {
  const [squad, setSquad] = useState<TeamMember[]>(
    initialSquad || [
      { id: '1', role: 'dev', level: 'confirmed', monthlyCost: roleConfig.dev.defaultCost },
      { id: '2', role: 'pm', level: 'confirmed', monthlyCost: roleConfig.pm.defaultCost },
    ]
  );

  const addMember = (role: 'dev' | 'pm' | 'designer' | 'qa') => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      role,
      level: 'confirmed',
      monthlyCost: roleConfig[role].defaultCost,
    };
    const newSquad = [...squad, newMember];
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const updateMemberLevel = (id: string, level: 'junior' | 'confirmed' | 'senior') => {
    const member = squad.find((m) => m.id === id);
    if (!member) return;

    const config = roleConfig[member.role];
    const newCost = Math.round(config.salaryData[level].totalCost / 12);

    const newSquad = squad.map((m) =>
      m.id === id ? { ...m, level, monthlyCost: newCost } : m
    );
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const removeMember = (id: string) => {
    const newSquad = squad.filter((m) => m.id !== id);
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const updateMemberCost = (id: string, cost: number) => {
    const newSquad = squad.map((m) => {
      if (m.id === id) {
        return { ...m, monthlyCost: cost };
      }
      return m;
    });
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const updateParent = (currentSquad: TeamMember[]) => {
    const totalPeople = currentSquad.length;
    const avgCost = currentSquad.length > 0
      ? currentSquad.reduce((sum, m) => sum + m.monthlyCost, 0) / currentSquad.length
      : 8000;
    onSquadChange(totalPeople, Math.round(avgCost));
    onSquadUpdate?.(currentSquad);
  };

  const totalCost = squad.reduce((sum, m) => sum + m.monthlyCost, 0) * timeMonths;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Squad Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              👥 Squad
            </h3>
            <InfoTooltip
              term="Coût employeur"
              definition="Indiquez le coût total employeur (salaire brut + charges patronales). En France, les charges patronales représentent environ 42% du salaire brut."
            >
              <div className="text-xs text-gray-700">
                <p className="mb-2">Utilisez le simulateur URSSAF pour estimer le coût total :</p>
                <a
                  href="https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <span>Calculer mon coût employeur</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </InfoTooltip>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {squad.length} pers.
          </span>
        </div>

        {/* Squad Members - Compact Mobile Design */}
        <div className="space-y-2 mb-3 sm:mb-4">
          {squad.map((member) => {
            const config = roleConfig[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                {/* Emoji + Role name (compact) */}
                <div className="flex items-center gap-1.5 min-w-0 w-24 sm:w-32 flex-shrink-0">
                  <span className="text-lg sm:text-xl">{config.emoji}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{config.label.split(' ')[0]}</span>
                </div>

                {/* Level selector (compact) */}
                <select
                  value={member.level}
                  onChange={(e) => updateMemberLevel(member.id, e.target.value as 'junior' | 'confirmed' | 'senior')}
                  className="w-20 sm:w-24 px-1.5 sm:px-2 py-1.5 text-xs sm:text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="junior">Jr</option>
                  <option value="confirmed">Conf.</option>
                  <option value="senior">Sr</option>
                </select>

                {/* Cost input (compact) */}
                <div className="flex items-center gap-0.5 flex-1 min-w-0">
                  <input
                    type="number"
                    value={member.monthlyCost || 0}
                    onChange={(e) => updateMemberCost(member.id, Number(e.target.value) || 0)}
                    className="w-full min-w-0 px-1.5 sm:px-2 py-1.5 text-xs sm:text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 text-right"
                    min={0}
                  />
                  <span className="text-xs text-gray-500 flex-shrink-0">€</span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 p-1"
                  aria-label="Retirer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Member Buttons - Compact grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
            const config = roleConfig[role];
            return (
              <button
                key={role}
                onClick={() => addMember(role)}
                className="flex flex-col items-center justify-center gap-0.5 p-2 sm:p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all"
              >
                <span className="text-lg sm:text-xl">{config.emoji}</span>
                <span className="text-[10px] sm:text-xs text-gray-600">+Ajouter</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Section - Compact */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            ⏱️ Durée
          </h3>
          <span className="text-base sm:text-lg font-semibold text-indigo-600">
            {timeMonths} mois
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onTimeChange(Math.max(1, timeMonths - 1))}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition-all"
          >
            <span className="text-base sm:text-lg font-bold text-gray-600">−</span>
          </button>
          <div className="flex-1">
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={timeMonths}
              onChange={(e) => onTimeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <button
            onClick={() => onTimeChange(Math.min(24, timeMonths + 1))}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition-all"
          >
            <span className="text-base sm:text-lg font-bold text-gray-600">+</span>
          </button>
        </div>
      </div>

      {/* Total Cost Display - Compact */}
      <div className="bg-indigo-50 rounded-xl p-3 sm:p-5 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">💰 Coût delivery</span>
            <div className="text-[10px] sm:text-xs text-gray-500">
              {squad.length} × {timeMonths}m = {(squad.length * timeMonths)} pers-mois
            </div>
          </div>
          <span className="text-xl sm:text-3xl font-bold text-indigo-600">
            {totalCost.toLocaleString()}€
          </span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
