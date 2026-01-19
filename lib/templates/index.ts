import { TemplateConfig, BusinessModelType } from '@/types';
import { TEMPLATES_FR } from './fr';

/**
 * Template definitions for the 4 business models
 * Based on PRD section 10
 * Now using French version by default
 */

export const TEMPLATES: Record<BusinessModelType, TemplateConfig> = TEMPLATES_FR;

export const TEMPLATES_EN: Record<BusinessModelType, TemplateConfig> = {
  'saas': {
    id: 'saas',
    name: 'SaaS (MRR/ARR)',
    description: 'For SaaS products focused on reducing churn or improving retention',
    inputs: [
      {
        id: 'payingCustomers',
        label: 'Current paying customers',
        unit: 'customers',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        helpText: 'Total number of active paying customers',
        placeholder: '1000',
      },
      {
        id: 'currentMRR',
        label: 'Current MRR',
        unit: 'EUR',
        type: 'currency',
        defaultValue: 50000,
        min: 0,
        helpText: 'Monthly recurring revenue',
        placeholder: '50000',
      },
      {
        id: 'currentChurn',
        label: 'Current monthly churn',
        unit: '%',
        type: 'percentage',
        defaultValue: 5,
        min: 0,
        max: 100,
        helpText: 'Percentage of customers churning each month',
        placeholder: '5',
      },
      {
        id: 'churnReduction',
        label: 'Expected churn reduction',
        unit: 'pp',
        type: 'percentage',
        defaultValue: 2,
        min: 0,
        max: 100,
        helpText: 'Percentage points of churn reduction (e.g., from 5% to 3% = 2pp)',
        placeholder: '2',
      },
      {
        id: 'arpa',
        label: 'ARPA (Average Revenue Per Account)',
        unit: 'EUR',
        type: 'currency',
        defaultValue: 50,
        min: 0,
        helpText: 'Average monthly revenue per customer',
        placeholder: '50',
      },
      {
        id: 'grossMargin',
        label: 'Gross margin',
        unit: '%',
        type: 'percentage',
        defaultValue: 80,
        min: 0,
        max: 100,
        helpText: 'Gross profit margin',
        placeholder: '80',
      },
    ],
    assumptionsDefaults: {
      grossMargin: 80,
      hourlyRate: 600,
      horizon: 24,
    },
    formulas: {
      calculateDeltaRevenue: 'payingCustomers * churnReduction/100 * arpa * 12',
      calculateDeltaCost: 'deliveryCost + runCost * 12',
      calculateDeltaRisk: 'churnReduction * riskFactor',
    },
    scenarioRules: {
      conservative: {
        upliftMultiplier: 0.6,
        rampUpDelay: 1.3,
        riskPenalty: 1.4,
      },
      aggressive: {
        upliftMultiplier: 1.3,
        rampUpSpeed: 1.2,
        riskBonus: 0.8,
      },
    },
  },

  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'For e-commerce products focused on improving conversion or AOV',
    inputs: [
      {
        id: 'monthlyTraffic',
        label: 'Monthly traffic',
        unit: 'visitors',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        helpText: 'Monthly website visitors',
        placeholder: '100000',
      },
      {
        id: 'currentConversion',
        label: 'Current conversion rate',
        unit: '%',
        type: 'percentage',
        defaultValue: 2,
        min: 0,
        max: 100,
        helpText: 'Percentage of visitors who make a purchase',
        placeholder: '2',
      },
      {
        id: 'conversionUplift',
        label: 'Expected conversion uplift',
        unit: 'pp',
        type: 'percentage',
        defaultValue: 0.5,
        min: 0,
        max: 100,
        helpText: 'Percentage points increase in conversion (e.g., from 2% to 2.5% = 0.5pp)',
        placeholder: '0.5',
      },
      {
        id: 'aov',
        label: 'Average Order Value (AOV)',
        unit: 'EUR',
        type: 'currency',
        defaultValue: 80,
        min: 0,
        helpText: 'Average value per order',
        placeholder: '80',
      },
      {
        id: 'grossMargin',
        label: 'Gross margin',
        unit: '%',
        type: 'percentage',
        defaultValue: 40,
        min: 0,
        max: 100,
        helpText: 'Gross profit margin',
        placeholder: '40',
      },
    ],
    assumptionsDefaults: {
      grossMargin: 40,
      hourlyRate: 600,
      horizon: 24,
    },
    formulas: {
      calculateDeltaRevenue: 'monthlyTraffic * conversionUplift/100 * aov * 12',
      calculateDeltaCost: 'deliveryCost + runCost * 12',
      calculateDeltaRisk: 'conversionUplift * riskFactor',
    },
    scenarioRules: {
      conservative: {
        upliftMultiplier: 0.5,
        rampUpDelay: 1.4,
        riskPenalty: 1.5,
      },
      aggressive: {
        upliftMultiplier: 1.4,
        rampUpSpeed: 1.3,
        riskBonus: 0.7,
      },
    },
  },

  'b2b-sales': {
    id: 'b2b-sales',
    name: 'B2B Sales-led',
    description: 'For B2B products focused on improving pipeline conversion or win rate',
    inputs: [
      {
        id: 'monthlyLeads',
        label: 'Monthly qualified leads (SQL)',
        unit: 'leads',
        type: 'number',
        defaultValue: 200,
        min: 1,
        helpText: 'Number of sales-qualified leads per month',
        placeholder: '200',
      },
      {
        id: 'currentWinRate',
        label: 'Current win rate',
        unit: '%',
        type: 'percentage',
        defaultValue: 20,
        min: 0,
        max: 100,
        helpText: 'Percentage of leads that convert to customers',
        placeholder: '20',
      },
      {
        id: 'winRateUplift',
        label: 'Expected win rate uplift',
        unit: 'pp',
        type: 'percentage',
        defaultValue: 5,
        min: 0,
        max: 100,
        helpText: 'Percentage points increase in win rate (e.g., from 20% to 25% = 5pp)',
        placeholder: '5',
      },
      {
        id: 'acv',
        label: 'ACV (Annual Contract Value)',
        unit: 'EUR',
        type: 'currency',
        defaultValue: 50000,
        min: 0,
        helpText: 'Average annual contract value',
        placeholder: '50000',
      },
      {
        id: 'grossMargin',
        label: 'Gross margin',
        unit: '%',
        type: 'percentage',
        defaultValue: 70,
        min: 0,
        max: 100,
        helpText: 'Gross profit margin',
        placeholder: '70',
      },
    ],
    assumptionsDefaults: {
      grossMargin: 70,
      hourlyRate: 700,
      horizon: 24,
    },
    formulas: {
      calculateDeltaRevenue: 'monthlyLeads * 12 * winRateUplift/100 * acv',
      calculateDeltaCost: 'deliveryCost + runCost * 12',
      calculateDeltaRisk: 'winRateUplift * riskFactor',
    },
    scenarioRules: {
      conservative: {
        upliftMultiplier: 0.6,
        rampUpDelay: 1.5,
        riskPenalty: 1.3,
      },
      aggressive: {
        upliftMultiplier: 1.3,
        rampUpSpeed: 1.2,
        riskBonus: 0.8,
      },
    },
  },

  'cost-reduction': {
    id: 'cost-reduction',
    name: 'Cost Reduction / Automation',
    description: 'For automation and productivity improvements',
    inputs: [
      {
        id: 'monthlyVolume',
        label: 'Monthly volume',
        unit: 'tasks/tickets',
        type: 'number',
        defaultValue: 5000,
        min: 1,
        helpText: 'Number of tasks, tickets, or operations per month',
        placeholder: '5000',
      },
      {
        id: 'currentAHT',
        label: 'Current average handling time',
        unit: 'minutes',
        type: 'number',
        defaultValue: 15,
        min: 0,
        helpText: 'Average time to complete one task',
        placeholder: '15',
      },
      {
        id: 'timeReduction',
        label: 'Expected time reduction',
        unit: '%',
        type: 'percentage',
        defaultValue: 30,
        min: 0,
        max: 100,
        helpText: 'Percentage reduction in handling time',
        placeholder: '30',
      },
      {
        id: 'hourlyRate',
        label: 'Loaded hourly rate',
        unit: 'EUR/hour',
        type: 'currency',
        defaultValue: 50,
        min: 0,
        helpText: 'Fully-loaded cost per hour (salary + benefits + overhead)',
        placeholder: '50',
      },
      {
        id: 'grossMargin',
        label: 'Cost recovery rate',
        unit: '%',
        type: 'percentage',
        defaultValue: 100,
        min: 0,
        max: 100,
        helpText: 'Percentage of saved costs that can be recovered (100% = pure savings)',
        placeholder: '100',
      },
    ],
    assumptionsDefaults: {
      grossMargin: 100,
      hourlyRate: 50,
      horizon: 24,
    },
    formulas: {
      calculateDeltaRevenue: 'monthlyVolume * currentAHT * timeReduction/100 * hourlyRate/60 * 12',
      calculateDeltaCost: 'deliveryCost + runCost * 12',
      calculateDeltaRisk: 'timeReduction * riskFactor',
    },
    scenarioRules: {
      conservative: {
        upliftMultiplier: 0.6,
        rampUpDelay: 1.4,
        riskPenalty: 1.3,
      },
      aggressive: {
        upliftMultiplier: 1.2,
        rampUpSpeed: 1.3,
        riskBonus: 0.9,
      },
    },
  },
};

export function getTemplate(id: BusinessModelType): TemplateConfig {
  return TEMPLATES[id];
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}
