import { TemplateConfig, BusinessModelType } from '@/types';

/**
 * Définitions des templates pour les 4 modèles business (Version Française)
 * Basé sur la section 10 du PRD
 */

export const TEMPLATES_FR: Record<BusinessModelType, TemplateConfig> = {
  'saas': {
    id: 'saas',
    name: '💎 SaaS (MRR/ARR)',
    description: 'Pour les produits SaaS axés sur la réduction du churn ou l\'amélioration de la rétention',
    inputs: [
      {
        id: 'payingCustomers',
        label: 'Clients payants actuels',
        unit: 'clients',
        type: 'number',
        min: 1,
        helpText: 'Nombre total de clients payants actifs',
        placeholder: 'ex: 1000',
      },
      {
        id: 'currentMRR',
        label: 'MRR actuel',
        unit: 'EUR',
        type: 'currency',
        min: 0,
        helpText: 'Revenu récurrent mensuel (calculé automatiquement en mode Simple)',
        placeholder: 'ex: 50000',
      },
      {
        id: 'currentChurn',
        label: 'Churn mensuel actuel',
        unit: '%',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Pourcentage de clients qui partent chaque mois',
        placeholder: 'ex: 5',
      },
      {
        id: 'churnReduction',
        label: 'Réduction du churn attendue',
        unit: 'pp',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Points de pourcentage de réduction du churn (ex: de 5% à 3% = 2pp)',
        placeholder: 'ex: 2',
      },
      {
        id: 'arpa',
        label: 'ARPA (Revenu Moyen Par Compte)',
        unit: 'EUR',
        type: 'currency',
        min: 0,
        helpText: 'Revenu mensuel moyen par client',
        placeholder: 'ex: 50',
      },
      {
        id: 'grossMargin',
        label: 'Marge brute',
        unit: '%',
        type: 'percentage',
        defaultValue: 80,
        min: 0,
        max: 100,
        helpText: 'Marge de profit brute',
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
    name: '🛒 E-commerce',
    description: 'Pour les produits e-commerce axés sur l\'amélioration de la conversion ou de l\'AOV',
    inputs: [
      {
        id: 'monthlyTraffic',
        label: 'Trafic mensuel',
        unit: 'visiteurs',
        type: 'number',
        min: 1,
        helpText: 'Visiteurs mensuels du site web',
        placeholder: 'ex: 100000',
      },
      {
        id: 'currentConversion',
        label: 'Taux de conversion actuel',
        unit: '%',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Pourcentage de visiteurs qui effectuent un achat',
        placeholder: 'ex: 2',
      },
      {
        id: 'conversionUplift',
        label: 'Amélioration de conversion attendue',
        unit: 'pp',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Points de pourcentage d\'augmentation de la conversion (ex: de 2% à 2.5% = 0.5pp)',
        placeholder: 'ex: 0.5',
      },
      {
        id: 'aov',
        label: 'Valeur Moyenne de Commande (AOV)',
        unit: 'EUR',
        type: 'currency',
        min: 0,
        helpText: 'Valeur moyenne par commande',
        placeholder: 'ex: 80',
      },
      {
        id: 'grossMargin',
        label: 'Marge brute',
        unit: '%',
        type: 'percentage',
        defaultValue: 40,
        min: 0,
        max: 100,
        helpText: 'Marge de profit brute',
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
    name: '🤝 B2B Sales-led',
    description: 'Pour les produits B2B axés sur l\'amélioration de la conversion du pipeline ou du win rate',
    inputs: [
      {
        id: 'monthlyLeads',
        label: 'Leads qualifiés mensuels (SQL)',
        unit: 'leads',
        type: 'number',
        min: 1,
        helpText: 'Nombre de leads qualifiés pour la vente par mois',
        placeholder: 'ex: 200',
      },
      {
        id: 'currentWinRate',
        label: 'Win rate actuel',
        unit: '%',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Pourcentage de leads qui se convertissent en clients',
        placeholder: 'ex: 20',
      },
      {
        id: 'winRateUplift',
        label: 'Amélioration du win rate attendue',
        unit: 'pp',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Points de pourcentage d\'augmentation du win rate (ex: de 20% à 25% = 5pp)',
        placeholder: 'ex: 5',
      },
      {
        id: 'acv',
        label: 'ACV (Valeur Annuelle du Contrat)',
        unit: 'EUR',
        type: 'currency',
        min: 0,
        helpText: 'Valeur moyenne annuelle du contrat',
        placeholder: 'ex: 50000',
      },
      {
        id: 'grossMargin',
        label: 'Marge brute',
        unit: '%',
        type: 'percentage',
        defaultValue: 70,
        min: 0,
        max: 100,
        helpText: 'Marge de profit brute',
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
    name: '⚡ Réduction de Coûts / Automatisation',
    description: 'Pour l\'automatisation et les améliorations de productivité',
    inputs: [
      {
        id: 'monthlyVolume',
        label: 'Volume mensuel',
        unit: 'tâches/tickets',
        type: 'number',
        min: 1,
        helpText: 'Nombre de tâches, tickets ou opérations par mois',
        placeholder: 'ex: 5000',
      },
      {
        id: 'currentAHT',
        label: 'Temps de traitement moyen actuel',
        unit: 'minutes',
        type: 'number',
        min: 0,
        helpText: 'Temps moyen pour compléter une tâche',
        placeholder: 'ex: 15',
      },
      {
        id: 'timeReduction',
        label: 'Réduction de temps attendue',
        unit: '%',
        type: 'percentage',
        min: 0,
        max: 100,
        helpText: 'Pourcentage de réduction du temps de traitement',
        placeholder: 'ex: 30',
      },
      {
        id: 'hourlyRate',
        label: 'Taux horaire chargé',
        unit: 'EUR/heure',
        type: 'currency',
        min: 0,
        helpText: 'Coût horaire complet (salaire + charges + overhead)',
        placeholder: 'ex: 50',
      },
      {
        id: 'grossMargin',
        label: 'Taux de récupération des coûts',
        unit: '%',
        type: 'percentage',
        defaultValue: 100,
        min: 0,
        max: 100,
        helpText: 'Pourcentage des coûts économisés qui peuvent être récupérés (100% = économies pures)',
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

export function getTemplateFr(id: BusinessModelType): TemplateConfig {
  return TEMPLATES_FR[id];
}

export function getAllTemplatesFr(): TemplateConfig[] {
  return Object.values(TEMPLATES_FR);
}
