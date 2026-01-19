'use client';

import React, { useState } from 'react';
import { BusinessModelType, InitiativeInputs, RiskInputs, ConfidenceInputs, DataQuality, UpliftNature, RampUpPeriod } from '@/types';
import { getAllTemplates, getTemplate } from '@/lib/templates';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Slider } from '@/components/ui/Slider';
import { MarginCalculator } from '@/components/ui/MarginCalculator';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { SquadBuilder } from '@/components/ui/SquadBuilder';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { RiskSlider } from '@/components/ui/RiskSlider';
import { ConfidenceSelector } from '@/components/ui/ConfidenceSelector';
import { getExample } from '@/lib/examples';
import { getGlossaryEntry } from '@/lib/glossary';
import { getContextualHelp } from '@/lib/contextualHelp';
import { isRequiredInSimpleMode, fillDefaultValues } from '@/lib/modeConfig';

interface InitiativeFormProps {
  onComplete: (
    initiative: InitiativeInputs,
    risks: RiskInputs,
    confidence: ConfidenceInputs
  ) => void;
}

export function InitiativeForm({ onComplete }: InitiativeFormProps) {
  const [step, setStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<BusinessModelType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [templateInputs, setTemplateInputs] = useState<Record<string, number>>({});
  const [deliveryCost, setDeliveryCost] = useState({ people: 2, timeMonths: 3, monthlyCost: 8000 });
  const [runCost, setRunCost] = useState(500);
  const [rampUp, setRampUp] = useState<RampUpPeriod>('3-months');
  const [horizon, setHorizon] = useState(24);
  const [isExpertMode, setIsExpertMode] = useState(false);

  const [risks, setRisks] = useState<RiskInputs>({
    marketRisk: 3,
    technicalRisk: 3,
    timeToMarketRisk: 3,
  });

  const [confidence, setConfidence] = useState<ConfidenceInputs>({
    dataQuality: 'partial' as DataQuality,
    dependencies: '1-2',
    upliftNature: 'analogy' as UpliftNature,
  });

  const steps = ['Template', 'Métriques', 'Coûts', 'Risques', 'Confiance'];

  const templates = getAllTemplates();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleLoadExample = () => {
    if (!selectedModel) return;

    const example = getExample(selectedModel);

    // Remplir le nom du projet
    setProjectName(example.name);

    // Remplir les métriques
    setTemplateInputs(example.metrics);

    // Remplir les coûts
    setDeliveryCost({
      people: 2,
      timeMonths: 3,
      monthlyCost: example.costs.deliveryCost / 6, // Approximation
    });
    setRunCost(example.costs.runCost);

    // Remplir ramp-up et horizon
    setRampUp(example.rampUp);
    setHorizon(example.horizon);

    // Remplir les risques
    setRisks(example.risks);

    // Remplir la confiance
    setConfidence(example.confidence);
  };

  const handleSubmit = () => {
    if (!selectedModel) return;

    const template = getTemplate(selectedModel);

    // In simple mode, fill missing values with defaults
    let templateData = template.inputs.reduce((acc, input) => {
      return {
        ...acc,
        [input.id]: templateInputs[input.id] || input.defaultValue || 0,
      };
    }, {});

    // Apply intelligent defaults if in simple mode
    if (!isExpertMode) {
      templateData = fillDefaultValues(selectedModel, templateData);
    }

    // Calculate baseline, reach, uplift, unitValue, and grossMargin based on template type
    let baseline = 0;
    let reach = 0;
    let uplift = 0;
    let unitValue = 0;
    let grossMargin = Number(templateData['grossMargin']) || template.assumptionsDefaults.grossMargin;

    if (selectedModel === 'saas') {
      baseline = Number(templateData['currentChurn']);
      reach = Number(templateData['payingCustomers']);
      uplift = Number(templateData['churnReduction']);
      unitValue = Number(templateData['arpa']);
    } else if (selectedModel === 'ecommerce') {
      baseline = Number(templateData['currentConversion']);
      reach = Number(templateData['monthlyTraffic']);
      uplift = Number(templateData['conversionUplift']);
      unitValue = Number(templateData['aov']);
    } else if (selectedModel === 'b2b-sales') {
      baseline = Number(templateData['currentWinRate']);
      reach = Number(templateData['monthlyLeads']) * 12;
      uplift = Number(templateData['winRateUplift']);
      unitValue = Number(templateData['acv']);
    } else if (selectedModel === 'cost-reduction') {
      baseline = Number(templateData['currentAHT']);
      reach = Number(templateData['monthlyVolume']) * 12;
      uplift = Number(templateData['timeReduction']);
      unitValue = (Number(templateData['currentAHT']) * Number(templateData['hourlyRate'])) / 60;
    }

    const initiative: InitiativeInputs = {
      projectName: projectName || 'Untitled Initiative',
      outcomeType: 'transactions',
      businessModel: selectedModel,
      baseline,
      reach,
      uplift,
      unitValue,
      grossMargin,
      deliveryCost,
      runCost,
      rampUp,
      horizon,
      templateInputs: templateData,
    };

    onComplete(initiative, risks, confidence);
  };

  const canProceed = () => {
    if (step === 0) return selectedModel !== null;
    if (step === 1) {
      if (!selectedModel) return false;
      const template = getTemplate(selectedModel);

      // In simple mode, only require fields marked as required for simple mode
      if (!isExpertMode) {
        return template.inputs
          .filter(input => isRequiredInSimpleMode(selectedModel, input.id))
          .every(input => templateInputs[input.id] !== undefined && templateInputs[input.id] !== 0);
      }

      // In expert mode, require all fields
      return template.inputs.every(input => templateInputs[input.id] !== undefined);
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressBar steps={steps} currentStep={step} />

      {step === 0 && (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Choisissez Votre Modèle Business
          </h2>
          <p className="text-gray-600 mb-8 text-center text-lg">Sélectionnez le template qui correspond le mieux à votre initiative</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {templates.map((template) => {
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedModel(template.id)}
                  className={`relative cursor-pointer rounded-xl p-6 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${
                    selectedModel === template.id
                      ? 'bg-gradient-to-br from-primary-50 to-purple-50 ring-2 ring-primary-500 shadow-lg'
                      : 'bg-white shadow-sm hover:shadow-md'
                  } border ${
                    selectedModel === template.id ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Checkmark when selected */}
                  {selectedModel === template.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0 mt-0.5">{template.name.split(' ')[0]}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{template.name.substring(template.name.indexOf(' ') + 1)}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedModel && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">✨ Envie de tester rapidement ?</p>
                  <p className="text-xs text-gray-600">Pré-remplissez le formulaire avec un exemple réaliste</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLoadExample}
                  className="ml-4 whitespace-nowrap"
                >
                  🚀 Essayer avec un exemple
                </Button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <Input
              label="Nom du Projet (optionnel)"
              placeholder="ex: Refonte du parcours d'onboarding"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 1 && selectedModel && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">📊 Métriques Business</h2>
          <p className="text-gray-600 mb-6">Entrez vos métriques actuelles et les améliorations attendues</p>

          {/* Mode Toggle */}
          <div className="mb-6">
            <ModeToggle isExpertMode={isExpertMode} onChange={setIsExpertMode} />
          </div>

          <div className="space-y-4">
            {getTemplate(selectedModel).inputs.map((input) => {
              // In simple mode, only show required fields
              if (!isExpertMode && !isRequiredInSimpleMode(selectedModel, input.id)) {
                return null;
              }
              const contextHelp = getContextualHelp(selectedModel, input.id);
              const glossaryEntry = getGlossaryEntry(input.id);

              // Merge glossary with contextual help for tooltip
              const tooltipData = glossaryEntry ? {
                ...glossaryEntry,
                typicalRange: contextHelp?.typicalRange || glossaryEntry.defaultValue
              } : undefined;

              return (
                <div key={input.id}>
                  <Input
                    label={input.label}
                    type="number"
                    step="any"
                    unit={input.unit}
                    placeholder={contextHelp?.placeholder || input.placeholder}
                    helpText={contextHelp?.hint || input.helpText}
                    value={templateInputs[input.id] || ''}
                    onChange={(e) =>
                      setTemplateInputs({
                        ...templateInputs,
                        [input.id]: Number(e.target.value),
                      })
                    }
                    min={input.min}
                    max={input.max}
                    tooltip={tooltipData}
                  />

                  {/* Show MarginCalculator for grossMargin field */}
                  {input.id === 'grossMargin' && (
                    <MarginCalculator
                      onCalculated={(margin) =>
                        setTemplateInputs({
                          ...templateInputs,
                          grossMargin: margin,
                        })
                      }
                      defaultRevenue={Number(templateInputs['currentMRR']) || 100000}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">💰 Investissement & Coûts</h2>
          <p className="text-gray-600 mb-6">Estimez les coûts de delivery et de run</p>

          <div className="space-y-6">
            {/* Squad Builder - Replace old delivery cost inputs */}
            <SquadBuilder
              timeMonths={deliveryCost.timeMonths}
              onTimeChange={(months) =>
                setDeliveryCost({ ...deliveryCost, timeMonths: months })
              }
              onSquadChange={(people, avgCost) =>
                setDeliveryCost({ ...deliveryCost, people, monthlyCost: avgCost })
              }
            />

            <NumberStepper
              label="Coût Run Mensuel"
              emoji="💳"
              value={runCost}
              onChange={setRunCost}
              min={0}
              max={50000}
              step={100}
              unit="€/mois"
              helpText="Coûts récurrents (licences, infrastructure, support)"
              tooltip={getGlossaryEntry('runCost')}
            />

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span>Période de Ramp-up</span>
                {getGlossaryEntry('rampUp') && (
                  <div className="inline-block">
                    <button
                      type="button"
                      onClick={() => {
                        const entry = getGlossaryEntry('rampUp');
                        if (entry) {
                          alert(`${entry.term}\n\n${entry.definition}\n\n${entry.example ? '💡 ' + entry.example : ''}`);
                        }
                      }}
                      className="inline-flex items-center justify-center w-5 h-5 ml-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      aria-label="Information about Période de Ramp-up"
                    >
                      <svg
                        className="w-3 h-3"
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
                    </button>
                  </div>
                )}
              </label>
              <select
                value={rampUp}
                onChange={(e) => setRampUp(e.target.value as RampUpPeriod)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="instant">Instantané (impact immédiat)</option>
                <option value="3-months">3 mois</option>
                <option value="6-months">6 mois</option>
                <option value="12-months">12 mois</option>
              </select>
            </div>

            <NumberStepper
              label="Horizon Temporel"
              emoji="📅"
              value={horizon}
              onChange={setHorizon}
              min={6}
              max={60}
              step={6}
              unit="mois"
              helpText="Période sur laquelle mesurer l'impact"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">⚠️ Évaluation des Risques</h2>
          <p className="text-gray-600 mb-6">Évaluez les principaux risques de cette initiative sur une échelle de 1 à 5</p>

          <div className="space-y-4">
            <RiskSlider
              label="🎯 Risque Marché"
              value={risks.marketRisk}
              onChange={(value) => setRisks({ ...risks, marketRisk: value })}
              helpText="Adoption utilisateur, concurrence, changements de marché"
              tooltip={getGlossaryEntry('marketRisk')}
            />
            <RiskSlider
              label="⚙️ Risque Technique"
              value={risks.technicalRisk}
              onChange={(value) => setRisks({ ...risks, technicalRisk: value })}
              helpText="Complexité d'implémentation, dette technique, dépendances"
              tooltip={getGlossaryEntry('technicalRisk')}
            />
            <RiskSlider
              label="⏱️ Risque Time-to-Market"
              value={risks.timeToMarketRisk}
              onChange={(value) => setRisks({ ...risks, timeToMarketRisk: value })}
              helpText="Dérive du scope, retards, disponibilité des ressources"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">🎯 Inputs de Confiance</h2>
          <p className="text-gray-600 mb-6">Aidez-nous à évaluer la fiabilité de vos estimations</p>

          <div className="space-y-8">
            <ConfidenceSelector
              label="📊 Qualité des Données"
              value={confidence.dataQuality}
              onChange={(value) =>
                setConfidence({ ...confidence, dataQuality: value as DataQuality })
              }
              options={[
                {
                  value: 'measured',
                  label: 'Mesurée',
                  emoji: '✅',
                  description: 'Données réelles et vérifiées',
                  color: 'bg-green-100 border-green-400 text-green-900',
                },
                {
                  value: 'partial',
                  label: 'Partiellement mesurée',
                  emoji: '📈',
                  description: 'Mix de données réelles et estimations',
                  color: 'bg-blue-100 border-blue-400 text-blue-900',
                },
                {
                  value: 'estimated',
                  label: 'Estimée',
                  emoji: '💭',
                  description: 'Basée sur des hypothèses éclairées',
                  color: 'bg-purple-100 border-purple-400 text-purple-900',
                },
              ]}
              helpText="Quelle est la source de vos métriques ?"
            />

            <ConfidenceSelector
              label="🔗 Dépendances"
              value={confidence.dependencies}
              onChange={(value) =>
                setConfidence({
                  ...confidence,
                  dependencies: value as 'none' | '1-2' | '3+',
                })
              }
              options={[
                {
                  value: 'none',
                  label: 'Aucune',
                  emoji: '🚀',
                  description: 'Projet autonome, pas de blocage',
                  color: 'bg-green-100 border-green-400 text-green-900',
                },
                {
                  value: '1-2',
                  label: '1-2 dépendances',
                  emoji: '🤝',
                  description: 'Quelques dépendances gérables',
                  color: 'bg-yellow-100 border-yellow-400 text-yellow-900',
                },
                {
                  value: '3+',
                  label: '3+ dépendances',
                  emoji: '🕸️',
                  description: 'Plusieurs équipes impliquées',
                  color: 'bg-orange-100 border-orange-400 text-orange-900',
                },
              ]}
              helpText="Combien d'équipes ou de systèmes externes sont nécessaires ?"
            />

            <ConfidenceSelector
              label="🔬 Preuve d'Amélioration"
              value={confidence.upliftNature}
              onChange={(value) =>
                setConfidence({ ...confidence, upliftNature: value as UpliftNature })
              }
              options={[
                {
                  value: 'ab-test',
                  label: 'Test A/B',
                  emoji: '🧪',
                  description: 'Validé par test ou données historiques',
                  color: 'bg-green-100 border-green-400 text-green-900',
                },
                {
                  value: 'analogy',
                  label: 'Analogie',
                  emoji: '🔄',
                  description: 'Basé sur une feature similaire',
                  color: 'bg-blue-100 border-blue-400 text-blue-900',
                },
                {
                  value: 'intuition',
                  label: 'Intuition',
                  emoji: '💡',
                  description: 'Hypothèse basée sur l\'expérience',
                  color: 'bg-purple-100 border-purple-400 text-purple-900',
                },
              ]}
              helpText="Sur quoi repose votre estimation d'amélioration ?"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {step === steps.length - 1 ? 'Calculer le ROI' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
