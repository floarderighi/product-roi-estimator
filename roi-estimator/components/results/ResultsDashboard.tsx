'use client';

import React from 'react';
import { CalculationResult, ScenarioType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { getEncouragingMessage } from '@/lib/encouragingMessages';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ResultsDashboardProps {
  result: CalculationResult;
  onShare: () => void;
  onExport: () => void;
}

export function ResultsDashboard({ result, onShare, onExport }: ResultsDashboardProps) {
  const [selectedScenario, setSelectedScenario] = React.useState<ScenarioType>('base');

  const scenario = result.scenarios[selectedScenario];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 70) return { label: 'Élevée', color: 'bg-green-100 text-green-800' };
    if (score >= 40) return { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Faible', color: 'bg-red-100 text-red-800' };
  };

  const confidenceBadge = getConfidenceBadge(result.confidenceScore);

  const chartData = scenario.cumulativeCashflow.map((point) => ({
    month: point.month,
    cashflow: point.value,
  }));

  const generateSummary = () => {
    const text = `
📊 ${result.initiative.projectName || 'Analyse ROI'}

💰 Impact Financier (scénario ${selectedScenario === 'conservative' ? 'conservateur' : selectedScenario === 'base' ? 'de base' : 'agressif'}):
• Profit Annuel: ${formatCurrency(scenario.annualProfit)}
• Profit Total (${result.initiative.horizon} mois): ${formatCurrency(scenario.totalProfit)}
• Période de Payback: ${scenario.paybackMonths} mois
• ROI (12 mois): ${scenario.roi12.toFixed(1)}%
• ROI (24 mois): ${scenario.roi24.toFixed(1)}%

📈 Principaux Drivers:
${result.insights.topDrivers.map(d => `• ${d}`).join('\n')}

⚠️ Hypothèses Critiques:
${result.insights.criticalAssumptions.map(a => `• ${a}`).join('\n')}

🎯 Score de Confiance: ${result.confidenceScore}/100 (${confidenceBadge.label})

---
Généré avec Delva ROI Estimator
`.trim();

    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSummary());
    alert('Résumé copié dans le presse-papier !');
  };

  const encouragingMessage = getEncouragingMessage(result);
  const [showCelebration, setShowCelebration] = React.useState(true);

  // Déterminer si on doit célébrer (ROI > 50% ou payback < 12 mois)
  const shouldCelebrate = result.scenarios.base.roi24 > 50 || result.scenarios.base.paybackMonths < 12;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Animation de célébration */}
      {showCelebration && shouldCelebrate && <Celebration />}

      {/* Message d'executive summary */}
      <div className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-gray-200 rounded-xl animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📊</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Vue Executive
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="text-base">
                <span className="font-semibold text-gray-900">Rentabilité atteinte en {scenario.paybackMonths} mois</span>
              </p>
              <p className="text-sm">
                Coût mensuel : <span className="font-semibold">{formatCurrency(result.initiative.runCost)}</span>
                {result.initiative.deliveryCost > 0 && (
                  <span className="text-gray-600"> (+ {formatCurrency(result.initiative.deliveryCost)} d'investissement initial)</span>
                )}
              </p>
              <p className="text-sm">
                Profit généré : <span className="font-semibold">{formatCurrency(scenario.annualProfit / 12)}/mois</span>
                {' · '}
                <span className="font-semibold">{formatCurrency(scenario.annualProfit)}/an</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {result.initiative.projectName || 'Analyse ROI'}
        </h1>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceBadge.color}`}>
            Confiance {confidenceBadge.label} ({result.confidenceScore}/100)
          </span>
          <span className="text-gray-500">
            {new Date(result.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="mb-6 flex gap-2">
        {(['conservative', 'base', 'aggressive'] as ScenarioType[]).map((s) => {
          const labels = { conservative: 'Conservateur', base: 'Base', aggressive: 'Agressif' };
          return (
            <button
              key={s}
              onClick={() => setSelectedScenario(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedScenario === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {/* Key Metrics - Reorganized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Impact Financier */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> Impact Financier
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Profit Annuel</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(scenario.annualProfit)}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg border border-primary-200">
              <div className="text-sm text-gray-600 mb-1">Profit Total ({result.initiative.horizon}m)</div>
              <div className="text-2xl font-bold text-primary-700">
                {formatCurrency(scenario.totalProfit)}
              </div>
            </div>
          </div>
        </Card>

        {/* ROI & Timeline */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Performance
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">⚡ Payback</div>
              <div className="text-2xl font-bold text-gray-900">
                {scenario.paybackMonths} mois
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">📈 ROI 24m</div>
              <div className="text-2xl font-bold text-gray-900">
                {scenario.roi24.toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cumulative Cashflow Chart */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">💰 Cashflow Cumulé</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              label={{ value: 'Mois', position: 'insideBottom', offset: -5 }}
              stroke="#64748b"
            />
            <YAxis
              label={{ value: 'EUR', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Mois ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cashflow"
              stroke="url(#colorCashflow)"
              strokeWidth={4}
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
              name="Cashflow Cumulé"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Scenario Comparison */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Comparaison des Scénarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Métrique</th>
                <th className="text-right py-3 px-4">Conservateur</th>
                <th className="text-right py-3 px-4 bg-primary-50">Base</th>
                <th className="text-right py-3 px-4">Agressif</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Profit Annuel</td>
                <td className="text-right py-3 px-4">{formatCurrency(result.scenarios.conservative.annualProfit)}</td>
                <td className="text-right py-3 px-4 bg-primary-50 font-semibold">{formatCurrency(result.scenarios.base.annualProfit)}</td>
                <td className="text-right py-3 px-4">{formatCurrency(result.scenarios.aggressive.annualProfit)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Payback (mois)</td>
                <td className="text-right py-3 px-4">{result.scenarios.conservative.paybackMonths}</td>
                <td className="text-right py-3 px-4 bg-primary-50 font-semibold">{result.scenarios.base.paybackMonths}</td>
                <td className="text-right py-3 px-4">{result.scenarios.aggressive.paybackMonths}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">ROI (24m)</td>
                <td className="text-right py-3 px-4">{result.scenarios.conservative.roi24.toFixed(1)}%</td>
                <td className="text-right py-3 px-4 bg-primary-50 font-semibold">{result.scenarios.base.roi24.toFixed(1)}%</td>
                <td className="text-right py-3 px-4">{result.scenarios.aggressive.roi24.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights - Reorganized */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column: Drivers & Assumptions */}
        <div className="space-y-6">
          {result.insights.topDrivers.length > 0 && (
            <Card className="border-l-4 border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <span className="text-2xl">✓</span> Principaux Drivers
              </h3>
              <ul className="space-y-2">
                {result.insights.topDrivers.map((driver, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-600 mr-2">•</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.insights.criticalAssumptions.length > 0 && (
            <Card className="border-l-4 border-primary-500">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <span className="text-2xl">⚠️</span> Hypothèses Critiques
              </h3>
              <ul className="space-y-2">
                {result.insights.criticalAssumptions.map((assumption, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <span className="text-primary-600 mr-2">⚠</span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right Column: Risks */}
        {result.insights.dominantRisks.length > 0 && (
          <Card className="border-l-4 border-gray-400">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <span className="text-2xl">⚠️</span> Risques à Surveiller
            </h3>
            <ul className="space-y-2">
              {result.insights.dominantRisks.map((risk, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-600 mr-2">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Actions - Reorganized */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 border-t-2 border-gray-200">
        <Button onClick={copyToClipboard} className="w-full sm:w-auto">
          📋 Copier le Résumé
        </Button>
        <Button variant="outline" onClick={onShare} className="w-full sm:w-auto">
          🔗 Partager le Rapport
        </Button>
        <Button variant="outline" onClick={onExport} className="w-full sm:w-auto">
          📥 Exporter
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/estimator'}
          className="w-full sm:w-auto"
        >
          ✨ Créer une Nouvelle Initiative
        </Button>
      </div>
    </div>
  );
}
