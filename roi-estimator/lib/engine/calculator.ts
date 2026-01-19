import {
  InitiativeInputs,
  RiskInputs,
  ConfidenceInputs,
  ScenarioResult,
  CalculationResult,
  ScenarioType,
  RampUpPeriod,
} from '@/types';

/**
 * Core calculation engine for ROI Estimator
 * Implements the P&L bridge model from PRD section 9
 */

export class ROICalculator {
  /**
   * Calculate ramp-up coefficient based on period
   */
  private static getRampUpCoefficients(
    period: RampUpPeriod,
    months: number
  ): number[] {
    const coeffs = new Array(months).fill(0);

    switch (period) {
      case 'instant':
        return coeffs.map(() => 1);

      case '3-months':
        for (let i = 0; i < months; i++) {
          if (i < 3) {
            coeffs[i] = (i + 1) / 3;
          } else {
            coeffs[i] = 1;
          }
        }
        break;

      case '6-months':
        for (let i = 0; i < months; i++) {
          if (i < 6) {
            coeffs[i] = (i + 1) / 6;
          } else {
            coeffs[i] = 1;
          }
        }
        break;

      case '12-months':
        for (let i = 0; i < months; i++) {
          if (i < 12) {
            coeffs[i] = (i + 1) / 12;
          } else {
            coeffs[i] = 1;
          }
        }
        break;
    }

    return coeffs;
  }

