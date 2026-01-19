'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InitiativeInputs, RiskInputs, ConfidenceInputs, CalculationResult } from '@/types';
import { ROICalculator } from '@/lib/engine/calculator';
import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { Button } from '@/components/ui/Button';

export default function EstimatorPage() {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const router = useRouter();

  const handleFormComplete = (
    initiative: InitiativeInputs,
    risks: RiskInputs,
    confidence: ConfidenceInputs
  ) => {
    // Generate unique report ID
    const reportId = Math.random().toString(36).substring(2, 15);

    // Calculate results
    const calculationResult = ROICalculator.calculate(
      initiative,
      risks,
      confidence,
      reportId
    );

    // Store in localStorage for now (in production, would store in DB)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`report-${reportId}`, JSON.stringify(calculationResult));
    }

    setResult(calculationResult);
    setStep('results');

    // Track completion event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Initiative Completed', {
        reportId,
        businessModel: initiative.businessModel,
        confidenceScore: calculationResult.confidenceScore,
      });
    }
  };

  const handleShare = () => {
    if (!result) return;

    const shareUrl = `${window.location.origin}/report/${result.reportId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Lien de partage copié : ${shareUrl}`);

    // Track share event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Report Shared', {
        reportId: result.reportId,
      });
    }
  };

  const handleExport = () => {
    if (!result) return;

    // For MVP, export as JSON
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roi-analysis-${result.reportId}.json`;
    link.click();

    // Track export event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Report Exported', {
        reportId: result.reportId,
      });
    }
  };

  const handleNewInitiative = () => {
    setStep('form');
    setResult(null);
  };

  if (step === 'results' && result) {
    return (
      <div className="min-h-screen">
        <ResultsDashboard
          result={result}
          onShare={handleShare}
          onExport={handleExport}
        />
        <div className="max-w-6xl mx-auto px-6 pb-6">
          <Button variant="outline" onClick={handleNewInitiative}>
            Créer une Nouvelle Initiative
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <InitiativeForm onComplete={handleFormComplete} />
    </div>
  );
}
