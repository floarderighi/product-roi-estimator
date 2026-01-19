'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InitiativeInputs, RiskInputs, ConfidenceInputs, CalculationResult } from '@/types';
import { ROICalculator } from '@/lib/engine/calculator';
import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { Button } from '@/components/ui/Button';
import { TopBar } from '@/components/ui/TopBar';

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

  const handleExport = async () => {
    if (!result) return;

    // Export as PDF using html2canvas and jsPDF
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    // Find the dashboard element
    const dashboardElement = document.getElementById('results-dashboard');
    if (!dashboardElement) {
      alert('Erreur lors de l\'export PDF');
      return;
    }

    // Show loading state
    const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement;
    const originalText = exportButton?.textContent;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.textContent = '⏳ Export en cours...';
    }

    try {
      // Hide advanced section if it's open to keep PDF concise
      const advancedSection = document.getElementById('advanced-section');
      const wasAdvancedVisible = advancedSection && window.getComputedStyle(advancedSection).display !== 'none';
      if (wasAdvancedVisible && advancedSection) {
        advancedSection.style.display = 'none';
      }

      // Apply PDF-optimized styles for better readability
      dashboardElement.classList.add('pdf-export-mode');

      // Create style element for PDF export with better contrast
      const styleElement = document.createElement('style');
      styleElement.id = 'pdf-export-styles';
      styleElement.textContent = `
        .pdf-export-mode {
          background: white !important;
        }
        .pdf-export-mode * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Force all text to be fully opaque and darker */
        .pdf-export-mode .text-gray-600,
        .pdf-export-mode .text-gray-500 {
          color: #1f2937 !important;
          opacity: 1 !important;
        }
        .pdf-export-mode .text-gray-700,
        .pdf-export-mode .text-gray-800 {
          color: #111827 !important;
          opacity: 1 !important;
        }
        .pdf-export-mode .text-gray-900 {
          color: #000000 !important;
          opacity: 1 !important;
        }

        /* Fix all text-sm and text-xs to be darker */
        .pdf-export-mode .text-sm,
        .pdf-export-mode .text-xs {
          color: #1f2937 !important;
          opacity: 1 !important;
        }

        /* Labels and secondary text */
        .pdf-export-mode [class*="text-sm text-gray"],
        .pdf-export-mode [class*="text-xs text-gray"] {
          color: #374151 !important;
          opacity: 1 !important;
        }

        /* Fix semi-transparent backgrounds */
        .pdf-export-mode .bg-white\\/80,
        .pdf-export-mode [class*="bg-white/"] {
          background-color: rgb(255 255 255) !important;
          backdrop-filter: none !important;
          opacity: 1 !important;
        }

        /* Ensure all colored text is visible */
        .pdf-export-mode [class*="text-indigo"] {
          color: #4f46e5 !important;
          opacity: 1 !important;
        }
        .pdf-export-mode [class*="text-green"] {
          color: #059669 !important;
          opacity: 1 !important;
        }
        .pdf-export-mode [class*="text-red"] {
          color: #dc2626 !important;
          opacity: 1 !important;
        }
        .pdf-export-mode [class*="text-blue"] {
          color: #2563eb !important;
          opacity: 1 !important;
        }
        .pdf-export-mode [class*="text-purple"] {
          color: #9333ea !important;
          opacity: 1 !important;
        }
        .pdf-export-mode [class*="text-amber"],
        .pdf-export-mode [class*="text-yellow"] {
          color: #d97706 !important;
          opacity: 1 !important;
        }

        /* Fix gradient backgrounds and ensure full opacity */
        .pdf-export-mode [class*="bg-gradient"] {
          opacity: 1 !important;
        }

        /* Ensure all backgrounds are opaque */
        .pdf-export-mode [class*="bg-green-50"],
        .pdf-export-mode [class*="bg-indigo-50"],
        .pdf-export-mode [class*="bg-blue-50"],
        .pdf-export-mode [class*="bg-purple-50"],
        .pdf-export-mode [class*="bg-gray-50"] {
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(styleElement);

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture the dashboard as canvas with high quality
      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: dashboardElement.scrollWidth,
        windowHeight: dashboardElement.scrollHeight,
      });

      // Cleanup: remove PDF styles and restore state
      const pdfStyles = document.getElementById('pdf-export-styles');
      if (pdfStyles) {
        pdfStyles.remove();
      }
      dashboardElement.classList.remove('pdf-export-mode');

      // Restore advanced section visibility
      if (wasAdvancedVisible && advancedSection) {
        advancedSection.style.display = '';
      }

      // Create PDF with proper pagination
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const margin = 10; // 10mm margin
      const contentWidth = imgWidth - (2 * margin);
      const contentHeight = pageHeight - (2 * margin);

      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = margin;

      // Add first page with margins
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        position,
        contentWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= contentHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -(pageHeight - margin);
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          position,
          contentWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= contentHeight;
      }

      // Generate filename
      const projectName = result.initiative.projectName
        ? result.initiative.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
        : result.reportId;
      const fileName = `roi-analysis-${projectName}-${new Date().toISOString().split('T')[0]}.pdf`;

      // Download PDF
      pdf.save(fileName);

      // Show success message
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
          format: 'pdf',
          projectName: result.initiative.projectName,
        });
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');

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
