'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await apiClient.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Gestion des Commandes</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-bold">ID</th>
              <th className="px-6 py-3 text-left font-bold">Client</th>
              <th className="px-6 py-3 text-left font-bold">Total</th>
              <th className="px-6 py-3 text-left font-bold">Statut</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
              <th className="px-6 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-6 py-4 text-sm">{order._id.substring(0, 8)}</td>
                <td className="px-6 py-4">{order.userId?.name || 'N/A'}</td>
                <td className="px-6 py-4">{order.totalAmount.toFixed(2)} €</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="pending">En Attente</option>
                    <option value="processing">Traitement</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-600">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
