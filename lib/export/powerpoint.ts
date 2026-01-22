import { CalculationResult } from '@/types';

// Load pptxgenjs from CDN dynamically
async function loadPptxGenJS() {
  if (typeof window === 'undefined') {
    throw new Error('pptxgenjs can only be loaded in the browser');
  }

  // Check if already loaded
  if ((window as any).pptxgen) {
    return (window as any).pptxgen.default || (window as any).pptxgen;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
    script.onload = () => {
      // Try different possible names
      const pptxgen = (window as any).pptxgen ||
                      (window as any).PptxGenJS ||
                      (window as any).pptxgenjs ||
                      (window as any).default;

      if (!pptxgen) {
        reject(new Error('pptxgen library not found after loading.'));
        return;
      }
      resolve(pptxgen);
    };
    script.onerror = () => {
      reject(new Error('Failed to load pptxgenjs from CDN'));
    };
    document.head.appendChild(script);
  });
}

export class PowerPointExporter {
  private pres: any;

  // Apple-style color palette
  private colors = {
    white: 'FFFFFF',
    black: '000000',
    gray900: '1D1D1F',
    gray800: '424245',
    gray700: '6E6E73',
    gray300: 'D2D2D7',
    gray100: 'F5F5F7',
    blue: '007AFF',
    green: '34C759',
    orange: 'FF9500',
    red: 'FF3B30',
    purple: 'AF52DE',
  };

  async initialize() {
    const PptxGenJS = await loadPptxGenJS();
    this.pres = new PptxGenJS();
    this.setupPresentation();
  }

