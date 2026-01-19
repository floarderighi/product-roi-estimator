// Glossaire des termes utilisés dans l'estimateur ROI
// Centralise toutes les définitions, exemples et valeurs par défaut

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  defaultValue?: string;
  relatedTerms?: string[];
}

export const glossary: Record<string, GlossaryEntry> = {
  // Métriques Business
  churn: {
    term: 'Churn (Taux de désabonnement)',
    definition: 'Pourcentage de clients qui arrêtent d\'utiliser votre produit chaque mois.',
    example: 'Si tu as 100 clients et que 5 partent ce mois → Churn = 5%',
    defaultValue: 'SaaS B2B moyen = 5-8% | SaaS B2C = 10-15%',
  },

  retention: {
    term: 'Rétention',
    definition: 'Pourcentage de clients qui continuent d\'utiliser votre produit sur une période donnée. C\'est l\'inverse du churn.',
    example: 'Si ton churn est de 5%, ta rétention mensuelle est de 95%',
    defaultValue: 'SaaS B2B moyen = 92-95%',
  },

  arpa: {
    term: 'ARPA (Average Revenue Per Account)',
    definition: 'Revenue moyen par compte client par mois.',
    example: 'Si tu factures 1000 clients pour un total de 50k€/mois → ARPA = 50€',
    defaultValue: 'Varie selon le segment : PME = 50-200€ | Enterprise = 500-5000€',
  },

  conversionRate: {
    term: 'Taux de conversion',
    definition: 'Pourcentage de visiteurs qui réalisent l\'action souhaitée (achat, inscription, etc.).',
    example: 'Si 1000 visiteurs arrivent sur ton site et 30 achètent → Conversion = 3%',
    defaultValue: 'E-commerce moyen = 2-4% | SaaS trial-to-paid = 15-25%',
  },

  aov: {
    term: 'AOV (Average Order Value)',
    definition: 'Montant moyen dépensé par transaction ou commande.',
    example: 'Si tu génères 10k€ de revenus sur 100 commandes → AOV = 100€',
    defaultValue: 'E-commerce moyen = 50-150€ selon le secteur',
  },

  winRate: {
    term: 'Win Rate (Taux de conversion des deals)',
    definition: 'Pourcentage d\'opportunités commerciales qui se transforment en deals gagnés.',
    example: 'Si ton équipe sales travaille sur 50 opportunités et en gagne 15 → Win rate = 30%',
    defaultValue: 'B2B moyen = 20-30% | Enterprise sales = 15-25%',
  },

  acv: {
    term: 'ACV (Annual Contract Value)',
    definition: 'Valeur annuelle moyenne d\'un contrat client.',
    example: 'Si un client paie 5k€/mois sur 12 mois → ACV = 60k€',
    defaultValue: 'Varie énormément : PME = 10-50k€ | Enterprise = 100-500k€+',
  },

  // Template-specific metrics
  currentChurn: {
    term: 'Churn mensuel actuel',
    definition: 'Pourcentage de clients qui arrêtent d\'utiliser votre produit chaque mois.',
    example: 'Si tu as 100 clients et que 5 partent ce mois → Churn = 5%',
    defaultValue: 'SaaS B2B moyen = 5-8% | SaaS B2C = 10-15%',
  },

  churnReduction: {
    term: 'Réduction du churn attendue',
    definition: 'De combien de points de pourcentage tu penses réduire le churn avec cette initiative.',
    example: 'Churn actuel 5%, objectif 3% → Réduction = 2 points de pourcentage (pp)',
    defaultValue: 'Initiatives impactantes = 1-3pp | Transformations majeures = 3-5pp',
  },

  currentConversion: {
    term: 'Taux de conversion actuel',
    definition: 'Pourcentage de visiteurs qui réalisent l\'action souhaitée (achat, inscription).',
    example: '1000 visiteurs, 30 achètent → Conversion = 3%',
    defaultValue: 'E-commerce moyen = 2-4% | SaaS trial = 15-25%',
  },

  conversionUplift: {
    term: 'Amélioration de conversion attendue',
    definition: 'De combien de points de pourcentage tu penses améliorer le taux de conversion.',
    example: 'Conversion actuelle 2%, objectif 2.5% → Uplift = 0.5pp',
    defaultValue: 'UX improvements = 0.3-1pp | Grandes refonte = 1-3pp',
  },

  currentWinRate: {
    term: 'Win rate actuel',
    definition: 'Pourcentage d\'opportunités commerciales qui se transforment en deals gagnés.',
    example: '50 opportunités, 15 gagnées → Win rate = 30%',
    defaultValue: 'B2B moyen = 20-30% | Enterprise = 15-25%',
  },

  winRateUplift: {
    term: 'Amélioration du win rate',
    definition: 'De combien de points tu penses améliorer le taux de conversion des deals.',
    example: 'Win rate actuel 25%, objectif 30% → Uplift = 5pp',
    defaultValue: 'Nouvelles features = 3-7pp | Refonte sales process = 5-10pp',
  },

  monthlyTraffic: {
    term: 'Trafic mensuel',
    definition: 'Nombre de visiteurs uniques sur ton site par mois.',
    example: 'Google Analytics indique 50 000 visiteurs uniques/mois',
  },

  payingCustomers: {
    term: 'Clients payants actuels',
    definition: 'Nombre total de clients qui paient actuellement pour ton produit.',
    example: 'Tous les abonnements actifs (excluant les trials gratuits)',
  },

  currentMRR: {
    term: 'MRR actuel (Monthly Recurring Revenue)',
    definition: 'Revenue récurrent total généré chaque mois par tous tes clients.',
    example: '1000 clients × 50€/mois en moyenne = 50 000€ MRR',
  },

  monthlyLeads: {
    term: 'Leads qualifiés par mois',
    definition: 'Nombre d\'opportunités commerciales qualifiées générées chaque mois.',
    example: 'Nombre de SQLs (Sales Qualified Leads) entrant dans le pipeline sales',
  },

  currentAHT: {
    term: 'AHT actuel (Average Handle Time)',
    definition: 'Temps moyen de traitement d\'une requête/ticket en minutes.',
    example: 'Si tu traites 100 tickets en 5000 minutes → AHT = 50 min/ticket',
  },

  timeReduction: {
    term: 'Réduction de temps attendue',
    definition: 'Pourcentage de réduction du temps de traitement grâce à l\'automatisation.',
    example: 'AHT actuel 50 min, objectif 35 min → Réduction = 30%',
  },

  // Métriques Financières
  grossMargin: {
    term: 'Marge Brute',
    definition: 'Pourcentage du revenu qui reste après avoir payé les coûts directs (serveurs, licences, support, etc.).',
    example: 'Si tu vends un abonnement 100€ et que ça te coûte 20€ en infrastructure → Marge brute = 80%',
    defaultValue: 'SaaS = 70-85% | E-commerce = 30-50% | Services = 50-70%',
  },

  paybackPeriod: {
    term: 'Période de Payback',
    definition: 'Temps nécessaire pour récupérer l\'investissement initial grâce aux profits générés.',
    example: 'Si tu investis 50k€ et que le projet génère 10k€/mois de profit → Payback = 5 mois',
    defaultValue: 'Objectif typique : 6-18 mois selon le secteur',
  },

  roi: {
    term: 'ROI (Return on Investment)',
    definition: 'Retour sur investissement exprimé en pourcentage. Mesure combien d\'euros tu récupères pour chaque euro investi.',
    example: 'Si tu investis 50k€ et génères 150k€ de profit sur 24 mois → ROI = 200%',
    defaultValue: 'Initiatives produit rentables : >100% sur 24 mois',
  },

  incrementalProfit: {
    term: 'Profit Incrémental',
    definition: 'Profit additionnel généré par l\'initiative, après déduction de tous les coûts (delivery + run).',
    example: 'Revenus additionnels 200k€ - Coût dev 50k€ - Coûts run 30k€ = Profit incrémental 120k€',
  },

  // Coûts
  deliveryCost: {
    term: 'Coût de Delivery',
    definition: 'Investissement initial pour développer et livrer la feature (équipe, temps, outils).',
    example: '2 personnes × 3 mois × 8000€/mois/personne = 48k€',
    defaultValue: 'PM Senior ~8-10k€/mois | Engineer Senior ~10-12k€/mois | Designer ~7-9k€/mois (coût employeur France)',
  },

  runCost: {
    term: 'Coût Run (Coûts récurrents)',
    definition: 'Coûts mensuels pour maintenir la feature en production (infrastructure, licences, support).',
    example: 'Serveurs 200€ + Licences 150€ + Support 300€ = 650€/mois',
    defaultValue: 'Généralement 10-20% du coût de delivery annualisé',
  },

  hourlyRate: {
    term: 'Taux horaire chargé',
    definition: 'Coût horaire complet incluant le salaire brut, les charges patronales (~42%) et l\'overhead (~20% pour bureau, outils, management). Formule : Salaire annuel × 1.42 × 1.2 ÷ 1600h.',
    example: 'Un salarié à 35k€/an brut → 35k × 1.42 × 1.2 ÷ 1600h = 37€/h chargé',
    defaultValue: 'Support junior: 25-35€/h | Support confirmé: 35-50€/h | Expert: 50-75€/h',
  },

  // Adoption & Timing
  rampUp: {
    term: 'Période de Ramp-up',
    definition: 'Temps nécessaire pour que l\'initiative atteigne son plein impact après le lancement. Les utilisateurs n\'adoptent pas tous instantanément.',
    example: 'Si tu lances une feature, peut-être que 30% l\'utilisent le 1er mois, 60% le 2ème, 100% le 3ème → Ramp-up de 3 mois',
    defaultValue: 'Standard = 3-6 mois pour la plupart des features',
  },

  adoptionRate: {
    term: 'Taux d\'adoption',
    definition: 'Pourcentage d\'utilisateurs qui vont effectivement utiliser la nouvelle feature.',
    example: 'Si tu as 1000 users et que 700 utilisent la feature → Adoption = 70%',
    defaultValue: 'Conservative = 50% | Realistic = 70% | Optimiste = 90%',
  },

  // Confiance & Risques
  confidenceScore: {
    term: 'Score de Confiance',
    definition: 'Note sur 10 qui évalue la solidité de tes hypothèses basée sur la qualité des données, les dépendances et la preuve d\'amélioration.',
    example: 'Hypothèses basées sur un test A/B + données mesurées + 0 dépendance = Score élevé (8-9/10)',
    defaultValue: 'Score >7 = Solide | 5-7 = Moyen | <5 = Fragile',
  },

  dataQuality: {
    term: 'Qualité des Données',
    definition: 'Niveau de fiabilité de tes métriques : mesurées (analytics en place), partielles (quelques données) ou estimées (hypothèse éclairée).',
    example: 'Si tu as Google Analytics sur ton funnel de conversion → Données mesurées',
  },

  marketRisk: {
    term: 'Risque Marché',
    definition: 'Probabilité que les utilisateurs n\'adoptent pas la feature, que les concurrents réagissent, ou que le marché change.',
    example: 'Feature très demandée par les clients = Risque faible (2-3) | Feature innovante sans validation = Risque élevé (7-8)',
  },

  technicalRisk: {
    term: 'Risque Technique',
    definition: 'Complexité d\'implémentation, dépendances techniques, dette technique existante.',
    example: 'Simple évolution UI = Risque faible (2-3) | Refonte architecture complète = Risque élevé (7-9)',
  },

  // Scénarios
  conservativeScenario: {
    term: 'Scénario Conservative',
    definition: 'Hypothèses pessimistes : adoption plus faible, ramp-up plus lent, impact réduit. Utilise ce scénario pour le "worst case acceptable".',
    example: 'Au lieu d\'améliorer la conversion de 2%, on table sur 1.2% seulement',
  },

  baseScenario: {
    term: 'Scénario Base (Réaliste)',
    definition: 'Hypothèses les plus probables basées sur tes données et benchmarks. C\'est ton scénario de référence.',
    example: 'Basé sur tes tests A/B ou analogies avec des features similaires',
  },

  aggressiveScenario: {
    term: 'Scénario Aggressive (Optimiste)',
    definition: 'Hypothèses optimistes : adoption rapide, impact maximum. Utilise ce scénario pour le "best case plausible".',
    example: 'Si tout se passe mieux que prévu : adoption 90% au lieu de 70%',
  },

  // Templates Business Model
  saasModel: {
    term: 'SaaS (Software as a Service)',
    definition: 'Modèle par abonnement récurrent. Métriques clés : MRR/ARR, Churn, LTV, CAC.',
    example: 'Slack, Notion, Salesforce - revenus récurrents mensuels ou annuels',
  },

  ecommerceModel: {
    term: 'E-commerce',
    definition: 'Vente de produits en ligne. Métriques clés : Taux de conversion, AOV, Repeat rate.',
    example: 'Amazon, Shopify stores - chaque visite peut générer une transaction',
  },

  b2bSalesModel: {
    term: 'B2B Sales-led',
    definition: 'Ventes complexes avec cycle long et équipe commerciale. Métriques clés : Win rate, Deal size, Sales cycle.',
    example: 'Salesforce Enterprise, SAP - cycles de vente de 3-12 mois',
  },

  costReductionModel: {
    term: 'Réduction de Coûts',
    definition: 'Initiatives qui génèrent de la valeur en réduisant les coûts opérationnels (automatisation, productivité).',
    example: 'Automatiser le support client → Réduire le temps de traitement de 30%',
  },
};

// Helper function to get glossary entry
export function getGlossaryEntry(key: string): GlossaryEntry | undefined {
  return glossary[key];
}

// Helper function to get all terms
export function getAllTerms(): string[] {
  return Object.keys(glossary);
}
