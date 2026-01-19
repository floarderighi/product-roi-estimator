import { Button } from './Button';
import Image from 'next/image';

export function ContactSection() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
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
            <div className="text-purple-600 font-semibold mb-1">Delivery & Metrics</div>
            <div className="text-sm text-gray-600">
              Optimisation des processus et mesure d'impact
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.delva.co/contacter-delva"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="primary" size="lg">
              Prendre rendez-vous
            </Button>
          </a>
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