  private setupPresentation() {
    // Set presentation properties
    this.pres.author = 'ROI Estimator by Delva';
    this.pres.company = 'Delva';
    this.pres.subject = 'Analyse ROI';
    this.pres.title = 'Rapport d\'Analyse ROI';

    // 16:9 aspect ratio
    this.pres.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
    this.pres.layout = 'CUSTOM';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  private addTitleSlide(result: CalculationResult) {
    const slide = this.pres.addSlide();

    // Clean white background
    slide.background = { fill: this.colors.white };

    // Minimalist title - large, bold, centered
    slide.addText(result.initiative.projectName || 'Analyse ROI', {
      x: 1,
      y: 2,
      w: 8,
      h: 1,
      fontSize: 54,
      bold: true,
      color: this.colors.gray900,
      align: 'center',
      fontFace: 'SF Pro Display',
    });

    // Subtle subtitle
    slide.addText('Analyse de Retour sur Investissement', {
      x: 1,
      y: 3.2,
      w: 8,
      h: 0.4,
      fontSize: 18,
      color: this.colors.gray700,
      align: 'center',
      fontFace: 'SF Pro Text',
    });

    // Date at bottom
    const date = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    slide.addText(date, {
      x: 1,
      y: 5,
      w: 8,
      h: 0.3,
      fontSize: 14,
      color: this.colors.gray700,
      align: 'center',
      fontFace: 'SF Pro Text',
    });
  }

  private addExecutiveSummarySlide(result: CalculationResult) {
    const slide = this.pres.addSlide();
    const baseScenario = result.scenarios.base;

    slide.background = { fill: this.colors.white };

    // Title - simple, left-aligned
    slide.addText('Résumé', {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.5,
      fontSize: 42,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    // Three key metrics - minimalist cards with subtle shadows
    const metrics = [
      {
        label: 'ROI',
        sublabel: '24 mois',
        value: this.formatPercent(baseScenario.roi24),
        color: this.colors.blue,
        x: 0.5,
      },
      {
        label: 'Profit',
        sublabel: 'Total',
        value: this.formatCurrency(baseScenario.totalProfit),
        color: this.colors.green,
        x: 3.5,
      },
      {
        label: 'Payback',
        sublabel: 'Période',
        value: `${baseScenario.paybackMonths} mois`,
        color: this.colors.purple,
        x: 6.5,
      },
    ];

    metrics.forEach((metric) => {
      // Subtle card background
      slide.addShape(this.pres.ShapeType.rect, {
        x: metric.x,
        y: 1.5,
        w: 2.8,
        h: 2.2,
        fill: { color: this.colors.gray100 },
        line: { type: 'none' },
      });

      // Metric label
      slide.addText(metric.label, {
        x: metric.x + 0.2,
        y: 1.7,
        w: 2.4,
        h: 0.3,
        fontSize: 16,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      // Sublabel
      slide.addText(metric.sublabel, {
        x: metric.x + 0.2,
        y: 1.95,
        w: 2.4,
        h: 0.25,
        fontSize: 12,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      // Large value
      slide.addText(metric.value, {
        x: metric.x + 0.2,
        y: 2.5,
        w: 2.4,
        h: 0.8,
        fontSize: 36,
        bold: true,
        color: metric.color,
        fontFace: 'SF Pro Display',
      });
    });

    // Bottom section - investment details in simple list
    const deliveryCost = result.initiative.deliveryCost.people *
                        result.initiative.deliveryCost.timeMonths *
                        result.initiative.deliveryCost.monthlyCost;

    const details = [
      { label: 'Investissement initial', value: this.formatCurrency(deliveryCost) },
      { label: 'Coût mensuel', value: this.formatCurrency(result.initiative.runCost) },
      { label: 'Profit annuel', value: this.formatCurrency(baseScenario.annualProfit) },
    ];

    let yPos = 4.2;
    details.forEach((detail) => {
      slide.addText(detail.label, {
        x: 0.7,
        y: yPos,
        w: 4,
        h: 0.3,
        fontSize: 14,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      slide.addText(detail.value, {
        x: 5,
        y: yPos,
        w: 4.3,
        h: 0.3,
        fontSize: 14,
        bold: true,
        color: this.colors.gray900,
        align: 'right',
        fontFace: 'SF Pro Display',
      });

      yPos += 0.35;
    });
  }

  private addScenariosSlide(result: CalculationResult) {
    const slide = this.pres.addSlide();

    slide.background = { fill: this.colors.white };

    // Title
    slide.addText('Scénarios', {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.5,
      fontSize: 42,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    // Three scenario columns - ultra clean
    const scenarios = [
      {
        label: 'Conservateur',
        data: result.scenarios.conservative,
        x: 0.5,
        color: this.colors.orange,
      },
      {
        label: 'Base',
        data: result.scenarios.base,
        x: 3.5,
        color: this.colors.blue,
      },
      {
        label: 'Optimiste',
        data: result.scenarios.aggressive,
        x: 6.5,
        color: this.colors.green,
      },
    ];

    scenarios.forEach((scenario) => {
      // Colored top bar
      slide.addShape(this.pres.ShapeType.rect, {
        x: scenario.x,
        y: 1.5,
        w: 2.8,
        h: 0.1,
        fill: { color: scenario.color },
        line: { type: 'none' },
      });

      // Card background
      slide.addShape(this.pres.ShapeType.rect, {
        x: scenario.x,
        y: 1.6,
        w: 2.8,
        h: 2.8,
        fill: { color: this.colors.gray100 },
        line: { type: 'none' },
      });

      // Scenario label
      slide.addText(scenario.label, {
        x: scenario.x + 0.2,
        y: 1.8,
        w: 2.4,
        h: 0.3,
        fontSize: 18,
        bold: true,
        color: this.colors.gray900,
        fontFace: 'SF Pro Display',
      });

      // ROI value
      slide.addText(this.formatPercent(scenario.data.roi24), {
        x: scenario.x + 0.2,
        y: 2.4,
        w: 2.4,
        h: 0.6,
        fontSize: 42,
        bold: true,
        color: scenario.color,
        fontFace: 'SF Pro Display',
      });

      slide.addText('ROI 24 mois', {
        x: scenario.x + 0.2,
        y: 3,
        w: 2.4,
        h: 0.25,
        fontSize: 12,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      // Payback
      slide.addText(`${scenario.data.paybackMonths}`, {
        x: scenario.x + 0.2,
        y: 3.5,
        w: 2.4,
        h: 0.4,
        fontSize: 28,
        bold: true,
        color: this.colors.gray900,
        fontFace: 'SF Pro Display',
      });

      slide.addText('mois de payback', {
        x: scenario.x + 0.2,
        y: 3.9,
        w: 2.4,
        h: 0.25,
        fontSize: 12,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });
    });

    // Risk indicator at bottom - simple and clean
    const avgRisk = (result.risks.marketRisk + result.risks.technicalRisk + result.risks.timeToMarketRisk) / 3;
    const riskColor = avgRisk <= 2 ? this.colors.green : avgRisk <= 3.5 ? this.colors.orange : this.colors.red;
    const riskLabel = avgRisk <= 2 ? 'Risque faible' : avgRisk <= 3.5 ? 'Risque modéré' : 'Risque élevé';

    slide.addText('Niveau de risque', {
      x: 0.7,
      y: 4.8,
      w: 4,
      h: 0.3,
      fontSize: 14,
      color: this.colors.gray700,
      fontFace: 'SF Pro Text',
    });

    slide.addText(riskLabel, {
      x: 5,
      y: 4.8,
      w: 4.3,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: riskColor,
      align: 'right',
      fontFace: 'SF Pro Display',
    });
  }

  private addDetailsSlide(result: CalculationResult) {
    const slide = this.pres.addSlide();

    slide.background = { fill: this.colors.white };

    // Title
    slide.addText('Détails', {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.5,
      fontSize: 42,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    // Two columns layout
    // Left: Delivery
    slide.addText('Delivery', {
      x: 0.7,
      y: 1.5,
      w: 4,
      h: 0.3,
      fontSize: 18,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    const deliveryCost = result.initiative.deliveryCost.people *
                        result.initiative.deliveryCost.timeMonths *
                        result.initiative.deliveryCost.monthlyCost;

    const deliveryDetails = [
      { label: 'Équipe', value: `${result.initiative.deliveryCost.people} personnes` },
      { label: 'Durée', value: `${result.initiative.deliveryCost.timeMonths} mois` },
      { label: 'Coût mensuel', value: this.formatCurrency(result.initiative.deliveryCost.monthlyCost) },
      { label: 'Total', value: this.formatCurrency(deliveryCost), highlight: true },
    ];

    let yPos = 2;
    deliveryDetails.forEach((item) => {
      slide.addText(item.label, {
        x: 0.9,
        y: yPos,
        w: 2,
        h: 0.3,
        fontSize: 13,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      slide.addText(item.value, {
        x: 3,
        y: yPos,
        w: 1.5,
        h: 0.3,
        fontSize: 13,
        bold: item.highlight,
        color: item.highlight ? this.colors.blue : this.colors.gray900,
        align: 'right',
        fontFace: 'SF Pro Text',
      });

      yPos += 0.35;
    });

    // Right: Business Model
    slide.addText('Business Model', {
      x: 5.3,
      y: 1.5,
      w: 4,
      h: 0.3,
      fontSize: 18,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    const businessDetails = [
      { label: 'Type', value: result.initiative.businessModel.toUpperCase() },
      { label: 'Baseline', value: result.initiative.baseline.toLocaleString() },
      { label: 'Reach', value: result.initiative.reach.toLocaleString() },
      { label: 'Uplift', value: `${result.initiative.uplift}%` },
    ];

    yPos = 2;
    businessDetails.forEach((item) => {
      slide.addText(item.label, {
        x: 5.5,
        y: yPos,
        w: 2,
        h: 0.3,
        fontSize: 13,
        color: this.colors.gray700,
        fontFace: 'SF Pro Text',
      });

      slide.addText(item.value, {
        x: 7.6,
        y: yPos,
        w: 1.7,
        h: 0.3,
        fontSize: 13,
        bold: false,
        color: this.colors.gray900,
        align: 'right',
        fontFace: 'SF Pro Text',
      });

      yPos += 0.35;
    });

    // Total investment at bottom - highlighted box
    const totalCost = deliveryCost + (result.initiative.runCost * result.initiative.horizon);

    slide.addShape(this.pres.ShapeType.rect, {
      x: 0.5,
      y: 4.3,
      w: 9,
      h: 0.8,
      fill: { color: this.colors.blue },
      line: { type: 'none' },
    });

    slide.addText(`Investissement total (${result.initiative.horizon} mois)`, {
      x: 0.7,
      y: 4.5,
      w: 6,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: this.colors.white,
      fontFace: 'SF Pro Display',
    });

    slide.addText(this.formatCurrency(totalCost), {
      x: 6.7,
      y: 4.5,
      w: 2.6,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: this.colors.white,
      align: 'right',
      fontFace: 'SF Pro Display',
    });
  }

  private addInsightsSlide(result: CalculationResult) {
    const slide = this.pres.addSlide();

    slide.background = { fill: this.colors.white };

    // Title
    slide.addText('Insights', {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.5,
      fontSize: 42,
      bold: true,
      color: this.colors.gray900,
      fontFace: 'SF Pro Display',
    });

    // Confidence indicator
    const confidenceColor = result.confidenceScore >= 80 ? this.colors.green :
                           result.confidenceScore >= 60 ? this.colors.orange : this.colors.red;

    slide.addShape(this.pres.ShapeType.rect, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 0.6,
      fill: { color: this.colors.gray100 },
      line: { type: 'none' },
    });

    slide.addText('Niveau de confiance', {
      x: 0.7,
      y: 1.7,
      w: 4,
      h: 0.3,
      fontSize: 16,
      color: this.colors.gray700,
      fontFace: 'SF Pro Text',
    });

    const confidenceLabel = result.confidenceScore >= 80 ? 'Élevé' :
                           result.confidenceScore >= 60 ? 'Moyen' : 'Faible';

    slide.addText(confidenceLabel, {
      x: 5,
      y: 1.7,
      w: 4.3,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: confidenceColor,
      align: 'right',
      fontFace: 'SF Pro Display',
    });

    let yPos = 2.5;

    // Top drivers
    if (result.insights.topDrivers && result.insights.topDrivers.length > 0) {
      slide.addText('Principaux leviers', {
        x: 0.7,
        y: yPos,
        w: 8.6,
        h: 0.3,
        fontSize: 18,
        bold: true,
        color: this.colors.gray900,
        fontFace: 'SF Pro Display',
      });

      yPos += 0.5;

      result.insights.topDrivers.slice(0, 3).forEach((driver) => {
        slide.addText(`•  ${driver}`, {
          x: 0.9,
          y: yPos,
          w: 8,
          h: 0.3,
          fontSize: 14,
          color: this.colors.gray700,
          fontFace: 'SF Pro Text',
        });
        yPos += 0.35;
      });
    }

    yPos += 0.3;

    // Critical assumptions
    if (result.insights.criticalAssumptions && result.insights.criticalAssumptions.length > 0) {
      slide.addText('Hypothèses critiques', {
        x: 0.7,
        y: yPos,
        w: 8.6,
        h: 0.3,
        fontSize: 18,
        bold: true,
        color: this.colors.gray900,
        fontFace: 'SF Pro Display',
      });

      yPos += 0.5;

      result.insights.criticalAssumptions.slice(0, 2).forEach((assumption) => {
        slide.addText(`•  ${assumption}`, {
          x: 0.9,
          y: yPos,
          w: 8,
          h: 0.3,
          fontSize: 14,
          color: this.colors.gray700,
          fontFace: 'SF Pro Text',
        });
        yPos += 0.35;
      });
    }
  }

  private addClosingSlide() {
    const slide = this.pres.addSlide();

    slide.background = { fill: this.colors.white };

    // Simple, centered closing
    slide.addText('Merci', {
      x: 1,
      y: 2.3,
      w: 8,
      h: 0.8,
      fontSize: 54,
      bold: true,
      color: this.colors.gray900,
      align: 'center',
      fontFace: 'SF Pro Display',
    });

    // Small footer
    slide.addText('ROI Estimator by Delva', {
      x: 1,
      y: 5,
      w: 8,
      h: 0.3,
      fontSize: 12,
      color: this.colors.gray700,
      align: 'center',
      fontFace: 'SF Pro Text',
    });
  }

  public async generate(result: CalculationResult): Promise<void> {
    // Initialize pptxgenjs
    await this.initialize();

    // Add all slides
    this.addTitleSlide(result);
    this.addExecutiveSummarySlide(result);
    this.addScenariosSlide(result);
    this.addDetailsSlide(result);
    this.addInsightsSlide(result);
    this.addClosingSlide();

    // Generate filename
    const projectName = result.initiative.projectName
      ? result.initiative.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
      : result.reportId;
    const fileName = `roi-analysis-${projectName}-${new Date().toISOString().split('T')[0]}.pptx`;

    // Save the presentation
    await this.pres.writeFile({ fileName });
  }
}
