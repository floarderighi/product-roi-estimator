// Système de validation intelligente pour détecter les valeurs suspectes
// et aider l'utilisateur à corriger ses erreurs

import { BusinessModelType } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
  suggestedValue?: number;
}

// Règles de validation par métrique et business model
const validationRules: Record<
  BusinessModelType,
  Record<string, (value: number, allValues?: Record<string, number>) => ValidationResult | null>
> = {
  'saas': {
    currentChurn: (value) => {
      if (value > 15) {
        return {
          isValid: false,
          severity: 'error',
          message: 'Churn très élevé (>15%)',
          suggestion: 'Un churn aussi élevé est critique pour un SaaS. La moyenne est entre 5-8%. Es-tu sûr de cette valeur ?',
          suggestedValue: 7,
        };
      }
      if (value > 10) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Churn élevé',
          suggestion: 'Un churn de 10%+ est préoccupant. La moyenne SaaS B2B est 5-8%.',
        };
      }
      if (value < 1) {
        return {
          isValid: true,
          severity: 'info',
          message: 'Churn excellent',
          suggestion: 'Un churn <1% est exceptionnel ! Assure-toi que ton calcul est correct.',
        };
      }
      return null;
    },

    churnReduction: (value, allValues) => {
      const currentChurn = allValues?.currentChurn || 0;
      if (value >= currentChurn) {
        return {
          isValid: false,
          severity: 'error',
          message: 'Réduction impossible',
          suggestion: `Tu ne peux pas réduire le churn de ${value}pp si ton churn actuel est ${currentChurn}%. Maximum possible : ${currentChurn}pp.`,
          suggestedValue: Math.max(1, currentChurn * 0.3),
        };
      }
      if (value > currentChurn * 0.5) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Objectif ambitieux',
          suggestion: `Réduire le churn de ${value}pp (${Math.round((value/currentChurn)*100)}% de réduction) est très ambitieux. Es-tu confiant ?`,
        };
      }
      return null;
    },

    grossMargin: (value) => {
      if (value > 95) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Marge très élevée',
          suggestion: 'Une marge brute >95% est rare en SaaS. As-tu bien compté tous les coûts directs (serveurs, support, etc.) ?',
        };
      }
      if (value < 50) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Marge faible pour du SaaS',
          suggestion: 'La marge brute SaaS typique est 70-85%. Une marge <50% peut indiquer un problème de structure de coûts.',
        };
      }
      return null;
    },
  },

  'ecommerce': {
    currentConversion: (value) => {
      if (value > 10) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Conversion très élevée',
          suggestion: 'Un taux >10% est exceptionnel en e-commerce (moyenne 2-4%). Vérifie ton calcul.',
        };
      }
      if (value < 0.5) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Conversion très faible',
          suggestion: 'Même pour de l\'e-commerce, <0.5% est très bas. Il y a peut-être un problème UX majeur.',
        };
      }
      return null;
    },

    conversionUplift: (value, allValues) => {
      const current = allValues?.currentConversion || 0;
      if (value > current) {
        return {
          isValid: false,
          severity: 'error',
          message: 'Uplift impossible',
          suggestion: `Tu ne peux pas améliorer de ${value}pp si ton taux actuel est ${current}%.`,
          suggestedValue: current * 0.3,
        };
      }
      if (value > current * 0.5) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Uplift très ambitieux',
          suggestion: `+${value}pp représente +${Math.round((value/current)*100)}% d'amélioration. Les refonte UX typiques font +0.5-2pp.`,
        };
      }
      return null;
    },

    grossMargin: (value) => {
      if (value > 70) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Marge élevée pour de l\'e-commerce',
          suggestion: 'La marge e-commerce typique est 30-50%. >70% est rare sauf pour du DTC haut de gamme.',
        };
      }
      if (value < 20) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Marge très faible',
          suggestion: 'Une marge <20% laisse peu de place pour les opérations. Vérifie tes coûts de produits.',
        };
      }
      return null;
    },
  },

  'b2b-sales': {
    currentWinRate: (value) => {
      if (value > 50) {
        return {
          isValid: true,
          severity: 'info',
          message: 'Win rate exceptionnel',
          suggestion: 'Un win rate >50% est excellent ! La moyenne B2B est 20-30%.',
        };
      }
      if (value < 10) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Win rate très faible',
          suggestion: 'Un win rate <10% suggère un problème de qualification des leads ou de fit produit-marché.',
        };
      }
      return null;
    },

    winRateUplift: (value, allValues) => {
      const current = allValues?.currentWinRate || 0;
      if (value > 30) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Amélioration très ambitieuse',
          suggestion: `+${value}pp de win rate est extrêmement difficile à atteindre. Les initiatives produit typiques font +3-7pp.`,
        };
      }
      return null;
    },

    grossMargin: (value) => {
      if (value > 90) {
        return {
          isValid: true,
          severity: 'info',
          message: 'Marge software pure',
          suggestion: 'Une marge >90% suggère un produit software pur sans services. Parfait !',
        };
      }
      if (value < 40) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Marge faible',
          suggestion: 'En B2B software, la marge typique est 70-85%. <40% peut indiquer trop de services custom.',
        };
      }
      return null;
    },
  },

  'cost-reduction': {
    timeReduction: (value) => {
      if (value > 90) {
        return {
          isValid: true,
          severity: 'warning',
          message: 'Réduction quasi-totale',
          suggestion: 'Éliminer >90% du temps est très rare. Assure-toi que c\'est réaliste.',
        };
      }
      if (value < 10) {
        return {
          isValid: true,
          severity: 'info',
          message: 'Gain marginal',
          suggestion: 'Une réduction <10% peut ne pas justifier l\'investissement. Es-tu sûr de l\'impact ?',
        };
      }
      return null;
    },

    grossMargin: (value) => {
      if (value !== 100) {
        return {
          isValid: true,
          severity: 'info',
          message: 'Marge cost reduction',
          suggestion: 'Pour les initiatives de réduction de coûts, la marge brute est généralement 100% (pure économie).',
          suggestedValue: 100,
        };
      }
      return null;
    },
  },
};

export function validateField(
  businessModel: BusinessModelType,
  fieldId: string,
  value: number,
  allValues?: Record<string, number>
): ValidationResult | null {
  const validator = validationRules[businessModel]?.[fieldId];
  if (!validator) return null;

  return validator(value, allValues);
}

export function validateAllFields(
  businessModel: BusinessModelType,
  values: Record<string, number>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldId, value] of Object.entries(values)) {
    const validation = validateField(businessModel, fieldId, value, values);
    if (validation) {
      results[fieldId] = validation;
    }
  }

  return results;
}