  /**
   * Calculate confidence score (0-100)
   * Based on PRD section 9: Confidence score
   */
  static calculateConfidenceScore(inputs: ConfidenceInputs): number {
    let score = 100;

    // Data quality impact
    switch (inputs.dataQuality) {
      case 'measured':
        score -= 0;
        break;
      case 'partial':
        score -= 20;
        break;
      case 'estimated':
        score -= 40;
        break;
    }

    // Dependencies impact
    switch (inputs.dependencies) {
      case 'none':
        score -= 0;
        break;
      case '1-2':
        score -= 15;
        break;
      case '3+':
        score -= 30;
        break;
    }

    // Uplift nature impact
    switch (inputs.upliftNature) {
      case 'ab-test':
        score -= 0;
        break;
      case 'analogy':
        score -= 15;
        break;
      case 'intuition':
        score -= 30;
        break;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate scenario multipliers based on confidence
   */
  private static getScenarioMultipliers(
    scenario: ScenarioType,
    confidenceScore: number
  ): { uplift: number; rampSpeed: number; riskImpact: number } {
    const confidenceFactor = confidenceScore / 100;

    if (scenario === 'conservative') {
      return {
        uplift: 0.5 + (0.2 * confidenceFactor),
        rampSpeed: 0.7,
        riskImpact: 1.3,
      };
    } else if (scenario === 'aggressive') {
      return {
        uplift: 1.2 + (0.3 * confidenceFactor),
        rampSpeed: 1.3,
        riskImpact: 0.7,
      };
    } else {
      return {
        uplift: 1.0,
        rampSpeed: 1.0,
        riskImpact: 1.0,
      };
    }
  }

  /**
   * Calculate risk penalty factor
   */
  private static calculateRiskPenalty(
    risks: RiskInputs,
    riskImpact: number
  ): number {
    const avgRisk = (risks.marketRisk + risks.technicalRisk + risks.timeToMarketRisk) / 3;
    // Convert from 1-5 scale to percentage (1=0%, 5=100% risk)
    const normalizedRisk = (avgRisk - 1) / 4; // Maps 1->0, 5->1
    const riskFactor = 1 - normalizedRisk * 0.3; // Max 30% penalty
    return Math.pow(riskFactor, riskImpact);
  }

  /**
   * Calculate delta revenue based on initiative inputs
   */
  private static calculateDeltaRevenue(
    inputs: InitiativeInputs,
    upliftMultiplier: number
  ): number {
    const effectiveUplift = inputs.uplift * upliftMultiplier;
    const incrementalVolume = inputs.reach * (effectiveUplift / 100);
    const monthlyRevenue = incrementalVolume * inputs.unitValue;
    return monthlyRevenue * 12; // Annualized
  }

  /**
   * Calculate total delivery cost
   */
  private static calculateDeliveryCost(inputs: InitiativeInputs): number {
    return (
      inputs.deliveryCost.people *
      inputs.deliveryCost.timeMonths *
      inputs.deliveryCost.monthlyCost
    );
  }

  /**
   * Calculate scenario result
   */
  private static calculateScenario(
    inputs: InitiativeInputs,
    risks: RiskInputs,
    scenario: ScenarioType,
    confidenceScore: number
  ): ScenarioResult {
    const multipliers = this.getScenarioMultipliers(scenario, confidenceScore);
    const riskPenalty = this.calculateRiskPenalty(risks, multipliers.riskImpact);

    // Calculate delta revenue
    const annualDeltaRevenue =
      this.calculateDeltaRevenue(inputs, multipliers.uplift) * riskPenalty;

    // Calculate costs
    const deliveryCost = this.calculateDeliveryCost(inputs);
    const annualRunCost = inputs.runCost * 12;

    // Calculate gross profit
    const grossProfit = annualDeltaRevenue * (inputs.grossMargin / 100);

    // Calculate net profit
    const annualProfit = grossProfit - annualRunCost;
    const totalProfit = annualProfit * (inputs.horizon / 12) - deliveryCost;

    // Calculate contribution margin
    const contributionMargin = grossProfit;

    // Calculate ROI
    const totalInvestment = deliveryCost + annualRunCost * (inputs.horizon / 12);
    const roi12 = ((annualProfit - deliveryCost) / deliveryCost) * 100;
    const roi24 =
      totalInvestment > 0
        ? ((annualProfit * 2 - deliveryCost) / totalInvestment) * 100
        : 0;
    const roi36 =
      totalInvestment > 0
        ? ((annualProfit * 3 - deliveryCost) / totalInvestment) * 100
        : 0;

    // Calculate payback
    const paybackMonths =
      annualProfit > 0 ? (deliveryCost / (annualProfit / 12)) : 999;

    // Calculate cumulative cashflow
    const rampUpCoeffs = this.getRampUpCoefficients(inputs.rampUp, inputs.horizon);
    const cumulativeCashflow = [];
    let cumulative = -deliveryCost;

    for (let month = 0; month < inputs.horizon; month++) {
      const monthlyProfit =
        (annualProfit / 12) * rampUpCoeffs[month] * multipliers.rampSpeed;
      cumulative += monthlyProfit;
      cumulativeCashflow.push({
        month: month + 1,
        value: cumulative,
      });
    }

    return {
      scenario,
      annualProfit,
      totalProfit,
      contributionMargin,
      roi12,
      roi24,
      roi36,
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      cumulativeCashflow,
    };
  }

  /**
   * Generate insights from calculation
   */
  private static generateInsights(
    inputs: InitiativeInputs,
    risks: RiskInputs,
    confidence: ConfidenceInputs
  ): {
    topDrivers: string[];
    criticalAssumptions: string[];
    dominantRisks: string[];
  } {
    const topDrivers = [];
    const criticalAssumptions = [];
    const dominantRisks = [];

    // Identify top drivers
    if (inputs.uplift > 20) {
      topDrivers.push(`High uplift expectation (${inputs.uplift}%)`);
    }
    if (inputs.grossMargin > 70) {
      topDrivers.push(`Strong gross margin (${inputs.grossMargin}%)`);
    }
    if (inputs.reach > 10000) {
      topDrivers.push(`Large reach (${inputs.reach.toLocaleString()} units)`);
    }

    // Critical assumptions
    if (confidence.dataQuality === 'estimated') {
      criticalAssumptions.push('Data quality is estimated - validate with real metrics');
    }
    if (confidence.upliftNature === 'intuition') {
      criticalAssumptions.push('Uplift based on intuition - run A/B test to validate');
    }
    if (inputs.deliveryCost.timeMonths > 6) {
      criticalAssumptions.push(
        `Long delivery timeline (${inputs.deliveryCost.timeMonths} months) - ensure scope control`
      );
    }

    // Dominant risks
    const riskLevels = [
      { name: 'Market risk', value: risks.marketRisk },
      { name: 'Technical risk', value: risks.technicalRisk },
      { name: 'Time-to-market risk', value: risks.timeToMarketRisk },
    ];
    const highRisks = riskLevels.filter((r) => r.value >= 7);
    dominantRisks.push(...highRisks.map((r) => `${r.name} is high (${r.value}/10)`));

    return {
      topDrivers: topDrivers.slice(0, 3),
      criticalAssumptions: criticalAssumptions.slice(0, 3),
      dominantRisks: dominantRisks.slice(0, 3),
    };
  }

  /**
   * Main calculation function
   */
  static calculate(
    initiative: InitiativeInputs,
    risks: RiskInputs,
    confidence: ConfidenceInputs,
    reportId: string
  ): CalculationResult {
    const confidenceScore = this.calculateConfidenceScore(confidence);

    const scenarios = {
      conservative: this.calculateScenario(
        initiative,
        risks,
        'conservative',
        confidenceScore
      ),
      base: this.calculateScenario(initiative, risks, 'base', confidenceScore),
      aggressive: this.calculateScenario(
        initiative,
        risks,
        'aggressive',
        confidenceScore
      ),
    };

    const insights = this.generateInsights(initiative, risks, confidence);

    return {
      initiative,
      risks,
      confidence,
      confidenceScore,
      scenarios,
      insights,
      createdAt: new Date(),
      reportId,
    };
  }
}
