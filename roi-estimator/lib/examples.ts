import { RiskInputs, ConfidenceInputs, BusinessModelType, RampUpPeriod } from '@/types';

/**
 * Données d'exemple réalistes pour chaque template
 * Permet aux utilisateurs de tester rapidement l'application
 */

export interface ExampleData {
  name: string;
  description: string;
  metrics: Record<string, number>;
  costs: {
    deliveryCost: number;
    runCost: number;
  };
  rampUp: RampUpPeriod;
  horizon: number;
  risks: RiskInputs;
  confidence: ConfidenceInputs;
}

export const EXAMPLES: Record<BusinessModelType, ExampleData> = {
  'saas': {
    name: 'Réduire le churn avec un onboarding amélioré',
    description: 'Améliorer l\'expérience d\'onboarding pour réduire le churn des premiers mois',
    metrics: {
      payingCustomers: 1000,
      currentMRR: 50000,
      currentChurn: 5,
      churnReduction: 2,
      arpa: 50,
      grossMargin: 80,
    },
    costs: {
      deliveryCost: 30000,
      runCost: 2000,
    },
    rampUp: '3-months',
    horizon: 24,
    risks: {
      marketRisk: 2,
      technicalRisk: 2,
      timeToMarketRisk: 4,
    },
    confidence: {
      dataQuality: 'measured',
      dependencies: '1-2',
      upliftNature: 'ab-test',
    },
  },

  'ecommerce': {
    name: 'Optimiser le tunnel de checkout',
    description: 'Simplifier le processus de paiement pour augmenter le taux de conversion',
    metrics: {
      monthlyTraffic: 100000,
      currentConversion: 2,
      conversionUplift: 0.5,
      aov: 80,
      grossMargin: 40,
    },
    costs: {
      deliveryCost: 25000,
      runCost: 1500,
    },
    rampUp: '3-months',
    horizon: 24,
    risks: {
      marketRisk: 2,
      technicalRisk: 4,
      timeToMarketRisk: 2,
    },
    confidence: {
      dataQuality: 'measured',
      dependencies: '1-2',
      upliftNature: 'ab-test',
    },
  },

  'b2b-sales': {
    name: 'Améliorer le CRM pour augmenter le win rate',
    description: 'Optimiser le processus commercial avec un meilleur CRM et scoring de leads',
    metrics: {
      monthlyLeads: 200,
      currentWinRate: 20,
      winRateUplift: 5,
      acv: 50000,
      grossMargin: 70,
    },
    costs: {
      deliveryCost: 50000,
      runCost: 3000,
    },
    rampUp: '6-months',
    horizon: 24,
    risks: {
      marketRisk: 5,
      technicalRisk: 5,
      timeToMarketRisk: 5,
    },
    confidence: {
      dataQuality: 'partial',
      dependencies: '3+',
      upliftNature: 'analogy',
    },
  },

  'cost-reduction': {
    name: 'Automatiser le support client Tier 1',
    description: 'Déployer un chatbot IA pour traiter automatiquement les questions simples',
    metrics: {
      monthlyVolume: 5000,
      currentAHT: 15,
      timeReduction: 30,
      hourlyRate: 50,
      grossMargin: 100,
    },
    costs: {
      deliveryCost: 40000,
      runCost: 2500,
    },
    rampUp: '6-months',
    horizon: 24,
    risks: {
      marketRisk: 2,
      technicalRisk: 4,
      timeToMarketRisk: 4,
    },
    confidence: {
      dataQuality: 'measured',
      dependencies: '3+',
      upliftNature: 'analogy',
    },
  },
};

/**
 * Récupère l'exemple pour un template donné
 */
export function getExample(businessModel: BusinessModelType): ExampleData {
  return EXAMPLES[businessModel];
}

/**
 * Vérifie si un exemple existe pour un business model
 */
export function hasExample(businessModel: BusinessModelType): boolean {
  return businessModel in EXAMPLES;
}
