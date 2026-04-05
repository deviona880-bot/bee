'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { ArrowLeft, Edit2, X, Check, AlertCircle, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'admin') {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        apiClient.get('/users/profile'),
        apiClient.get('/orders/my-orders')
      ]);

      setUser(profileRes.data);
      setEditData({
        name: profileRes.data.name,
        email: profileRes.data.email,
        phone: profileRes.data.phone || '',
        address: profileRes.data.address || ''
      });
      setOrders(ordersRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put('/users/profile', editData);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess('Profil mis à jour avec succès!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
      return;
    }

    setCancelingOrder(orderId);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? response.data.order : o));
      setSuccess('Commande annulée avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation');
    } finally {
      setCancelingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours de traitement';
      case 'shipped':
        return 'Expédié';
      case 'delivered':
        return 'Livré';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-secondary mb-4">
          <ArrowLeft size={20} />
          Retour à l'accueil
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Mon Compte</h1>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center gap-3">
          <span>✓</span>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profil</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Modifier"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    placeholder="+33 6 XX XX XX XX"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Adresse</label>
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                    placeholder="Votre adresse complète"
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50"
                  >
                    <Check size={18} />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 flex items-center justify-center gap-2 btn-secondary"
                  >
                    <X size={18} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-semibold text-gray-900">{user.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-semibold text-gray-900">{user.address || 'Non renseignée'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Commandes</h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Commande ID</p>
                        <p className="font-mono text-lg font-semibold text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Articles</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          <p>{item.productId?.name || 'Produit'} x {item.quantity} - {(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Montant total</p>
                        <p className="text-xl font-bold text-primary">{order.totalAmount.toFixed(2)} €</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Adresse de livraison</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {['pending', 'processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancelingOrder === order._id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition font-semibold disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                        {cancelingOrder === order._id ? 'Annulation...' : 'Annuler la commande'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Vous n'avez pas de commandes</p>
                <Link href="/products" className="text-primary hover:text-secondary font-semibold">
                  Parcourir nos produits →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
