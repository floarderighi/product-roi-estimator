'use client';

import { useState } from 'react';
import { InfoTooltip } from './InfoTooltip';

type TeamMember = {
  id: string;
  role: 'dev' | 'pm' | 'designer' | 'qa';
  monthlyCost: number;
};

const roleConfig = {
  dev: {
    label: 'Développeur',
    emoji: '👨‍💻',
    defaultCost: 10000,
    color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    activeColor: 'bg-blue-200 border-blue-500',
  },
  pm: {
    label: 'Product Manager',
    emoji: '🎯',
    defaultCost: 9000,
    color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
    activeColor: 'bg-purple-200 border-purple-500',
  },
  designer: {
    label: 'Designer',
    emoji: '🎨',
    defaultCost: 8000,
    color: 'bg-pink-100 border-pink-300 hover:bg-pink-200',
    activeColor: 'bg-pink-200 border-pink-500',
  },
  qa: {
    label: 'QA',
    emoji: '🔍',
    defaultCost: 7000,
    color: 'bg-green-100 border-green-300 hover:bg-green-200',
    activeColor: 'bg-green-200 border-green-500',
  },
};

interface SquadBuilderProps {
  timeMonths: number;
  onTimeChange: (months: number) => void;
  onSquadChange: (people: number, avgCost: number) => void;
}

export function SquadBuilder({ timeMonths, onTimeChange, onSquadChange }: SquadBuilderProps) {
  const [squad, setSquad] = useState<TeamMember[]>([
    { id: '1', role: 'dev', monthlyCost: 10000 },
    { id: '2', role: 'pm', monthlyCost: 9000 },
  ]);

  const addMember = (role: 'dev' | 'pm' | 'designer' | 'qa') => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      role,
      monthlyCost: roleConfig[role].defaultCost,
    };
    const newSquad = [...squad, newMember];
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const removeMember = (id: string) => {
    const newSquad = squad.filter((m) => m.id !== id);
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const updateMemberCost = (id: string, cost: number) => {
    const newSquad = squad.map((m) => (m.id === id ? { ...m, monthlyCost: cost } : m));
    setSquad(newSquad);
    updateParent(newSquad);
  };

  const updateParent = (currentSquad: TeamMember[]) => {
    const totalPeople = currentSquad.length;
    const avgCost = currentSquad.length > 0
      ? currentSquad.reduce((sum, m) => sum + m.monthlyCost, 0) / currentSquad.length
      : 8000;
    onSquadChange(totalPeople, Math.round(avgCost));
  };

  const totalCost = squad.reduce((sum, m) => sum + m.monthlyCost, 0) * timeMonths;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          👥 Composez votre Squad
        </h3>
        <div className="text-sm text-gray-600">
          {squad.length} {squad.length > 1 ? 'personnes' : 'personne'}
        </div>
      </div>

      {/* Squad Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {squad.map((member) => {
          const config = roleConfig[member.role];
          return (
            <div
              key={member.id}
              className={`${config.activeColor} border-2 rounded-lg p-3 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="font-medium text-sm">{config.label}</span>
                </div>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                  aria-label="Retirer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={member.monthlyCost}
                  onChange={(e) => updateMemberCost(member.id, Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={0}
                />
                <span className="text-xs text-gray-600 whitespace-nowrap">€/mois</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
          const config = roleConfig[role];
          return (
            <button
              key={role}
              onClick={() => addMember(role)}
              className={`${config.color} border-2 rounded-lg p-2 text-sm font-medium transition-all hover:scale-105 active:scale-95`}
            >
              <div className="text-xl mb-1">{config.emoji}</div>
              <div className="text-xs">+ {config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Duration Slider */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <span>⏱️ Durée du projet</span>
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onTimeChange(Math.max(1, timeMonths - 1))}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 transition-all active:scale-95"
          >
            <span className="text-lg font-bold">-</span>
          </button>
          <div className="flex-1">
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={timeMonths}
              onChange={(e) => onTimeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <button
            onClick={() => onTimeChange(Math.min(12, timeMonths + 1))}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary-500 transition-all active:scale-95"
          >
            <span className="text-lg font-bold">+</span>
          </button>
          <span className="text-lg font-semibold text-primary-600 min-w-[60px] text-center">
            {timeMonths} mois
          </span>
        </div>
      </div>

      {/* Total Cost Display */}
      <div className="bg-white rounded-lg p-4 border-2 border-indigo-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">💰 Coût total de delivery</span>
          <span className="text-2xl font-bold text-indigo-600">
            {totalCost.toLocaleString()} €
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {squad.length} × {timeMonths} mois = {(squad.length * timeMonths).toLocaleString()} personnes-mois
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
