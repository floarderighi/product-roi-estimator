'use client';

import React from 'react';
import { CalculationResult, ScenarioType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { ContactSection } from '@/components/ui/ContactSection';
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
  const [showAdvanced, setShowAdvanced] = React.useState(false);

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

  const isPositive = scenario.totalProfit > 0;

  return (
    <div id="results-dashboard" className="max-w-4xl mx-auto p-6">
      {/* Animation de célébration */}
      {showCelebration && shouldCelebrate && <Celebration />}

      {/* 1. VERDICT EXECUTIVE - Hero Section */}
      <div className="mb-8 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl animate-fade-in">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {result.initiative.projectName || 'Analyse ROI'}
          </h1>
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${confidenceBadge.color}`}>
            Confiance {confidenceBadge.label} ({result.confidenceScore}/100)
          </span>
        </div>

        <div className="text-center py-6">
          {isPositive ? (
            <>
              <div className="text-6xl font-extrabold text-green-600 mb-2">
                ✓ Rentable
              </div>
              <p className="text-2xl text-gray-700">
                Payback en <span className="font-bold text-indigo-600">{scenario.paybackMonths} mois</span>
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl font-extrabold text-red-600 mb-2">
                ⚠ Déficitaire
              </div>
              <p className="text-2xl text-gray-700">
                Perte de <span className="font-bold text-red-600">{formatCurrency(Math.abs(scenario.totalProfit))}</span>
              </p>
            </>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-indigo-200">
          <div className="text-center">
            <div className="text-3xl mb-2">{encouragingMessage.emoji}</div>
            <div className="text-xl font-semibold text-gray-900 mb-1">{encouragingMessage.title}</div>
            <p className="text-sm text-gray-600">{encouragingMessage.subtitle}</p>
          </div>
        </div>
      </div>

      {/* 2. L'INVESTISSEMENT */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span> L&apos;Investissement
        </h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Coût de Delivery</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Investissement initial</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Coût Run Mensuel</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(result.initiative.runCost)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Récurrent chaque mois</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-sm text-gray-600 mb-1">Investissement Total</div>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency((result.initiative.deliveryCost.people * result.initiative.deliveryCost.timeMonths * result.initiative.deliveryCost.monthlyCost) + result.initiative.runCost * result.initiative.horizon)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Sur {result.initiative.horizon} mois</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. LE RETOUR ATTENDU */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📈</span> Le Retour Attendu
        </h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Profit Mensuel</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(scenario.annualProfit / 12)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Chaque mois en année 1</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Profit Annuel</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(scenario.annualProfit)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Année 1 stabilisée</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg border border-green-700 text-white">
              <div className="text-sm text-green-100 mb-1">Profit Total</div>
              <div className="text-2xl font-bold">
                {formatCurrency(scenario.totalProfit)}
              </div>
              <div className="text-xs text-green-100 mt-1">Sur {result.initiative.horizon} mois</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ROI sur 24 mois</span>
              <span className="text-2xl font-bold text-indigo-600">{scenario.roi24.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. POURQUOI ÇA MARCHE (ou pas) */}
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

      {/* 5. RENTABILITÉ & TIMELINE */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⏱️</span> Rentabilité & Timeline
        </h2>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Période de Payback</div>
              <div className="text-5xl font-bold text-indigo-600 mb-2">{scenario.paybackMonths}</div>
              <div className="text-sm text-gray-500">mois pour récupérer l&apos;investissement</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Scénario Conservateur</span>
                  <span className="font-bold text-gray-900">{result.scenarios.conservative.paybackMonths} mois</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-sm font-medium text-gray-700">Scénario Base</span>
                  <span className="font-bold text-indigo-600">{result.scenarios.base.paybackMonths} mois</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Scénario Agressif</span>
                  <span className="font-bold text-gray-900">{result.scenarios.aggressive.paybackMonths} mois</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. CONDITIONS DE RÉUSSITE */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚠️</span> Conditions de Réussite
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hypothèses Critiques */}
          {result.insights.criticalAssumptions.length > 0 && (
            <Card className="border-l-4 border-amber-500">
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                <span>📋</span> Hypothèses Critiques
              </h3>
              <ul className="space-y-2">
                {result.insights.criticalAssumptions.map((assumption, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-amber-600 flex-shrink-0">⚠</span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Risques à Surveiller */}
          {result.insights.dominantRisks.length > 0 && (
            <Card className="border-l-4 border-red-500">
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                <span>🚨</span> Risques à Surveiller
              </h3>
              <ul className="space-y-2">
                {result.insights.dominantRisks.map((risk, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-red-600 flex-shrink-0">!</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </section>

      {/* 7. RECOMMANDATIONS */}
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

      {/* 8. MÉTRIQUES CLÉS À SUIVRE */}
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

      {/* 9. VUE AVANCÉE (collapsible) */}
      <section className="mb-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-left p-4 bg-gray-100 hover:bg-gray-150 rounded-lg border border-gray-300 transition-colors flex items-center justify-between"
        >
          <span className="text-lg font-semibold text-gray-900">
            {showAdvanced ? '▼' : '▶'} Vue Avancée
          </span>
          <span className="text-sm text-gray-600">
            Cashflow cumulé & comparaison des scénarios
          </span>
        </button>

        {showAdvanced && (
          <div id="advanced-section" className="mt-4 space-y-6 animate-fade-in">
            {/* Cumulative Cashflow Chart */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">💰 Cashflow Cumulé</h3>
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
            <Card>
              <h3 className="text-xl font-semibold mb-4">Comparaison des Scénarios</h3>
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
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="mb-8">
        <ContactSection />
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t-2 border-gray-200">
        <Button onClick={copyToClipboard} className="w-full sm:w-auto">
          📋 Copier le Résumé
        </Button>
        <Button variant="outline" onClick={onShare} className="w-full sm:w-auto">
          🔗 Partager le Rapport
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
          className="w-full sm:w-auto"
          data-export-button
        >
          📥 Exporter PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/estimator'}
          className="w-full sm:w-auto"
        >
          ✨ Nouvelle Initiative
        </Button>
      </div>
    </div>
  );
}
