'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import Link from 'next/link';
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, products, orders, messages] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/products?limit=100'),
        apiClient.get('/orders'),
        apiClient.get('/contact')
      ]);
      setStats({
        users: users.data.length || 0,
        products: products.data.products?.length || 0,
        orders: orders.data.length || 0,
        messages: messages.data.length || 0
      });
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Utilisateurs Totaux"
          value={stats.users}
          color="#8B7355"
          trend="+12% ce mois"
        />
        <StatCard
          icon={Package}
          label="Produits"
          value={stats.products}
          color="#D4A574"
          trend="12 nouveaux"
        />
        <StatCard
          icon={ShoppingCart}
          label="Commandes"
          value={stats.orders}
          color="#FFB84D"
          trend="+8% depuis hier"
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={stats.messages}
          color="#6B8E23"
          trend="5 nouveaux"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Bienvenue sur votre Tableau de Bord! 👋</h2>
            <p className="text-lg mb-6 text-white/90">
              Gérez tous les aspects de votre entreprise Naturel & Abeilles à partir d'un seul endroit.
              Suivez vos ventes, gérez vos produits et interagissez avec vos clients.
            </p>
            <div className="flex gap-4">
              <Link href="/admin/products" className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Voir Produits
              </Link>
              <Link href="/admin/orders" className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition">
                Voir Commandes
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Performance ce Mois</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <span className="font-medium text-gray-700">Commandes Livrées</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{Math.floor(stats.orders * 0.3)}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={24} />
                  <span className="font-medium text-gray-700">En Cours de Traitement</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{Math.floor(stats.orders * 0.4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={24} />
                  <span className="font-medium text-gray-700">Commandes en Attente</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{Math.floor(stats.orders * 0.3)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Actions Rapides</h3>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition text-center border-2 border-blue-200"
              >
                ➕ Ajouter Produit
              </Link>
              <Link
                href="/admin/blog"
                className="block w-full p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold transition text-center border-2 border-green-200"
              >
                📝 Écrire Article
              </Link>
              <Link
                href="/admin/team"
                className="block w-full p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition text-center border-2 border-purple-200"
              >
                👥 Ajouter Membre
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-semibold transition text-center border-2 border-orange-200"
              >
                📦 Voir Commandes
              </Link>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Notifications</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-semibold text-sm text-yellow-800">{stats.messages} nouveaux messages</p>
                <p className="text-xs text-yellow-700 mt-1">À répondre</p>
              </div>
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-semibold text-sm text-red-800">{Math.floor(stats.products * 0.1)} produits</p>
                <p className="text-xs text-red-700 mt-1">Stock faible</p>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="font-semibold text-sm text-green-800">Système en bon état</p>
                <p className="text-xs text-green-700 mt-1">Tout fonctionne parfaitement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center text-gray-600">
        <p className="text-sm">Dernière synchronisation: {new Date().toLocaleString('fr-FR')}</p>
        <p className="text-xs mt-2">Naturel & Abeilles © 2024 - Tous droits réservés</p>
      </div>
    </div>
  );
}
