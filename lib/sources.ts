/**
 * Sources et justifications des valeurs par défaut
 * Toutes les données sont issues de sources françaises crédibles et récentes (2025-2026)
 */

export const MARGIN_SOURCES = {
  saas: {
    value: 80,
    description: 'Marge brute SaaS typique en France (2025)',
    sources: [
      {
        title: 'Logiciel SaaS: chiffre d\'affaires, rentabilité (Sep 2025)',
        url: 'https://modelesdebusinessplan.com/blogs/infos/logiciel-saas-revenus-rentabilite-profits',
        quote: 'La marge brute médiane des SaaS se maintient entre 75% et 85% en 2025',
      },
      {
        title: 'Marge brute, l\'indicateur silencieux de votre rentabilité - FrenchWeb',
        url: 'https://www.frenchweb.fr/marge-brute-lindicateur-silencieux-de-votre-rentabilite/455994',
        quote: 'Au-delà de 75% en SaaS c\'est bien, au-delà de 85-90% c\'est superstar',
      },
      {
        title: 'KPI SAAS - Rainmakers',
        url: 'https://www.rainmakers.fi/2022/11/22/kpi-saas-lesquels-suivre-et-pourquoi/',
        quote: 'La vraie marge brute doit être au minimum > 70%, et au-delà de 75% pour être considéré comme efficace',
      },
    ],
  },
  ecommerce: {
    value: 40,
    description: 'Marge brute e-commerce moyenne (hors alimentaire)',
    sources: [
      {
        title: 'Quel commerce rapportera le plus en 2026 ?',
        url: 'https://modelesdebusinessplan.com/blogs/infos/commerce-rapporte-plus',
        quote: 'Les commerces les plus rentables miseront sur des marges supérieures à 30%',
      },
      {
        title: 'Section 11 – Commerce de gros et grande distribution',
        url: 'https://observatoire-prixmarges.franceagrimer.fr/sites/default/files/pictures/microsoft_word_-_16_2025_section_11_commerce_et_gms_v4.docx_.pdf',
        quote: 'Marge brute variable selon secteur : 27% (alimentaire) à 60% (services)',
      },
    ],
    note: 'La marge varie fortement selon le secteur : mode (50-60%), électronique (20-30%), alimentaire (20-30%). 40% représente une moyenne pour l\'e-commerce généraliste.',
  },
  b2bSales: {
    value: 75,
    description: 'Marge brute logiciel B2B / SaaS enterprise',
    sources: [
      {
        title: 'SaaS gross margin explained - Stripe',
        url: 'https://stripe.com/resources/more/saas-gross-margin-explained-what-it-is-and-why-it-is-important',
        quote: 'A good SaaS gross margin is greater than 70%, with 75%+ typically considered good',
      },
      {
        title: 'KPI SAAS - Rainmakers',
        url: 'https://www.rainmakers.fi/2022/11/22/kpi-saas-lesquels-suivre-et-pourquoi/',
        quote: 'Au-delà de 75% en SaaS pour être considéré comme une entreprise efficace',
      },
    ],
  },
  costReduction: {
    value: 100,
    description: 'Économies pures = 100% de marge',
    sources: [
      {
        title: 'Automatisation et IA : Réduction des coûts - min8conseil',
        url: 'https://www.min8conseil.com/blog-de-loptimisation-des-charges/blog-post-title-two-jmtzl-lhx47-wp5jz-4z7a4-9lww7',
        quote: 'Réduction des coûts de 15 à 25% selon les secteurs grâce à l\'automatisation',
      },
      {
        title: 'Réduction des coûts infrastructure - Bluesoft',
        url: 'https://www.bluesoft-group.com/en/reduction-des-couts-infrastructure/',
        quote: 'Jusqu\'à 70% de réduction des coûts d\'infrastructure cloud',
      },
    ],
    note: 'Les économies de coûts sont des gains purs (pas de COGS). 1€ économisé = 1€ de profit, donc marge = 100%.',
  },
};

