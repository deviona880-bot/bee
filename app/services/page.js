'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Services() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const services = [
    {
      id: 'travaux_forestiers',
      title: 'Travaux Forestiers',
      icon: '🌲',
      description: 'Services complets de gestion forestière et d\'aménagement paysager',
      features: [
        'Élagage et taille professionnelle',
        'Déboisement responsable',
        'Entretien des espaces verts',
        'Gestion durable des forêts',
        'Conseil et audit forestier',
        'Travaux d\'accessibilité'
      ],
      longDescription: 'Notre équipe de forestiers expérimentés offre une gamme complète de services adaptés aux besoins des propriétaires, des municipalités et des entreprises. Nous utilisons des techniques modernes et respectueuses de l\'environnement pour assurer une gestion optimale de vos espaces forestiers.'
    },
    {
      id: 'cosmétiques',
      title: 'Produits Cosmétiques Naturels',
      icon: '✨',
      description: 'Gamme premium de cosmétiques bio et naturels',
      features: [
        'Crèmes et sérums biologiques',
        'Savons artisanaux naturels',
        'Shampooings et soins capillaires',
        'Produits de maquillage écologiques',
        'Soins pour peaux sensibles',
        'Cosmétiques certifiés bio'
      ],
      longDescription: 'Tous nos produits cosmétiques sont fabriqués à partir d\'ingrédients naturels et biologiques. Nous ne testez jamais sur les animaux et nos emballages sont entièrement recyclables. Chaque produit est formulé pour maximiser les bienfaits naturels tout en respectant votre peau.'
    },
    {
      id: 'apiculture',
      title: 'Produits Apicoles Premium',
      icon: '🐝',
      description: 'Miel et produits d\'exception de nos ruches',
      features: [
        'Miel multiflore premium',
        'Pollen frais collecté',
        'Propolis brute et purifiée',
        'Gelée royale de qualité',
        'Cire d\'abeille naturelle',
        'Compléments à base de miel'
      ],
      longDescription: 'Nos produits apicoles proviennent de ruches bien entretenues dans un environnement naturel préservé. Chaque produit est récolté, traité et emballé avec soin pour préserver toutes ses propriétés nutritionnelles et thérapeutiques.'
    }
  ];

  const selectedService = services.find(s => s.id === type) || services[0];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-xl">Solutions naturelles et durables pour tous vos besoins</p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services?type=${service.id}`}
                className={`p-8 rounded-lg transition ${
                  selectedService.id === service.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white shadow hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className={selectedService.id === service.id ? 'text-gray-100' : 'text-gray-600'}>
                  {service.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Selected Service Details */}
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">{selectedService.title}</h2>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {selectedService.longDescription}
                </p>

                <h3 className="text-2xl font-bold mb-6">Services Inclus :</h3>
                <ul className="space-y-3 mb-8">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-primary" size={24} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                  Demanderun Devis <ArrowRight size={20} />
                </Link>
              </div>

              <div className="bg-white rounded-lg h-96 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-8xl mb-4">{selectedService.icon}</div>
                  <p className="text-gray-600">{selectedService.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Besoin de Nos Services ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contactez-nous pour en savoir plus ou recevoir un devis personnalisé pour votre projet.
          </p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Nous Contacter <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
