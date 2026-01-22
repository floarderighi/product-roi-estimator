'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InitiativeInputs, RiskInputs, ConfidenceInputs, CalculationResult } from '@/types';
import { ROICalculator } from '@/lib/engine/calculator';
import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { Button } from '@/components/ui/Button';
import { TopBar } from '@/components/ui/TopBar';
import { showToast } from '@/components/ui/Toast';

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
    showToast('Lien de partage copié !', 'success');

    // Track share event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Report Shared', {
        reportId: result.reportId,
      });
    }
  };

  const handleExport = async () => {
    if (!result) return;

    // Show loading state
    const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement;
    const originalText = exportButton?.textContent;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.textContent = '⏳ Export en cours...';
    }

    try {
      // Dynamically import PowerPointExporter to avoid SSR issues
      const { PowerPointExporter } = await import('@/lib/export/powerpoint');

      // Create PowerPoint presentation
      const exporter = new PowerPointExporter();
      await exporter.generate(result);

      // Show success message
      showToast('Présentation PowerPoint exportée avec succès !', 'success');

      if (exportButton) {
        exportButton.textContent = '✅ Exporté !';
        setTimeout(() => {
          if (exportButton && originalText) {
            exportButton.textContent = originalText;
          }
        }, 2000);
      }

      // Track export event
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('Report Exported', {
          reportId: result.reportId,
          format: 'pptx',
          projectName: result.initiative.projectName,
        });
      }
    } catch (error) {
      console.error('Error exporting PowerPoint:', error);
      showToast('Erreur lors de l\'export PowerPoint. Veuillez réessayer.', 'error');

      // Restore button state on error
      if (exportButton && originalText) {
        exportButton.textContent = originalText;
      }
    } finally {
      // Re-enable button
      if (exportButton) {
        exportButton.disabled = false;
      }
    }
  };

  const handleNewInitiative = () => {
    setStep('form');
    setResult(null);
  };

  if (step === 'results' && result) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <ResultsDashboard
          result={result}
          onShare={handleShare}
          onExport={handleExport}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <InitiativeForm onComplete={handleFormComplete} />
    </div>
  );
}
