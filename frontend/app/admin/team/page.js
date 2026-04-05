'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Edit, Trash2, AlertCircle } from 'lucide-react';

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await apiClient.get('/team');
      setTeam(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('❌ Format invalide. Utilisez: JPG, PNG, GIF ou WebP');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('❌ Fichier trop volumineux. Max 5MB');
      return;
    }

    setImageUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'team');

      const res = await apiClient.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.data?.url) {
        setFormData(prev => ({ ...prev, image: res.data.data.url }));
        setSuccess('✅ Image uploadée avec succès!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(`❌ Erreur upload: ${err.response?.data?.message || 'Réessayez'}`);
      console.error('Upload error:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await apiClient.put(`/team/${editingId}`, formData);
        setSuccess('Membre mis à jour avec succès!');
      } else {
        await apiClient.post('/team', formData);
        setSuccess('Membre créé avec succès!');
      }
      fetchTeam();
      setFormData({ name: '', role: '', bio: '', image: '', email: '', phone: '' });
      setEditingId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image: member.image || '',
      email: member.email || '',
      phone: member.phone || ''
    });
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
      try {
        await apiClient.delete(`/team/${id}`);
        setSuccess('Membre supprimé avec succès!');
        fetchTeam();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('❌ Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8">Gestion de l'Équipe</h1>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center gap-3">
          <span>✓</span>
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingId ? '✏️ Modifier Membre' : '➕ Ajouter Membre'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Nom*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom du membre"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Poste*</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Titre du poste"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Biographie</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Biographie du membre"
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 XX XX XX XX"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">👤 Photo du membre</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">Max 5MB - JPG, PNG, GIF, WebP</p>

                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3 p-2 bg-gray-100 rounded-lg">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-xs text-red-600 hover:text-red-800 mt-2 w-full text-center"
                    >
                      ✕ Supprimer l'image
                    </button>
                  </div>
                )}

                {imageUploading && (
                  <div className="mt-2 text-sm text-primary">
                    ⏳ Upload en cours...
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Sauvegarde...' : editingId ? 'Mettre à Jour' : 'Ajouter'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', role: '', bio: '', image: '', email: '', phone: '' });
                  }}
                  className="w-full btn-secondary font-semibold"
                >
                  Annuler
                </button>
              )}
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {team.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {team.map((member) => (
                <div key={member._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">👤</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                          <p className="text-primary font-semibold">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition font-semibold"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition font-semibold"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        {member.email && <p>📧 {member.email}</p>}
                        {member.phone && <p>📞 {member.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">Aucun membre trouvé</p>
              <p className="text-gray-500 text-sm mt-2">Cliquez sur "Ajouter Membre" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
