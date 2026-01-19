// Core Types for ROI Estimator

export type BusinessModelType = 'saas' | 'ecommerce' | 'b2b-sales' | 'cost-reduction';

export type OutcomeType = 'productivity' | 'attention' | 'transactions' | 'satisfaction';

export type RampUpPeriod = 'instant' | '3-months' | '6-months' | '12-months';

export type ScenarioType = 'conservative' | 'base' | 'aggressive';

export type DataQuality = 'measured' | 'partial' | 'estimated';

export type UpliftNature = 'ab-test' | 'analogy' | 'intuition';

export interface InputField {
  id: string;
  label: string;
  unit: string;
  type: 'number' | 'percentage' | 'currency' | 'select';
  defaultValue?: number | string;
  min?: number;
  max?: number;
  helpText?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface TemplateConfig {
  id: BusinessModelType;
  name: string;
  description: string;
  inputs: InputField[];
  assumptionsDefaults: {
    grossMargin: number;
    hourlyRate: number;
    horizon: number; // months
  };
  formulas: {
    calculateDeltaRevenue: string;
    calculateDeltaCost: string;
    calculateDeltaRisk: string;
  };
  scenarioRules: {
    conservative: {
      upliftMultiplier: number;
      rampUpDelay: number;
      riskPenalty: number;
    };
    aggressive: {
      upliftMultiplier: number;
      rampUpSpeed: number;
      riskBonus: number;
    };
  };
}

export interface InitiativeInputs {
  projectName?: string;
  outcomeType: OutcomeType;
  businessModel: BusinessModelType;

  // Common inputs
  baseline: number;
  reach: number;
  uplift: number;
  unitValue: number;
  grossMargin: number;

  // Cost inputs
  deliveryCost: {
    people: number;
    timeMonths: number;
    monthlyCost: number;
  };
  runCost: number; // monthly

  // Timing
  rampUp: RampUpPeriod;
  horizon: number; // months

  // Template-specific inputs
  templateInputs: Record<string, number | string>;
}

export interface RiskInputs {
  marketRisk: number; // 1-5
  technicalRisk: number; // 1-5
  timeToMarketRisk: number; // 1-5
}

export interface ConfidenceInputs {
  dataQuality: DataQuality;
  dependencies: 'none' | '1-2' | '3+';
  upliftNature: UpliftNature;
}

export interface ScenarioResult {
  scenario: ScenarioType;
  annualProfit: number;
  totalProfit: number;
  contributionMargin: number;
  roi12: number;
  roi24: number;
  roi36: number;
  paybackMonths: number;
  cumulativeCashflow: {
    month: number;
    value: number;
  }[];
}

export interface CalculationResult {
  initiative: InitiativeInputs;
  risks: RiskInputs;
  confidence: ConfidenceInputs;
  confidenceScore: number;
  scenarios: {
    conservative: ScenarioResult;
    base: ScenarioResult;
    aggressive: ScenarioResult;
  };
  insights: {
    topDrivers: string[];
    criticalAssumptions: string[];
    dominantRisks: string[];
  };
  createdAt: Date;
  reportId: string;
}

export interface Portfolio {
  id: string;
  name: string;
  initiatives: CalculationResult[];
  createdAt: Date;
}
