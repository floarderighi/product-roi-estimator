// Aide contextuelle pour guider l'utilisateur avec des valeurs réalistes
// Basé sur le business model et la métrique

import { BusinessModelType } from '@/types';

export interface ContextualHelp {
  placeholder: string;
  hint: string;
  typicalRange?: string;
}

// Aide contextuelle par business model et métrique
export const contextualHelpMap: Record<BusinessModelType, Record<string, ContextualHelp>> = {
  'saas': {
    payingCustomers: {
      placeholder: 'ex: 1000',
      hint: 'Nombre de clients avec un abonnement actif',
      typicalRange: 'Early stage: 50-500 | Growth: 500-5000 | Scale: 5000+',
    },
    currentMRR: {
      placeholder: 'ex: 50000',
      hint: 'Revenue récurrent mensuel total',
      typicalRange: 'Early: 5k-50k€ | Growth: 50k-500k€ | Scale: 500k€+',
    },
    currentChurn: {
      placeholder: 'ex: 5',
      hint: '% de clients qui partent chaque mois',
      typicalRange: 'Excellent: <3% | Bon: 3-5% | À améliorer: 5-10% | Critique: >10%',
    },
    churnReduction: {
      placeholder: 'ex: 2',
      hint: 'Réduction en points de pourcentage',
      typicalRange: 'Petit impact: 0.5-1pp | Impact moyen: 1-2pp | Gros impact: 2-4pp',
    },
    arpa: {
      placeholder: 'ex: 50',
      hint: 'Revenue moyen par client/mois',
      typicalRange: 'Self-serve: 10-50€ | SMB: 50-200€ | Mid-market: 200-1000€ | Enterprise: 1000€+',
    },
    grossMargin: {
      placeholder: 'ex: 80',
      hint: '% de profit après coûts directs',
      typicalRange: 'SaaS typique: 70-85% | Avec support: 60-75%',
    },
  },

  'ecommerce': {
    monthlyTraffic: {
      placeholder: 'ex: 50000',
      hint: 'Visiteurs uniques par mois',
      typicalRange: 'Petit: 5k-25k | Moyen: 25k-100k | Large: 100k-500k | Very large: 500k+',
    },
    currentConversion: {
      placeholder: 'ex: 2',
      hint: '% de visiteurs qui achètent',
      typicalRange: 'Moyenne e-commerce: 2-4% | Bon: 4-6% | Excellent: 6-10%',
    },
    conversionUplift: {
      placeholder: 'ex: 0.5',
      hint: 'Amélioration en points de %',
      typicalRange: 'UX tweak: 0.2-0.5pp | Refonte: 0.5-2pp | Transformation: 2-5pp',
    },
    aov: {
      placeholder: 'ex: 75',
      hint: 'Panier moyen par commande',
      typicalRange: 'Low-ticket: 20-50€ | Medium: 50-150€ | High-ticket: 150-500€ | Luxury: 500€+',
    },
    grossMargin: {
      placeholder: 'ex: 40',
      hint: '% de marge après COGS',
      typicalRange: 'Dropshipping: 15-30% | Retail: 30-50% | DTC Brand: 40-60%',
    },
  },

  'b2b-sales': {
    monthlyLeads: {
      placeholder: 'ex: 100',
      hint: 'Leads qualifiés (SQLs) par mois',
      typicalRange: 'Small team: 20-50 | Medium: 50-200 | Large: 200-1000',
    },
    currentWinRate: {
      placeholder: 'ex: 25',
      hint: '% d\'opportunités qui closent',
      typicalRange: 'SMB: 25-35% | Mid-market: 20-30% | Enterprise: 15-25%',
    },
    winRateUplift: {
      placeholder: 'ex: 5',
      hint: 'Amélioration en points de %',
      typicalRange: 'Nouvelle feature: 3-7pp | Process improvement: 5-10pp | Major change: 10-20pp',
    },
    acv: {
      placeholder: 'ex: 50000',
      hint: 'Valeur annuelle moyenne d\'un contrat',
      typicalRange: 'SMB: 5k-25k€ | Mid-market: 25k-100k€ | Enterprise: 100k-1M€+',
    },
    grossMargin: {
      placeholder: 'ex: 75',
      hint: '% de marge après delivery costs',
      typicalRange: 'Software: 70-85% | Services: 40-60% | Hybrid: 50-70%',
    },
  },

  'cost-reduction': {
    monthlyVolume: {
      placeholder: 'ex: 10000',
      hint: 'Nombre de tickets/requêtes/mois',
      typicalRange: 'Small: 1k-5k | Medium: 5k-25k | Large: 25k-100k | Very large: 100k+',
    },
    currentAHT: {
      placeholder: 'ex: 45',
      hint: 'Temps moyen de traitement (minutes)',
      typicalRange: 'Simple: 5-15min | Medium: 15-45min | Complex: 45-120min',
    },
    timeReduction: {
      placeholder: 'ex: 30',
      hint: '% de réduction du temps',
      typicalRange: 'Automation partielle: 20-40% | Automation forte: 40-70% | Full automation: 70-95%',
    },
    hourlyRate: {
      placeholder: 'ex: 35',
      hint: 'Coût total (salaire + charges + overhead). Utilisez le calculateur ci-dessous si besoin.',
      typicalRange: 'Support N1: 25-35€/h | Support N2: 35-50€/h | Support N3/Expert: 50-75€/h',
    },
    grossMargin: {
      placeholder: 'ex: 100',
      hint: 'Pour cost reduction, généralement 100%',
      typicalRange: 'Cost savings = 100% (pas de COGS)',
    },
  },
};

export function getContextualHelp(
  businessModel: BusinessModelType,
  fieldId: string
): ContextualHelp | undefined {
  return contextualHelpMap[businessModel]?.[fieldId];
}

// Helper pour générer un message d'aide complet
export function getFieldHint(
  businessModel: BusinessModelType,
  fieldId: string
): string | undefined {
  const help = getContextualHelp(businessModel, fieldId);
  if (!help) return undefined;

  return help.typicalRange ? `${help.hint} • ${help.typicalRange}` : help.hint;
}
