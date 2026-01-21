'use client';

import { Button } from './Button';
import Image from 'next/image';
import { useEffect } from 'react';

export function ContactSection() {
  useEffect(() => {
    // Cal.com embed script
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });
    (window as any).Cal.ns["30min"]("ui", {
      "cssVarsPerTheme": { "light": { "cal-brand": "#7b00ff" } },
      "hideEventTypeDetails": false,
      "layout": "month_view"
    });
  }, []);

  const founders = [
    {
      name: 'Jérôme Granon',
      title: 'ex CPO @Napta',
      role: 'CEO & CO-FONDATEUR',
      linkedin: 'https://www.linkedin.com/in/jeromegranon/',
      image: '/jerome.jpeg'
    },
    {
      name: 'Florian Ardérighi',
      title: 'ex Head of Product @Smallable',
      role: 'COO & CO-FONDATEUR',
      linkedin: 'https://www.linkedin.com/in/florian-arderighi/',
      image: '/florian.jpeg'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-purple-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="Delva"
              width={160}
              height={53}
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Besoin d'accompagnement ?
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            Delva est un cabinet de conseil spécialisé en{' '}
            <span className="font-semibold text-purple-700">Product Management</span>
          </p>
          <p className="text-gray-600 mb-6">
            Nous vous accompagnons dans la transformation de vos idées en produits à succès,
            de la stratégie à l'exécution. Notre expertise vous aide à maximiser la valeur
            de vos investissements produit et à prendre les meilleures décisions.
          </p>
        </div>

        {/* Founders Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Nos fondateurs</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {founders.map((founder) => (
              <a
                key={founder.name}
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 hover:border-purple-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-purple-100">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{founder.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{founder.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                      {founder.role}
                    </span>
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-purple-600 font-semibold mb-1">Stratégie Produit</div>
            <div className="text-sm text-gray-600">
              Définition de vision, roadmap et priorisation
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-purple-600 font-semibold mb-1">Discovery & Validation</div>
            <div className="text-sm text-gray-600">
              Recherche utilisateur et tests de concepts
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-purple-600 font-semibold mb-1">Delivery & Growth</div>
            <div className="text-sm text-gray-600">
              Optimisation des processus et mesure d'impact
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            data-cal-link="florian-delva/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view"}'
          >
            Prendre rendez-vous
          </Button>
          <a
            href="https://www.delva.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="secondary" size="lg">
              En savoir plus
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
