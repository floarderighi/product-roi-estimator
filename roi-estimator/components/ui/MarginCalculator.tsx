'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface MarginCalculatorProps {
  onCalculated: (margin: number) => void;
  defaultRevenue?: number;
}

export function MarginCalculator({ onCalculated, defaultRevenue = 100000 }: MarginCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [revenue, setRevenue] = useState(defaultRevenue);
  const [costs, setCosts] = useState({
    servers: 0,
    licenses: 0,
    support: 0,
    other: 0,
  });

  const totalCosts = costs.servers + costs.licenses + costs.support + costs.other;
  const calculatedMargin = revenue > 0 ? Math.round(((revenue - totalCosts) / revenue) * 100) : 0;

  const handleUseCalculation = () => {
    onCalculated(calculatedMargin);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
      >
        ❓ Tu ne la connais pas ? Calculer ma marge brute
      </button>
    );
  }

  return (
    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">📊 Calculateur de Marge Brute</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-4">
        Estime tes coûts directs mensuels pour calculer ta marge brute
      </p>

      <div className="space-y-3">
        <Input
          label="Revenue mensuel"
          type="number"
          unit="€"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          min={0}
        />

        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Coûts directs mensuels :</p>

          <div className="space-y-2">
            <Input
              label="Infrastructure / Serveurs"
              type="number"
              unit="€"
              placeholder="ex: 5000"
              value={costs.servers || ''}
              onChange={(e) => setCosts({ ...costs, servers: Number(e.target.value) || 0 })}
              min={0}
            />

            <Input
              label="Licences logicielles"
              type="number"
              unit="€"
              placeholder="ex: 2000"
              value={costs.licenses || ''}
              onChange={(e) => setCosts({ ...costs, licenses: Number(e.target.value) || 0 })}
              min={0}
            />

            <Input
              label="Support client direct"
              type="number"
              unit="€"
              placeholder="ex: 3000"
              value={costs.support || ''}
              onChange={(e) => setCosts({ ...costs, support: Number(e.target.value) || 0 })}
              min={0}
            />

            <Input
              label="Autres coûts directs"
              type="number"
              unit="€"
              placeholder="ex: 1000"
              value={costs.other || ''}
              onChange={(e) => setCosts({ ...costs, other: Number(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-blue-200">
          <div className="bg-white p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Revenue mensuel :</span>
              <span className="text-sm font-medium">{revenue.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Coûts directs totaux :</span>
              <span className="text-sm font-medium text-red-600">-{totalCosts.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Marge brute estimée :</span>
              <span className="text-lg font-bold text-primary-600">{calculatedMargin}%</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            💡 Formule : (Revenue - Coûts directs) / Revenue × 100
          </p>
        </div>

        <Button
          type="button"
          onClick={handleUseCalculation}
          size="sm"
          className="w-full"
          disabled={revenue <= 0}
        >
          Utiliser cette marge ({calculatedMargin}%)
        </Button>
      </div>
    </div>
  );
}
