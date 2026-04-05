'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Trash2 } from 'lucide-react';

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get('/contact');
      setMessages(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await apiClient.put(`/contact/${id}/status`, { status });
      fetchMessages();
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await apiClient.delete(`/contact/${id}`);
        fetchMessages();
        setSelectedMessage(null);
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Messages de Contact</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?._id === msg._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <h4 className="font-bold">{msg.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    msg.status === 'new' ? 'bg-red-100 text-red-700' :
                    msg.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {msg.status === 'new' ? 'Nouveau' : msg.status === 'read' ? 'Lu' : 'Répondu'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedMessage.subject}</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-semibold text-gray-600">De:</label>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Email:</label>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:text-secondary">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Téléphone:</label>
                  <p>{selectedMessage.phone || '-'}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Message:</label>
                  <p className="mt-2 p-4 bg-gray-50 rounded">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedMessage.status}
                  onChange={(e) => updateStatus(selectedMessage._id, e.target.value)}
                  disabled={updatingId === selectedMessage._id}
                  className="flex-1 px-3 py-2 border rounded"
                >
                  <option value="new">Nouveau</option>
                  <option value="read">Lu</option>
                  <option value="responded">Répondu</option>
                </select>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-3 bg-red-100 hover:bg-red-200 rounded text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              Sélectionnez un message pour voir les détails
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
