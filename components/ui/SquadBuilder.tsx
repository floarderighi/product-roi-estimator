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
    <div className="space-y-6">
      {/* Squad Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              👥 Composez votre Squad
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
          <span className="text-sm text-gray-500">
            {squad.length} {squad.length > 1 ? 'personnes' : 'personne'}
          </span>
        </div>

        {/* Squad Members - Table Style */}
        <div className="space-y-2 mb-4">
          {squad.map((member) => {
            const config = roleConfig[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{config.emoji}</span>
                <div className="flex items-center gap-1 flex-shrink-0 min-w-[120px]">
                  <span className="font-medium text-sm">{config.label}</span>
                  <InfoTooltip
                    term={config.label}
                    definition=""
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <p className="text-xs text-gray-600">
                        Coûts moyens France 2025 (charges patronales ~43%)
                      </p>

                      {/* Junior */}
                      <div className="p-2.5 bg-blue-50 rounded-md border border-blue-100">
                        <p className="text-xs font-bold text-blue-900 mb-1.5">📊 Junior</p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          <span className="font-semibold">Salaire brut :</span>{' '}
                          {Math.round(config.salaryData.junior.grossAnnual / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-blue-600">({config.salaryData.junior.grossAnnual.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          <span className="font-semibold">Coût total employeur :</span>{' '}
                          {Math.round(config.salaryData.junior.totalCost / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-blue-600">({config.salaryData.junior.totalCost.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                      </div>

                      {/* Confirmé */}
                      <div className="p-2.5 bg-indigo-50 rounded-md border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-900 mb-1.5">📊 Confirmé</p>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                          <span className="font-semibold">Salaire brut :</span>{' '}
                          {Math.round(config.salaryData.confirmed.grossAnnual / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-indigo-600">({config.salaryData.confirmed.grossAnnual.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                        <p className="text-xs text-indigo-800 leading-relaxed">
                          <span className="font-semibold">Coût total employeur :</span>{' '}
                          {Math.round(config.salaryData.confirmed.totalCost / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-indigo-600">({config.salaryData.confirmed.totalCost.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                      </div>

                      {/* Senior */}
                      <div className="p-2.5 bg-purple-50 rounded-md border border-purple-100">
                        <p className="text-xs font-bold text-purple-900 mb-1.5">📊 Senior</p>
                        <p className="text-xs text-purple-800 leading-relaxed">
                          <span className="font-semibold">Salaire brut :</span>{' '}
                          {Math.round(config.salaryData.senior.grossAnnual / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-purple-600">({config.salaryData.senior.grossAnnual.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                        <p className="text-xs text-purple-800 leading-relaxed">
                          <span className="font-semibold">Coût total employeur :</span>{' '}
                          {Math.round(config.salaryData.senior.totalCost / 12).toLocaleString('fr-FR')}€/mois{' '}
                          <span className="text-purple-600">({config.salaryData.senior.totalCost.toLocaleString('fr-FR')}€/an)</span>
                        </p>
                      </div>

                      {/* Sources */}
                      {config.sources.length > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">📚 Sources :</p>
                          <div className="space-y-1">
                            {config.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                              >
                                {source.title} →
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </InfoTooltip>
                </div>

                {/* Level selector */}
                <select
                  value={member.level}
                  onChange={(e) => updateMemberLevel(member.id, e.target.value as 'junior' | 'confirmed' | 'senior')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="junior">Junior</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="senior">Senior</option>
                </select>

                <input
                  type="number"
                  value={member.monthlyCost || 0}
                  onChange={(e) => updateMemberCost(member.id, Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min={0}
                />
                <span className="text-sm text-gray-600 flex-shrink-0">€/mois</span>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Retirer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Member Buttons - Simplified */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
            const config = roleConfig[role];
            return (
              <button
                key={role}
                onClick={() => addMember(role)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-500 transition-all"
              >
                <span className="text-lg">{config.emoji}</span>
                <span>+ {config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Section - Separated */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            ⏱️ Durée du projet
          </h3>
          <span className="text-lg font-semibold text-indigo-600">
            {timeMonths} mois
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTimeChange(Math.max(1, timeMonths - 1))}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition-all"
          >
            <span className="text-lg font-bold text-gray-600">−</span>
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
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition-all"
          >
            <span className="text-lg font-bold text-gray-600">+</span>
          </button>
        </div>
      </div>

      {/* Total Cost Display */}
      <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">💰 Coût total de delivery</span>
          <span className="text-3xl font-bold text-indigo-600">
            {totalCost.toLocaleString()} €
          </span>
        </div>
        <div className="text-xs text-gray-600">
          {squad.length} × {timeMonths} mois = {(squad.length * timeMonths)} personnes-mois
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
