'use client';

import React from 'react';
import { CalculationResult, ScenarioType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { ContactSection } from '@/components/ui/ContactSection';
import { getEncouragingMessage } from '@/lib/encouragingMessages';
import { showToast } from '@/components/ui/Toast';
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

  const formatPayback = (months: number) => {
    if (months >= 999) {
      return 'Jamais';
    }
    return `${months} mois`;
  };

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
    showToast('Résumé copié dans le presse-papier !', 'success');
  };

  const handleEdit = () => {
    // Save current result data to localStorage for editing
    const editData = {
      step: 1, // Start at metrics step to allow full review
      selectedModel: result.initiative.businessModel,
      projectName: result.initiative.projectName,
      templateInputs: result.initiative.templateInputs,
      deliveryCost: result.initiative.deliveryCost,
      squad: null,
      runCost: result.initiative.runCost,
      rampUp: result.initiative.rampUp,
      horizon: result.initiative.horizon,
      isExpertMode: false,
      costSubStep: 0,
      riskSubStep: 0,
      confidenceSubStep: 0,
      risks: result.risks,
      confidence: result.confidence,
    };
    localStorage.setItem('roi-estimator-form-data', JSON.stringify(editData));
    window.location.href = '/estimator';
  };

  const encouragingMessage = getEncouragingMessage(result);
  const [showCelebration, setShowCelebration] = React.useState(true);

  // Déterminer si on doit célébrer (ROI > 50% ou payback < 12 mois)
  const shouldCelebrate = result.scenarios.base.roi24 > 50 || result.scenarios.base.paybackMonths < 12;

  const isPositive = scenario.totalProfit > 0;

  return (
    <div id="results-dashboard" className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Animation de célébration */}
      {showCelebration && shouldCelebrate && <Celebration />}

      {/* 1. VERDICT EXECUTIVE - Hero Section */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-xl sm:rounded-2xl animate-fade-in">
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            {result.initiative.projectName || 'Analyse ROI'}
          </h1>
          <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${confidenceBadge.color}`}>
            Confiance {confidenceBadge.label} ({result.confidenceScore}/100)
          </span>
        </div>

        <div className="text-center py-4 sm:py-6">
          {isPositive ? (
            <>
              <div className="text-4xl sm:text-6xl font-extrabold text-green-600 mb-2">
                ✓ Rentable
              </div>
              <p className="text-lg sm:text-2xl text-gray-700">
                Payback en <span className="font-bold text-indigo-600">{formatPayback(scenario.paybackMonths)}</span>
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl sm:text-6xl font-extrabold text-red-600 mb-2">
                ⚠ Déficitaire
              </div>
              <p className="text-lg sm:text-2xl text-gray-700">
                Perte de <span className="font-bold text-red-600">{formatCurrency(Math.abs(scenario.totalProfit))}</span>
              </p>
            </>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-200">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2">{encouragingMessage.emoji}</div>
            <div className="text-base sm:text-xl font-semibold text-gray-900 mb-1">{encouragingMessage.title}</div>
            <p className="text-xs sm:text-sm text-gray-600">{encouragingMessage.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Quick Edit Button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={handleEdit}
          className="group flex items-center gap-3 px-6 py-3 bg-white border-2 border-indigo-300 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Modifier les paramètres</span>
        </button>
      </div>

      {/* 2. L'INVESTISSEMENT */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span> L&apos;Investissement
        </h2>
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Coût de Delivery</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Investissement initial</div>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Coût Run Mensuel</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(result.initiative.runCost)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Récurrent chaque mois</div>
            </div>
            <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Investissement Total</div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                {formatCurrency((result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost) + result.initiative.runCost * result.initiative.horizon)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Sur {result.initiative.horizon} mois</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. LE RETOUR ATTENDU */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📈</span> Le Retour Attendu
        </h2>
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 bg-gradient-to-br rounded-lg border ${
              isPositive
                ? 'from-green-50 to-emerald-50 border-green-200'
                : 'from-red-50 to-rose-50 border-red-200'
            }`}>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Profit Mensuel</div>
              <div className={`text-xl sm:text-2xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(scenario.annualProfit / 12)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Chaque mois en année 1</div>
            </div>
            <div className={`p-3 sm:p-4 bg-gradient-to-br rounded-lg border ${
              isPositive
                ? 'from-green-50 to-emerald-50 border-green-200'
                : 'from-red-50 to-rose-50 border-red-200'
            }`}>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Profit Annuel</div>
              <div className={`text-xl sm:text-2xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(scenario.annualProfit)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Année 1 stabilisée</div>
            </div>
            <div className={`p-3 sm:p-4 bg-gradient-to-br rounded-lg border text-white ${
              isPositive
                ? 'from-green-600 to-emerald-600 border-green-700'
                : 'from-red-600 to-rose-600 border-red-700'
            }`}>
              <div className={`text-xs sm:text-sm mb-1 ${isPositive ? 'text-green-100' : 'text-red-100'}`}>Profit Total</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatCurrency(scenario.totalProfit)}
              </div>
              <div className={`text-xs mt-1 ${isPositive ? 'text-green-100' : 'text-red-100'}`}>Sur {result.initiative.horizon} mois</div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">ROI sur 24 mois</span>
              <span className={`text-xl sm:text-2xl font-bold ${isPositive ? 'text-indigo-600' : 'text-red-600'}`}>{scenario.roi24.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. CASHFLOW CUMULÉ */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span> Cashflow Cumulé
        </h2>
        <Card>
          <div className="w-full" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => new Intl.NumberFormat('fr-FR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 0
                  }).format(value)}
                  stroke="#64748b"
                  width={50}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Mois ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="cashflow"
                  stroke="url(#colorCashflow)"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 3, strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                  name="Cashflow Cumulé"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* 5. COMPARAISON DES SCÉNARIOS */}
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Comparaison des Scénarios
        </h2>
        <Card>
          {/* Desktop: Table view */}
          <div className="hidden sm:block overflow-x-auto">
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
          {/* Mobile: Card view */}
          <div className="sm:hidden space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Conservateur</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Profit/an</div>
                  <div className="text-sm font-semibold">{formatCurrency(result.scenarios.conservative.annualProfit)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Payback</div>
                  <div className="text-sm font-semibold">{result.scenarios.conservative.paybackMonths}m</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI 24m</div>
                  <div className="text-sm font-semibold">{result.scenarios.conservative.roi24.toFixed(0)}%</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg border-2 border-primary-200">
              <div className="text-xs font-semibold text-primary-600 uppercase mb-2">Base (recommandé)</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Profit/an</div>
                  <div className="text-sm font-bold text-primary-700">{formatCurrency(result.scenarios.base.annualProfit)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Payback</div>
                  <div className="text-sm font-bold text-primary-700">{result.scenarios.base.paybackMonths}m</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI 24m</div>
                  <div className="text-sm font-bold text-primary-700">{result.scenarios.base.roi24.toFixed(0)}%</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Agressif</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Profit/an</div>
                  <div className="text-sm font-semibold">{formatCurrency(result.scenarios.aggressive.annualProfit)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Payback</div>
                  <div className="text-sm font-semibold">{result.scenarios.aggressive.paybackMonths}m</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ROI 24m</div>
                  <div className="text-sm font-semibold">{result.scenarios.aggressive.roi24.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. POURQUOI ÇA MARCHE (ou pas) */}
      {result.insights.topDrivers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎯</span> Pourquoi ça {isPositive ? 'fonctionne' : 'ne fonctionne pas'}
          </h2>
          <Card className="border-l-4 border-indigo-500">
            <ul className="space-y-3">
              {result.insights.topDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <span className="text-gray-800 font-medium">{driver}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* 7. RENTABILITÉ & TIMELINE */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⏱️</span> Rentabilité & Timeline
        </h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Période de Payback</div>
              {scenario.paybackMonths >= 999 ? (
                <>
                  <div className="text-5xl font-bold text-red-600 mb-2">∞</div>
                  <div className="text-sm text-gray-500">Projet non rentable sur l&apos;horizon</div>
                </>
              ) : (
                <>
                  <div className="text-5xl font-bold text-indigo-600 mb-2">{scenario.paybackMonths}</div>
                  <div className="text-sm text-gray-500">mois pour récupérer l&apos;investissement</div>
                </>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Scénario Conservateur</span>
                  <span className={`font-bold ${result.scenarios.conservative.paybackMonths >= 999 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatPayback(result.scenarios.conservative.paybackMonths)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-sm font-medium text-gray-700">Scénario Base</span>
                  <span className={`font-bold ${result.scenarios.base.paybackMonths >= 999 ? 'text-red-600' : 'text-indigo-600'}`}>
                    {formatPayback(result.scenarios.base.paybackMonths)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Scénario Agressif</span>
                  <span className={`font-bold ${result.scenarios.aggressive.paybackMonths >= 999 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatPayback(result.scenarios.aggressive.paybackMonths)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 8. RECOMMANDATIONS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💡</span> Recommandations
        </h2>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl flex-shrink-0">1️⃣</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Validez vos hypothèses clés</div>
                <div className="text-sm text-gray-600">Testez rapidement les hypothèses critiques identifiées ci-dessus avant d&apos;investir massivement.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl flex-shrink-0">2️⃣</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Mettez en place des indicateurs d&apos;alerte</div>
                <div className="text-sm text-gray-600">Suivez les métriques clés dès le lancement pour détecter rapidement les écarts.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl flex-shrink-0">3️⃣</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Prévoyez un plan B</div>
                <div className="text-sm text-gray-600">Définissez des critères de go/no-go et un plan d&apos;action en cas de scénario défavorable.</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 9. MÉTRIQUES CLÉS À SUIVRE */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Top 3 Métriques à Suivre
        </h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-gray-900 mb-1">Taux d&apos;adoption</div>
              <div className="text-xs text-gray-600">Surveillez l&apos;adoption réelle vs prévisions</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold text-gray-900 mb-1">Profit mensuel</div>
              <div className="text-xs text-gray-600">Comparez au profit attendu de {formatCurrency(scenario.annualProfit / 12)}/mois</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-gray-900 mb-1">Time-to-value</div>
              <div className="text-xs text-gray-600">Mesurez le temps réel de montée en charge</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 10. MÉTHODOLOGIE DE CALCUL */}
      <section className="mb-8">
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl">🔬</span>
              <h2 className="text-2xl font-bold text-gray-900 flex-1">Méthodologie de Calcul</h2>
              <svg className="w-6 h-6 text-purple-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <Card className="border-l-4 border-purple-500 mt-2">
            <div className="space-y-6">

            {/* Introduction */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                Cette section détaille la méthode de calcul utilisée pour établir le ROI de votre initiative.
                Tous les calculs sont basés sur des formules financières standard et adaptées au contexte produit/tech.
              </p>
            </div>

            {/* 1. Calcul du Profit Annuel */}
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-purple-600">1.</span> Calcul du Profit Annuel
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-purple-100">
                  <p className="font-mono text-sm text-gray-800 mb-2">
                    Profit Annuel = (Gain Annuel × Marge Brute) - Coût de Run Annuel
                  </p>
                  <p className="text-xs text-gray-600">
                    Le gain annuel est calculé en fonction du modèle d&apos;affaires (amélioration de conversion, nouveaux clients, etc.).
                    La marge brute est appliquée pour obtenir le profit net avant coûts de run.
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Exemple pour votre projet :</span>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Gain annuel estimé : {formatCurrency(
                      Number(result.initiative.templateInputs.reach || 0) *
                      Number(result.initiative.templateInputs.value || 0) *
                      (Number(result.initiative.templateInputs.uplift || 0) / 100)
                    )}</li>
                    <li>Marge brute ({result.initiative.templateInputs.grossMargin}%) : {formatCurrency(
                      Number(result.initiative.templateInputs.reach || 0) *
                      Number(result.initiative.templateInputs.value || 0) *
                      (Number(result.initiative.templateInputs.uplift || 0) / 100) *
                      (Number(result.initiative.templateInputs.grossMargin || 0) / 100)
                    )}</li>
                    <li>Coût de run annuel : {formatCurrency(result.initiative.runCost * 12)}</li>
                    <li className="font-semibold text-purple-700">= Profit annuel : {formatCurrency(scenario.annualProfit)}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Calcul du ROI sur 24 mois */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-blue-600">2.</span> Calcul du ROI sur 24 mois
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-blue-100">
                  <p className="font-mono text-sm text-gray-800 mb-2">
                    ROI 24 mois = ((Profit sur 24 mois - Investissement Total) / Investissement Total) × 100
                  </p>
                  <p className="text-xs text-gray-600">
                    Le ROI mesure le retour sur investissement en pourcentage. Un ROI de 100% signifie que vous doublez votre investissement.
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Calcul pour votre projet :</span>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Investissement initial (delivery) : {formatCurrency(result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost)}</li>
                    <li>Coût de run sur 24 mois : {formatCurrency(result.initiative.runCost * 24)}</li>
                    <li>Investissement total : {formatCurrency((result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost) + (result.initiative.runCost * 24))}</li>
                    <li>Profit sur 24 mois : {formatCurrency(scenario.annualProfit * 2)}</li>
                    <li className="font-semibold text-blue-700">= ROI 24 mois : {scenario.roi24.toFixed(1)}%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Calcul du Payback */}
            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-600">3.</span> Calcul de la Période de Payback
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-green-100">
                  <p className="font-mono text-sm text-gray-800 mb-2">
                    Payback = Nombre de mois pour que le cashflow cumulé devienne positif
                  </p>
                  <p className="text-xs text-gray-600">
                    Le payback indique combien de temps il faut pour récupérer l&apos;investissement initial.
                    Il prend en compte la montée en charge progressive (ramp-up).
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Pour votre projet :</span>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Période de ramp-up : {result.initiative.rampUp} mois (montée en charge progressive)</li>
                    <li>Profit mensuel en régime stabilisé : {formatCurrency(scenario.annualProfit / 12)}</li>
                    {scenario.paybackMonths >= 999 ? (
                      <li className="font-semibold text-red-700">Le projet ne devient pas rentable sur l&apos;horizon de {result.initiative.horizon} mois</li>
                    ) : (
                      <li className="font-semibold text-green-700">= Payback : {scenario.paybackMonths} mois</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Les 3 Scénarios */}
            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-indigo-600">4.</span> Les 3 Scénarios (Conservateur, Base, Agressif)
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Pour gérer l&apos;incertitude, nous calculons 3 scénarios en appliquant des multiplicateurs sur les hypothèses clés :
                </p>
                <div className="bg-white p-4 rounded border border-indigo-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-indigo-200">
                        <th className="text-left py-2">Scénario</th>
                        <th className="text-center py-2">Multiplicateur Gain</th>
                        <th className="text-center py-2">Multiplicateur Coût</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-indigo-100">
                        <td className="py-2 font-medium">Conservateur</td>
                        <td className="text-center py-2">×0.7</td>
                        <td className="text-center py-2">×1.2</td>
                      </tr>
                      <tr className="border-b border-indigo-100">
                        <td className="py-2 font-medium">Base</td>
                        <td className="text-center py-2">×1.0</td>
                        <td className="text-center py-2">×1.0</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Agressif</td>
                        <td className="text-center py-2">×1.3</td>
                        <td className="text-center py-2">×0.8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Le scénario conservateur suppose que les gains seront 30% inférieurs et les coûts 20% supérieurs aux estimations.
                  Le scénario agressif suppose l&apos;inverse. Cela permet d&apos;évaluer la robustesse de votre business case.
                </p>
              </div>
            </div>

            {/* 5. Calcul du Score de Confiance */}
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-amber-600">5.</span> Calcul du Score de Confiance
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded border border-amber-100">
                  <p className="font-mono text-sm text-gray-800 mb-2">
                    Score de Confiance = 100 - Pénalités cumulées
                  </p>
                  <p className="text-xs text-gray-600">
                    Le score de confiance part de 100 points et est réduit selon la qualité des données d&apos;entrée et le niveau d&apos;incertitude.
                  </p>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-2">Les pénalités appliquées :</p>
                  <div className="bg-white p-3 rounded border border-amber-100 space-y-2">
                    <div>
                      <p className="font-medium">1. Qualité des données :</p>
                      <ul className="list-disc list-inside ml-3 text-xs space-y-1 mt-1">
                        <li>Données mesurées (A/B test, analytics) : -0 points</li>
                        <li>Données partielles (mix de mesures et estimations) : -20 points</li>
                        <li>Données estimées (hypothèses) : -40 points</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">2. Dépendances externes :</p>
                      <ul className="list-disc list-inside ml-3 text-xs space-y-1 mt-1">
                        <li>Aucune dépendance : -0 points</li>
                        <li>1-2 dépendances (équipes, systèmes) : -15 points</li>
                        <li>3+ dépendances : -30 points</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">3. Nature de l&apos;amélioration attendue :</p>
                      <ul className="list-disc list-inside ml-3 text-xs space-y-1 mt-1">
                        <li>Prouvée par A/B test : -0 points</li>
                        <li>Par analogie (cas similaire) : -15 points</li>
                        <li>Par intuition/hypothèse : -30 points</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-amber-100 rounded border border-amber-200">
                    <p className="font-semibold text-amber-900">Votre score : {result.confidenceScore}/100</p>
                    <p className="text-xs text-amber-800 mt-1">
                      {result.confidenceScore >= 70 && "Score élevé - Données robustes pour une prise de décision"}
                      {result.confidenceScore >= 40 && result.confidenceScore < 70 && "Score moyen - Quelques hypothèses à valider avant le go"}
                      {result.confidenceScore < 40 && "Score faible - Recommandation : valider les hypothèses clés avant de se lancer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Impact des Risques */}
            <div className="bg-rose-50 p-5 rounded-lg border border-rose-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-rose-600">6.</span> Impact des Risques sur l&apos;Interprétation
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Les risques (marché, technique, time-to-market) n&apos;ajustent PAS directement les calculs financiers du scénario de base,
                  mais influencent fortement l&apos;interprétation :
                </p>
                <div className="bg-white p-4 rounded border border-rose-100 text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Risques élevés</strong> (7-10/10) : indiquent une forte probabilité que le scénario conservateur se réalise plutôt que le scénario base</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Risques moyens</strong> (4-6/10) : le scénario base reste le plus probable avec une marge d&apos;erreur raisonnable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Risques faibles</strong> (1-3/10) : le scénario agressif devient envisageable</span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-gray-600">
                  Ces indicateurs qualitatifs vous aident à décider si vous devez affiner vos hypothèses ou lancer une phase de validation avant le go/no-go.
                </p>
              </div>
            </div>

            {/* Note finale */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <p className="text-sm text-gray-700">
                <strong>Note :</strong> Cette méthodologie suit les standards de l&apos;analyse financière de projets tech/produit.
                Les formules sont volontairement simples pour favoriser la transparence et la compréhension par tous les stakeholders.
              </p>
            </div>

            </div>
          </Card>
        </details>
      </section>

      {/* Contact Section */}
      <section className="mb-8">
        <ContactSection />
      </section>

      {/* Spacer pour éviter que le contenu soit caché par la barre fixe */}
      <div className="h-20"></div>

      {/* Actions - Barre fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-2 border-gray-200 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
            <Button onClick={copyToClipboard} size="sm" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">📋 Copier le Résumé</span>
              <span className="sm:hidden">📋 Copier</span>
            </Button>
            <Button variant="outline" onClick={onShare} size="sm" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">🔗 Partager le Rapport</span>
              <span className="sm:hidden">🔗 Partager</span>
            </Button>
            <Button
              variant="outline"
              onClick={onExport}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3"
              data-export-button
            >
              <span className="hidden sm:inline">📊 Exporter PowerPoint</span>
              <span className="sm:hidden">📊 Export</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
            >
              ✏️ Modifier les Paramètres
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/estimator'}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
            >
              ✨ Nouvelle Initiative
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
