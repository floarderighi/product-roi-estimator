'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CalculationResult } from '@/types';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';

export default function ReportPage() {
  const params = useParams();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reportId = params.id as string;

    // In production, this would fetch from an API
    // For MVP, we're using localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`report-${reportId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert date string back to Date object
          parsed.createdAt = new Date(parsed.createdAt);
          setResult(parsed);
        } catch (e) {
          setError('Échec du chargement du rapport');
        }
      } else {
        setError('Rapport introuvable');
      }
      setLoading(false);
    }

    // Track view event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Report Viewed', {
        reportId,
      });
    }
  }, [params.id]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert(`Lien de partage copié : ${shareUrl}`);
  };

  const handleExport = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roi-analysis-${result.reportId}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Chargement du rapport...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold mb-2">Rapport Introuvable</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Ce rapport n\'existe pas ou a été supprimé.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Créer Une Nouvelle Analyse
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ResultsDashboard
        result={result}
        onShare={handleShare}
        onExport={handleExport}
      />
    </div>
  );
}