export const SALARY_SOURCES = {
  developer: {
    junior: {
      grossAnnual: 40000,
      totalCost: 50000,
      description: 'Développeur junior (0-2 ans d\'expérience)',
    },
    confirmed: {
      grossAnnual: 52000,
      totalCost: 67000,
      description: 'Développeur confirmé (3-5 ans d\'expérience)',
    },
    senior: {
      grossAnnual: 65000,
      totalCost: 84000,
      description: 'Développeur senior (5+ ans d\'expérience)',
    },
    sources: [
      {
        title: 'Salaire d\'un développeur web en France en 2025',
        url: 'https://www.1001interims.com/blog/salaire-dun-developpeur-web-en-france-en-2025-les-chiffres-%F0%9F%92%BB/',
        quote: 'Junior : 40 000€ brut/an. Confirmé : 52 000€. Senior : 65 000€ avec charges à +43%',
      },
      {
        title: 'TJM Développeur en France en 2025',
        url: 'https://www.portage360.fr/tjm-developpeur-en-france/',
        quote: 'TJM entre 300-400€ (junior), 400-550€ (confirmé), 550-800€+ (senior)',
      },
    ],
  },
  productManager: {
    junior: {
      grossAnnual: 46000,
      totalCost: 60000,
      description: 'Product Manager junior',
    },
    confirmed: {
      grossAnnual: 60000,
      totalCost: 78000,
      description: 'Product Manager confirmé',
    },
    senior: {
      grossAnnual: 70000,
      totalCost: 91000,
      description: 'Product Manager senior',
    },
    sources: [
      {
        title: 'Salaire Product Manager 2025 - Noé',
        url: 'https://www.noe.pm/post/le-salaire-de-product-manager-combien-est-paye-un-pm-noe',
        quote: 'Salaire moyen PM : 60 000€ brut/an (fourchette 44-75k€)',
      },
      {
        title: 'Quel salaire pour un Product Manager en 2025 - Maestro',
        url: 'https://maestro.mariaschools.com/post/quel-salaire-product-manager',
        quote: 'Junior : 46k€. Confirmé : 45-60k€. Senior : 70k€+',
      },
    ],
  },
  designer: {
    junior: {
      grossAnnual: 43500,
      totalCost: 56500,
      description: 'Product Designer junior',
    },
    confirmed: {
      grossAnnual: 47500,
      totalCost: 61750,
      description: 'Product Designer confirmé',
    },
    senior: {
      grossAnnual: 63500,
      totalCost: 82500,
      description: 'Product Designer senior',
    },
    sources: [
      {
        title: 'Le salaire du Product Designer - Data Recrutement',
        url: 'https://datarecrutement.fr/actualites/metiers/le-salaire-du-product-designer/',
        quote: 'Salaire moyen Product Designer : 47 500€/an en France (2025)',
      },
      {
        title: 'Salaire Product Designer - Glassdoor',
        url: 'https://www.glassdoor.fr/Salaires/product-designer-salaire-SRCH_KO0,16.htm',
        quote: 'Junior : 43 500€. Confirmé : 41-55k€. Senior : 63 500€ (55-70k€)',
      },
      {
        title: 'Salaire UX, UI, Brand et Product Designer en 2025',
        url: 'https://ux-ui.fr/ux-ui-product-designer-salaire/',
        quote: 'Environ 10 000 Product Designers en France en 2025',
      },
    ],
  },
  charges: {
    rate: 0.43,
    description: 'Taux de charges patronales moyen en France',
    sources: [
      {
        title: 'Quel est le coût d\'un salarié en 2025 - Legalstart',
        url: 'https://www.legalstart.fr/fiches-pratiques/fiscalite-entreprises/cout-salarie/',
        quote: 'Les charges patronales représentent entre 25% et 43% du salaire brut',
      },
      {
        title: 'Calcul du coût d\'un salarié - PayFit',
        url: 'https://payfit.com/fr/fiches-pratiques/comment-calculer-le-cout-dun-salarie/',
        quote: 'Super-brut = salaire brut + cotisations patronales (~42%)',
      },
    ],
  },
};

/**
 * Calcul du coût total chargé (salaire brut + charges patronales)
 */
export function calculateTotalCost(grossSalary: number, chargesRate: number = 0.43): number {
  return Math.round(grossSalary * (1 + chargesRate));
}

/**
 * Obtenir le texte formaté pour une infobulle de marge
 */
export function getMarginTooltipText(businessModel: 'saas' | 'ecommerce' | 'b2bSales' | 'costReduction'): string {
  const data = MARGIN_SOURCES[businessModel];
  const sourcesText = data.sources
    .map((s) => `• ${s.quote}`)
    .join('\n');

  const note = 'note' in data ? data.note : '';
  return `${data.description}\n\n${sourcesText}${note ? '\n\n' + note : ''}`;
}

/**
 * Obtenir le texte formaté pour une infobulle de salaire
 */
export function getSalaryTooltipText(role: 'developer' | 'productManager' | 'designer'): string {
  const data = SALARY_SOURCES[role];
  const chargesData = SALARY_SOURCES.charges;

  const formatMonthly = (annual: number) => Math.round(annual / 12).toLocaleString('fr-FR');

  return `Coûts moyens France 2025 (charges patronales ~${chargesData.rate * 100}%) :

📊 Junior
• Salaire brut : ${formatMonthly(data.junior.grossAnnual)}€/mois (${data.junior.grossAnnual.toLocaleString('fr-FR')}€/an)
• Coût total employeur : ${formatMonthly(data.junior.totalCost)}€/mois (${data.junior.totalCost.toLocaleString('fr-FR')}€/an)

📊 Confirmé
• Salaire brut : ${formatMonthly(data.confirmed.grossAnnual)}€/mois (${data.confirmed.grossAnnual.toLocaleString('fr-FR')}€/an)
• Coût total employeur : ${formatMonthly(data.confirmed.totalCost)}€/mois (${data.confirmed.totalCost.toLocaleString('fr-FR')}€/an)

📊 Senior
• Salaire brut : ${formatMonthly(data.senior.grossAnnual)}€/mois (${data.senior.grossAnnual.toLocaleString('fr-FR')}€/an)
• Coût total employeur : ${formatMonthly(data.senior.totalCost)}€/mois (${data.senior.totalCost.toLocaleString('fr-FR')}€/an)`;
}
