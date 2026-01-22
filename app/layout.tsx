import type { Metadata } from 'next';
import './globals.css';
import { FloatingLogo } from '@/components/ui/FloatingLogo';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Delva ROI Estimator - Arrêtez les suppositions, générez du profit',
  description: 'Créez des business cases sponsor-ready en moins de 3 minutes. Transformez vos métriques produit en impact P&L avec scénarios et scores de confiance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light" style={{ colorScheme: 'light' }}>
      <body className="antialiased bg-gray-50">
        {children}
        <FloatingLogo />
        <ToastContainer />
      </body>
    </html>
  );
}
