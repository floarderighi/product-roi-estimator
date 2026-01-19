// Configuration des champs requis selon le mode (Simple vs Expert)

import { BusinessModelType } from '@/types';

// Champs essentiels pour le mode simple par business model
export const simpleModeFields: Record<BusinessModelType, string[]> = {
  'saas': [
    'payingCustomers',
    'currentChurn',
    'churnReduction',
    'arpa',
  ],
  'ecommerce': [
    'monthlyTraffic',
    'currentConversion',
    'conversionUplift',
    'aov',
  ],
  'b2b-sales': [
    'monthlyLeads',
    'currentWinRate',
    'winRateUplift',
    'acv',
  ],
  'cost-reduction': [
    'monthlyVolume',
    'currentAHT',
    'timeReduction',
    'hourlyRate',
  ],
};

// Valeurs par défaut intelligentes pour le mode simple
export const defaultValues: Record<BusinessModelType, Record<string, number>> = {
  'saas': {
    grossMargin: 80, // Marge SaaS typique
    currentMRR: 50000, // Calculé à partir de payingCustomers * arpa si pas fourni
  },
  'ecommerce': {
    grossMargin: 40, // Marge e-commerce typique
  },
  'b2b-sales': {
    grossMargin: 75, // Marge B2B software typique
  },
  'cost-reduction': {
    grossMargin: 100, // Pour cost reduction, c'est toujours 100%
  },
};

// Vérifie si un champ est requis en mode simple
export function isRequiredInSimpleMode(businessModel: BusinessModelType, fieldId: string): boolean {
  return simpleModeFields[businessModel]?.includes(fieldId) || false;
}

// Obtient la valeur par défaut pour un champ
export function getDefaultValue(businessModel: BusinessModelType, fieldId: string): number | undefined {
  return defaultValues[businessModel]?.[fieldId];
}

// Rempli les valeurs manquantes avec les valeurs par défaut
export function fillDefaultValues(
  businessModel: BusinessModelType,
  values: Record<string, number>
): Record<string, number> {
  const defaults = defaultValues[businessModel] || {};
  const filled = { ...values };

  // Remplir les valeurs par défaut pour les champs non fournis
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (filled[key] === undefined || filled[key] === 0) {
      filled[key] = defaultValue;
    }
  }

  // Calculer le MRR si non fourni (pour SaaS)
  if (businessModel === 'saas' && !filled['currentMRR'] && filled['payingCustomers'] && filled['arpa']) {
    filled['currentMRR'] = filled['payingCustomers'] * filled['arpa'];
  }

  return filled;
}
