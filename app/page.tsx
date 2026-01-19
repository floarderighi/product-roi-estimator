'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-delva-purple-dark via-primary-900 to-delva-purple-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-delva-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Delva"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <Link href="/estimator">
            <Button size="sm" className="text-sm">
              Créer un business case
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full text-white text-sm font-semibold mb-8 border border-white/20 backdrop-blur-sm">
            <span>⚡</span>
            Business case en 3 minutes chrono
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Arrêtez de défendre vos</span>
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-primary-200 bg-clip-text text-transparent">
              initiatives produit
            </span>
            <br />
            <span className="text-white">avec des "je pense"</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-100 mb-4 max-w-3xl mx-auto">
            Transformez vos métriques produit en impact P&L avec un business case que vos sponsors comprendront.
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Profit, Payback, ROI + 3 scénarios avec risques = décision éclairée en moins de 3 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/estimator">
              <Button
                size="lg"
                className="text-lg"
              >
                Créer mon business case →
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-300">
            Utilisé par <span className="text-white font-bold">25+ Product Leaders</span> pour prioriser et sécuriser leurs budgets
          </p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-6 bg-delva-beige">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vous passez des heures sur des business cases...
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ...qui finissent souvent rejetés car "pas assez finance-friendly" ou "trop d'incertitudes"
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-delva-xl border-2 border-gray-100 hover:border-primary-500 hover:shadow-delva-lg transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-delva flex items-center justify-center mb-6">
                <span className="text-4xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Fini les heures perdues sur Excel
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Avant :</strong> 4-5 heures pour créer un business case, copier-coller des formules, debugger des erreurs.<br/><br/>
                <strong className="text-primary-600 font-semibold">Maintenant :</strong> 3 minutes top chrono avec des templates prêts à l'emploi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-delva-xl border-2 border-gray-100 hover:border-primary-500 hover:shadow-delva-lg transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-delva flex items-center justify-center mb-6">
                <span className="text-4xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Parlez le langage de vos sponsors
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Avant :</strong> "Ça va améliorer l'engagement", "Les users vont adorer"<br/><br/>
                <strong className="text-primary-600 font-semibold">Maintenant :</strong> Profit incrémental, période de payback, marge brute = validation immediate.
              </p>
            </div>

            <div className="bg-white p-8 rounded-delva-xl border-2 border-gray-100 hover:border-primary-500 hover:shadow-delva-lg transition-all">
              <div className="w-14 h-14 bg-primary-50 rounded-delva flex items-center justify-center mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Gérez l'incertitude comme un pro
              </h3>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Avant :</strong> "On est pas sûrs mais..."<br/><br/>
                <strong className="text-primary-600 font-semibold">Maintenant :</strong> 3 scénarios (Conservative/Base/Aggressive) + score de confiance + analyse des risques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Peu importe votre contexte, on a le template qu'il vous faut
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Chaque template convertit vos métriques produit (conversion, churn, win rate...) directement en impact P&L
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">SaaS (MRR/ARR)</h3>
                  <p className="text-slate-400 text-sm">
                    Réduire le churn, améliorer la rétention, augmenter l'ARPA
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">E-commerce</h3>
                  <p className="text-slate-400 text-sm">
                    Améliorer le taux de conversion, augmenter l'AOV
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-green-500/50 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">B2B Sales-led</h3>
                  <p className="text-slate-400 text-sm">
                    Améliorer le win rate, optimiser le pipeline
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-yellow-500/50 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Réduction de Coûts</h3>
                  <p className="text-slate-400 text-sm">
                    Automatisation, productivité, gains d'efficacité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Cas d'usage concrets
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-3xl mx-auto">
            Nos utilisateurs créent des business cases pour défendre leurs initiatives auprès de leurs sponsors
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💼</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Arbitrage de roadmap</h3>
              </div>
              <p className="text-slate-400 mb-3">
                "J'ai 3 initiatives sur la table. Laquelle prioriser ?"
              </p>
              <p className="text-sm text-blue-300">
                → Comparez les 3 business cases côte à côte : profit, payback, niveau de confiance. Décision éclairée en 10 minutes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Défendre un budget</h3>
              </div>
              <p className="text-slate-400 mb-3">
                "Le CFO veut des chiffres, pas des 'on pense que'"
              </p>
              <p className="text-sm text-purple-300">
                → Présentez profit incrémental, payback en X mois, ROI à 24 mois. Langage finance = validation rapide.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Aligner les stakeholders</h3>
              </div>
              <p className="text-slate-400 mb-3">
                "Les PM voient l'impact user, les sponsors veulent du €"
              </p>
              <p className="text-sm text-pink-300">
                → Un seul doc avec bridge métrique produit → P&L. Tout le monde parle le même langage.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Gérer l'incertitude</h3>
              </div>
              <p className="text-slate-400 mb-3">
                "On n'a pas de données, que des hypothèses"
              </p>
              <p className="text-sm text-green-300">
                → Score de confiance + 3 scénarios = vous montrez que vous gérez le risque au lieu de le cacher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-12 rounded-3xl border border-blue-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">
              Plus jamais de business case rejeté
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Créez votre premier business case sponsor-ready en 3 minutes. Gratuit, sans inscription.
            </p>
            <Link href="/estimator">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all"
              >
                Commencer Maintenant →
              </Button>
            </Link>
            <p className="text-sm text-slate-500 mt-6">
              Aucune inscription requise • Gratuit • Export prêt
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                D
              </div>
              <span className="text-lg font-bold text-white">DELVA ROI Estimator</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2026 Delva. Stop shipping guesses, start landing profit.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
