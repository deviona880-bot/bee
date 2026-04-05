'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, Sparkles, Beaker } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl font-bold mb-6">Naturel & Abeilles</h1>
              <p className="text-xl mb-4 text-gray-100">
                Découvrez l'excellence française en travaux forestiers, cosmétiques naturels et produits apicoles premium.
              </p>
              <p className="text-lg mb-8 text-gray-100">
                Depuis 2015, nous cultivons une passion pour la nature et offrons des solutions durables et responsables.
              </p>
              <div className="flex gap-4">
                <Link href="/products" className="btn-primary flex items-center gap-2">
                  Explorer les Produits <ArrowRight size={20} />
                </Link>
                <Link href="/contact" className="btn-secondary flex items-center gap-2">
                  Nous Contacter
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🌿🐝🧴</div>
                <p className="text-gray-600">Solutions Naturelles & Durables</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Nos Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Travaux Forestiers */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition slide-up">
              <div className="text-4xl mb-4">🌲</div>
              <h3 className="text-2xl font-bold mb-4">Travaux Forestiers</h3>
              <p className="text-gray-600 mb-6">
                Services forestiers professionnels : entretien, élagage, déboisement responsable et gestion durable des espaces verts.
              </p>
              <Link href="/services?type=travaux_forestiers" className="text-primary font-semibold hover:text-secondary flex items-center gap-2">
                En Savoir Plus <ArrowRight size={20} />
              </Link>
            </div>

            {/* Cosmétiques */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition slide-up">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">Cosmétiques Naturels</h3>
              <p className="text-gray-600 mb-6">
                Gamme complète de produits cosmétiques bio, fabriqués à partir d'ingrédients naturels et responsables pour votre beauté.
              </p>
              <Link href="/services?type=cosmetiques" className="text-primary font-semibold hover:text-secondary flex items-center gap-2">
                Découvrir <ArrowRight size={20} />
              </Link>
            </div>

            {/* Apiculture */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition slide-up">
              <div className="text-4xl mb-4">🐝</div>
              <h3 className="text-2xl font-bold mb-4">Produits Apicoles</h3>
              <p className="text-gray-600 mb-6">
                Miel premium, pollen, propolis et autres produits apicoles de qualité supérieure, collectés avec soin et respect.
              </p>
              <Link href="/services?type=apiculture" className="text-primary font-semibold hover:text-secondary flex items-center gap-2">
                Consulter <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Produits Vedettes</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">Produit {item}</h3>
                  <p className="text-gray-600 text-sm mb-4">Description du produit premium</p>
                  <p className="text-primary font-bold mb-4">49,99 €</p>
                  <button className="w-full btn-primary text-sm">Ajouter au Panier</button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              Voir Tous les Produits <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Nos Valeurs</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Leaf className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-bold mb-2">Durabilité</h3>
              <p className="text-gray-700">
                Engagement envers l'environnement et pratiques responsables pour protéger notre planète.
              </p>
            </div>

            <div className="text-center">
              <Sparkles className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-bold mb-2">Qualité</h3>
              <p className="text-gray-700">
                Produits et services de la plus haute qualité, testés et certifiés pour votre satisfaction.
              </p>
            </div>

            <div className="text-center">
              <Beaker className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-700">
                Recherche continue et innovation pour améliorer nos offres et nos services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à Découvrir Nos Services ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits qui font confiance à Naturel & Abeilles.
          </p>
          <Link href="/contact" className="btn-accent inline-flex items-center gap-2">
            Commencer Aujourd'hui <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
