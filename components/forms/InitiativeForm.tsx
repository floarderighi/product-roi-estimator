'use client';

import React, { useState, useEffect } from 'react';
import { BusinessModelType, InitiativeInputs, RiskInputs, ConfidenceInputs, DataQuality, UpliftNature, RampUpPeriod } from '@/types';
import { getAllTemplates, getTemplate } from '@/lib/templates';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Slider } from '@/components/ui/Slider';
import { MarginCalculator } from '@/components/ui/MarginCalculator';
import { HourlyRateCalculator } from '@/components/ui/HourlyRateCalculator';
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

const FORM_STORAGE_KEY = 'roi-estimator-form-data';

export function InitiativeForm({ onComplete }: InitiativeFormProps) {
  const [step, setStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<BusinessModelType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [templateInputs, setTemplateInputs] = useState<Record<string, number>>({});
  const [deliveryCost, setDeliveryCost] = useState({ people: 2, timeMonths: 3, monthlyCost: 8000 });
  const [squad, setSquad] = useState<Array<{
    id: string;
    role: 'dev' | 'pm' | 'designer' | 'qa';
    level: 'junior' | 'confirmed' | 'senior';
    monthlyCost: number;
  }> | null>(null);
  const [runCost, setRunCost] = useState(500);
  const [rampUp, setRampUp] = useState<RampUpPeriod>('3-months');
  const [horizon, setHorizon] = useState(24);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [costSubStep, setCostSubStep] = useState(0); // For guided cost assessment (0: squad, 1: run costs)
  const [riskSubStep, setRiskSubStep] = useState(0); // For guided risk assessment
  const [confidenceSubStep, setConfidenceSubStep] = useState(0); // For guided confidence assessment
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExampleActive, setIsExampleActive] = useState(false);

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

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setStep(parsed.step || 0);
          setSelectedModel(parsed.selectedModel || null);
          setProjectName(parsed.projectName || '');
          setTemplateInputs(parsed.templateInputs || {});
          setDeliveryCost(parsed.deliveryCost || { people: 2, timeMonths: 3, monthlyCost: 8000 });
          setSquad(parsed.squad || null);
          setRunCost(parsed.runCost || 500);
          setRampUp(parsed.rampUp || '3-months');
          setHorizon(parsed.horizon || 24);
          setIsExpertMode(parsed.isExpertMode || false);
          setCostSubStep(parsed.costSubStep || 0);
          setRiskSubStep(parsed.riskSubStep || 0);
          setConfidenceSubStep(parsed.confidenceSubStep || 0);
          setRisks(parsed.risks || { marketRisk: 3, technicalRisk: 3, timeToMarketRisk: 3 });
          setConfidence(parsed.confidence || { dataQuality: 'partial', dependencies: '1-2', upliftNature: 'analogy' });
          setIsExampleActive(parsed.isExampleActive || false);
        } catch (e) {
          console.error('Failed to load saved form data:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      const formData = {
        step,
        selectedModel,
        projectName,
        templateInputs,
        deliveryCost,
        squad,
        runCost,
        rampUp,
        horizon,
        isExpertMode,
        costSubStep,
        riskSubStep,
        confidenceSubStep,
        risks,
        confidence,
        isExampleActive,
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [isLoaded, step, selectedModel, projectName, templateInputs, deliveryCost, squad, runCost, rampUp, horizon, isExpertMode, costSubStep, riskSubStep, confidenceSubStep, risks, confidence, isExampleActive]);

  const steps = ['Template', 'Métriques', 'Coûts', 'Risques', 'Confiance'];

  const templates = getAllTemplates();

  const handleNext = () => {
    // Special handling for cost step (step 2)
    if (step === 2 && costSubStep < 1) {
      setCostSubStep(costSubStep + 1);
      return;
    }

    // Special handling for risk step (step 3)
    if (step === 3 && riskSubStep < 2) {
      setRiskSubStep(riskSubStep + 1);
      return;
    }

    // Special handling for confidence step (step 4)
    if (step === 4 && confidenceSubStep < 2) {
      setConfidenceSubStep(confidenceSubStep + 1);
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
      setCostSubStep(0); // Reset substeps
      setRiskSubStep(0);
      setConfidenceSubStep(0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    // Special handling for cost step (step 2)
    if (step === 2 && costSubStep > 0) {
      setCostSubStep(costSubStep - 1);
      return;
    }

    // Special handling for risk step (step 3)
    if (step === 3 && riskSubStep > 0) {
      setRiskSubStep(riskSubStep - 1);
      return;
    }

    // Special handling for confidence step (step 4)
    if (step === 4 && confidenceSubStep > 0) {
      setConfidenceSubStep(confidenceSubStep - 1);
      return;
    }

    if (step > 0) {
      setStep(step - 1);
      // Set substep to last question when going back
      if (step - 1 === 2) {
        setCostSubStep(1);
      } else if (step - 1 === 3) {
        setRiskSubStep(2);
      } else if (step - 1 === 4) {
        setConfidenceSubStep(2);
      }
    }
  };

  const handleToggleExample = () => {
    if (!selectedModel) return;

    if (isExampleActive) {
      // Désactiver l'exemple : vider toutes les valeurs
      setProjectName('');
      setTemplateInputs({});
      setDeliveryCost({ people: 2, timeMonths: 3, monthlyCost: 8000 });
      setSquad(null);
      setRunCost(500);
      setRampUp('3-months');
      setHorizon(24);
      setRisks({ marketRisk: 3, technicalRisk: 3, timeToMarketRisk: 3 });
      setConfidence({ dataQuality: 'partial', dependencies: '1-2', upliftNature: 'analogy' });
      setIsExampleActive(false);
    } else {
      // Activer l'exemple : remplir avec les valeurs
      const example = getExample(selectedModel);

      setProjectName(example.name);
      setTemplateInputs(example.metrics);
      setDeliveryCost({
        people: 2,
        timeMonths: 3,
        monthlyCost: example.costs.deliveryCost / 6,
      });
      setRunCost(example.costs.runCost);
      setRampUp(example.rampUp);
      setHorizon(example.horizon);
      setRisks(example.risks);
      setConfidence(example.confidence);
      setIsExampleActive(true);

      // Scroll vers le champ "Nom du Projet"
      setTimeout(() => {
        const projectNameInput = document.querySelector('input[placeholder*="Refonte"]');
        if (projectNameInput) {
          projectNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleSubmit = () => {
    if (!selectedModel) return;

    const template = getTemplate(selectedModel);

    // In simple mode, fill missing values with defaults
    let templateData: Record<string, any> = template.inputs.reduce((acc, input) => {
      return {
        ...acc,
        [input.id]: templateInputs[input.id] || input.defaultValue || 0,
      };
    }, {} as Record<string, any>);

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

    // Clear saved form data after successful submission
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }

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
    <div className="max-w-4xl mx-auto p-4 pb-6">
      <ProgressBar steps={steps} currentStep={step} />

      {step === 0 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Choisissez Votre Modèle Business
          </h2>
          <p className="text-gray-600 mb-5 text-center">Sélectionnez le template qui correspond le mieux à votre initiative</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {templates.map((template) => {
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedModel(template.id)}
                  className={`relative cursor-pointer rounded-xl p-4 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${
                    selectedModel === template.id
                      ? 'bg-gradient-to-br from-primary-50 to-purple-50 ring-2 ring-primary-500 shadow-lg'
                      : 'bg-white shadow-sm hover:shadow-md'
                  } border ${
                    selectedModel === template.id ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Checkmark when selected */}
                  {selectedModel === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0 mt-0.5">{template.name.split(' ')[0]}</div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1 text-gray-900">{template.name.substring(template.name.indexOf(' ') + 1)}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedModel && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">✨ Envie de tester rapidement ?</p>
                  <p className="text-xs text-gray-600">Pré-remplissez le formulaire avec un exemple réaliste</p>
                </div>
                <Button
                  variant={isExampleActive ? "primary" : "secondary"}
                  size="sm"
                  onClick={handleToggleExample}
                  className={`whitespace-nowrap flex-shrink-0 transition-all w-full sm:w-auto ${
                    isExampleActive
                      ? 'shadow-md ring-2 ring-primary-300'
                      : ''
                  }`}
                >
                  {isExampleActive ? '✓ Exemple actif' : '🚀 Essayer avec un exemple'}
                </Button>
              </div>
            </div>
          )}

          <div className="mb-4">
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
          <h2 className="text-xl font-bold mb-1.5">📊 Métriques Business</h2>
          <p className="text-gray-600 mb-4 text-sm">Entrez vos métriques actuelles et les améliorations attendues</p>

          {/* Mode Toggle */}
          <div className="mb-4">
            <ModeToggle isExpertMode={isExpertMode} onChange={setIsExpertMode} />
          </div>

          <div className="space-y-3">
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
                      defaultRevenue={
                        Number(templateInputs['currentMRR']) ||
                        (selectedModel === 'saas' && templateInputs['payingCustomers'] && templateInputs['arpa']
                          ? Number(templateInputs['payingCustomers']) * Number(templateInputs['arpa'])
                          : 100000)
                      }
                    />
                  )}

                  {/* Show HourlyRateCalculator for hourlyRate field */}
                  {input.id === 'hourlyRate' && (
                    <HourlyRateCalculator
                      onCalculated={(rate) =>
                        setTemplateInputs({
                          ...templateInputs,
                          hourlyRate: rate,
                        })
                      }
                      defaultAnnualSalary={35000}
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
          {/* Progress indicator for cost questions */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === costSubStep
                    ? 'w-8 bg-primary-600'
                    : index < costSubStep
                    ? 'w-1.5 bg-primary-400'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Sub-step 1: Squad and Delivery Cost */}
          {costSubStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center">
                👥 Composition de l'équipe
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Définissez votre équipe projet et la durée du développement
              </p>

              <SquadBuilder
                timeMonths={deliveryCost.timeMonths}
                onTimeChange={(months) =>
                  setDeliveryCost({ ...deliveryCost, timeMonths: months })
                }
                onSquadChange={(people, avgCost) =>
                  setDeliveryCost({ ...deliveryCost, people, monthlyCost: avgCost })
                }
                initialSquad={squad || undefined}
                onSquadUpdate={(updatedSquad) => setSquad(updatedSquad)}
              />
            </div>
          )}

          {/* Sub-step 2: Run Costs and Timeline */}
          {costSubStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center">
                💳 Coûts récurrents & Horizon
              </h2>
              <p className="text-gray-600 mb-6 text-center text-lg">
                Estimez les coûts mensuels de run et l'horizon temporel
              </p>

              <div className="space-y-6 max-w-2xl mx-auto">
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

                <NumberStepper
                  label="Période de Ramp-up"
                  emoji="📈"
                  value={rampUp === 'instant' ? 0 : rampUp === '3-months' ? 3 : rampUp === '6-months' ? 6 : 12}
                  onChange={(value) => {
                    if (value === 0) setRampUp('instant');
                    else if (value === 3) setRampUp('3-months');
                    else if (value === 6) setRampUp('6-months');
                    else setRampUp('12-months');
                  }}
                  min={0}
                  max={12}
                  step={3}
                  unit="mois"
                  helpText="Temps nécessaire pour atteindre le plein impact"
                  tooltip={getGlossaryEntry('rampUp')}
                />

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
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          {/* Progress indicator for risk questions */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === riskSubStep
                    ? 'w-8 bg-primary-600'
                    : index < riskSubStep
                    ? 'w-2 bg-primary-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Question 1: Market Risk */}
          {riskSubStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                🎯 Quel est le risque que les utilisateurs n'adoptent pas la fonctionnalité ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Considérez l'appétence des utilisateurs, la concurrence et le timing
              </p>

              <RiskSlider
                label="Risque Marché"
                value={risks.marketRisk}
                onChange={(value) => setRisks({ ...risks, marketRisk: value })}
                helpText="1 = Adoption certaine • 5 = Adoption très incertaine"
                tooltip={getGlossaryEntry('marketRisk')}
              />
            </div>
          )}

          {/* Question 2: Technical Risk */}
          {riskSubStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                ⚙️ Quelle est la complexité technique ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Difficulté d'implémentation, dette technique, dépendances
              </p>

              <RiskSlider
                label="Risque Technique"
                value={risks.technicalRisk}
                onChange={(value) => setRisks({ ...risks, technicalRisk: value })}
                helpText="1 = Très simple • 5 = Très complexe"
                tooltip={getGlossaryEntry('technicalRisk')}
              />
            </div>
          )}

          {/* Question 3: Time-to-Market Risk */}
          {riskSubStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                ⏱️ Quel est le risque de retard ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Dérive du scope, disponibilité des ressources, blocages
              </p>

              <RiskSlider
                label="Risque Time-to-Market"
                value={risks.timeToMarketRisk}
                onChange={(value) => setRisks({ ...risks, timeToMarketRisk: value })}
                helpText="1 = Très prévisible • 5 = Très incertain"
                tooltip={getGlossaryEntry('timeToMarketRisk')}
              />
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in">
          {/* Progress indicator for confidence questions */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === confidenceSubStep
                    ? 'w-8 bg-primary-600'
                    : index < confidenceSubStep
                    ? 'w-2 bg-primary-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Question 1: Data Quality */}
          {confidenceSubStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                📊 Quelle est la qualité de vos données ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Vos métriques sont-elles mesurées ou estimées ?
              </p>

              <ConfidenceSelector
                label="Qualité des Données"
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
                    color: 'bg-purple-100 border-purple-300 text-purple-900',
                  },
                  {
                    value: 'partial',
                    label: 'Partiellement mesurée',
                    emoji: '📈',
                    description: 'Mix de données réelles et estimations',
                    color: 'bg-purple-200 border-purple-400 text-purple-900',
                  },
                  {
                    value: 'estimated',
                    label: 'Estimée',
                    emoji: '💭',
                    description: 'Basée sur des hypothèses éclairées',
                    color: 'bg-purple-300 border-purple-500 text-purple-950',
                  },
                ]}
                helpText=""
              />
            </div>
          )}

          {/* Question 2: Dependencies */}
          {confidenceSubStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                🔗 Combien de dépendances avez-vous ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Équipes, systèmes externes ou projets nécessaires
              </p>

              <ConfidenceSelector
                label="Dépendances"
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
                    color: 'bg-purple-100 border-purple-300 text-purple-900',
                  },
                  {
                    value: '1-2',
                    label: '1-2 dépendances',
                    emoji: '🤝',
                    description: 'Quelques dépendances gérables',
                    color: 'bg-purple-200 border-purple-400 text-purple-900',
                  },
                  {
                    value: '3+',
                    label: '3+ dépendances',
                    emoji: '🕸️',
                    description: 'Plusieurs équipes impliquées',
                    color: 'bg-purple-300 border-purple-500 text-purple-950',
                  },
                ]}
                helpText=""
              />
            </div>
          )}

          {/* Question 3: Uplift Nature */}
          {confidenceSubStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">
                🔬 Sur quoi repose votre estimation d'amélioration ?
              </h2>
              <p className="text-gray-600 mb-4 text-center text-sm">
                Avez-vous des preuves ou est-ce une hypothèse ?
              </p>

              <ConfidenceSelector
                label="Preuve d'Amélioration"
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
                    color: 'bg-purple-100 border-purple-300 text-purple-900',
                  },
                  {
                    value: 'analogy',
                    label: 'Analogie',
                    emoji: '🔄',
                    description: 'Basé sur une feature similaire',
                    color: 'bg-purple-200 border-purple-400 text-purple-900',
                  },
                  {
                    value: 'intuition',
                    label: 'Intuition',
                    emoji: '💡',
                    description: 'Hypothèse basée sur l\'expérience',
                    color: 'bg-purple-300 border-purple-500 text-purple-950',
                  },
                ]}
                helpText=""
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {(step === 2 && costSubStep < 1) || (step === 3 && riskSubStep < 2) || (step === 4 && confidenceSubStep < 2)
            ? 'Suivant'
            : step === steps.length - 1
            ? 'Calculer le ROI'
            : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
