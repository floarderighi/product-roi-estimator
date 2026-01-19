import { CalculationResult } from '@/types';

/**
 * Génère des messages sympas et encourageants basés sur les résultats
 */

export interface EncouragingMessage {
  title: string;
  subtitle: string;
  emoji: string;
}

export function getEncouragingMessage(result: CalculationResult): EncouragingMessage {
  const baseScenario = result.scenarios.base;
  const { paybackMonths, roi24, annualProfit } = baseScenario;
  const { confidenceScore } = result;

  // Cas 1: Excellent ROI + Payback rapide
  if (roi24 > 200 && paybackMonths < 6) {
    return {
      emoji: '🚀',
      title: 'Waouh ! C\'est du solide !',
      subtitle: `ROI de ${roi24.toFixed(0)}% et payback en ${paybackMonths} mois, vos sponsors vont adorer !`,
    };
  }

  // Cas 2: ROI excellent
  if (roi24 > 150) {
    return {
      emoji: '💎',
      title: 'ROI exceptionnel !',
      subtitle: `${roi24.toFixed(0)}% de ROI sur 24 mois, c'est un business case en or !`,
    };
  }

  // Cas 3: Payback très rapide
  if (paybackMonths < 6) {
    return {
      emoji: '⚡',
      title: 'Retour sur investissement ultra-rapide !',
      subtitle: `Payback en ${paybackMonths} mois, l'impact sera visible très vite !`,
    };
  }

  // Cas 4: Profit annuel élevé
  if (annualProfit > 100000) {
    return {
      emoji: '💰',
      title: 'Impact financier significatif !',
      subtitle: `${Math.round(annualProfit / 1000)}K EUR de profit annuel, ça va peser dans la balance !`,
    };
  }

  // Cas 5: Score de confiance élevé
  if (confidenceScore > 80) {
    return {
      emoji: '🎯',
      title: 'Score de confiance excellent !',
      subtitle: `${confidenceScore}/100 - Vous avez bien préparé votre business case !`,
    };
  }

  // Cas 6: ROI positif + Payback raisonnable
  if (roi24 > 50 && paybackMonths < 12) {
    return {
      emoji: '✨',
      title: 'Business case solide !',
      subtitle: `ROI de ${roi24.toFixed(0)}% avec un payback de ${paybackMonths} mois !`,
    };
  }

  // Cas 7: Bon équilibre
  if (roi24 > 30) {
    return {
      emoji: '📈',
      title: 'Votre initiative est viable !',
      subtitle: `Un ROI de ${roi24.toFixed(0)}% sur 24 mois, c'est encourageant !`,
    };
  }

  // Cas 8: ROI faible mais positif
  if (roi24 > 0) {
    return {
      emoji: '💡',
      title: 'Business case prêt !',
      subtitle: 'Votre analyse est complète, vous pouvez la présenter à vos sponsors.',
    };
  }

  // Cas 9: ROI négatif
  return {
    emoji: '🔍',
    title: 'Analyse terminée',
    subtitle: 'Explorez les scénarios pour identifier les leviers d\'amélioration.',
  };
}

/**
 * Messages pour la confiance
 */
export function getConfidenceMessage(score: number): string {
  if (score >= 80) return 'Confiance Élevée - Données solides ! 🎯';
  if (score >= 60) return 'Confiance Moyenne - À affiner 📊';
  return 'Confiance Faible - Hypothèses à valider ⚠️';
}

/**
 * Messages pour le payback
 */
export function getPaybackMessage(months: number): string {
  if (months <= 6) return `⚡ Payback ultra-rapide en ${months} mois !`;
  if (months <= 12) return `✅ Payback raisonnable en ${months} mois`;
  if (months <= 24) return `⏱️ Payback en ${months} mois`;
  return `⏳ Payback en ${months} mois - Impact à long terme`;
}

/**
 * Messages pour le ROI
 */
export function getRoiMessage(roi: number): string {
  if (roi >= 200) return '🚀 ROI exceptionnel !';
  if (roi >= 100) return '💎 Excellent ROI !';
  if (roi >= 50) return '✨ Très bon ROI';
  if (roi >= 25) return '📈 ROI solide';
  if (roi > 0) return '💡 ROI positif';
  return '📊 ROI négatif';
}
