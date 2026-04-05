'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function About() {
  const [team, setTeam] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    apiClient.get('/team')
      .then(res => {
        console.log('Team data loaded from about:', res.data);
        setTeam(res.data);
      })
      .catch(err => console.error('Erreur:', err));
  }, []);

  const handleImageError = (memberId) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
    console.log(`Image failed to load for member: ${memberId}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">À Propos de Nous</h1>
          <p className="text-xl">Découvrez l'histoire et la mission de Naturel & Abeilles</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Notre Histoire</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Fondée en 2015, Naturel & Abeilles est née d'une passion commune pour la nature et l'entrepreneuriat responsable.
                Ce qui a commencé comme une petite entreprise familiale s'est transformé en un leader régional dans les services
                forestiers, les cosmétiques naturels et l'apiculture.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Notre objectif : offrir des produits et services de qualité supérieure tout en préservant l'environnement. Chaque
                décision que nous prenons est guidée par nos valeurs de durabilité, d'éthique et d'excellence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Aujourd'hui, nous servons plus de 5 000 clients satisfaits et continuons à croître en tant qu'acteur responsable
                du changement positif.
              </p>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <span className="text-6xl">📖</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-4">Notre Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                Fournir des solutions naturelles, durables et de haute qualité qui enrichissent la vie de nos clients tout en
                contribuant à la protection et à la préservation de notre environnement.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">Notre Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                Devenir la référence en France pour les entreprises conscientes de l'environnement, reconnaissables par l'excellenc
                de leurs produits et services ainsi que leur engagement envers la durabilité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Notre Équipe</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.length > 0 ? (
              team.map((member) => (
                <div key={member._id} className="text-center">
                  <div className="bg-gray-300 h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {member.image && !imageErrors[member._id] ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(member._id)}
                      />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center">
                <p className="text-gray-600">Chargement de l'équipe...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">9+</p>
              <p className="text-lg">Années d'Expérience</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">5K+</p>
              <p className="text-lg">Clients Satisfaits</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-lg">Produits</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100%</p>
              <p className="text-lg">Satisfaction Garantie</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
