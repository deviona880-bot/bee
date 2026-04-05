'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: 'apiculture',
    stock: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data);
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

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('❌ Format invalide. Utilisez: JPG, PNG, GIF ou WebP');
      return;
    }

    // Validate file size (5MB max)
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
      formDataUpload.append('folder', 'products');

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

    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.type) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    try {
      // Convert to proper types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : 0
      };

      console.log('📤 Données envoyées:', {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        type: productData.type,
        stock: productData.stock
      });

      if (editingId) {
        await apiClient.put(`/products/${editingId}`, productData);
        setSuccess('Produit mis à jour avec succès!');
      } else {
        await apiClient.post('/products', productData);
        setSuccess('Produit créé avec succès!');
      }
      fetchProducts();
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        type: 'apiculture',
        stock: '',
        image: ''
      });
      setEditingId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Erreur complète:', err);

      // Parse detailed error message
      let errorMsg = 'Erreur lors de la sauvegarde';

      if (err.response?.data?.errors) {
        // Express-validator response
        errorMsg = err.response.data.errors
          .map(e => `${e.field}: ${e.message}`)
          .join(' | ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setError(`❌ ${errorMsg}`);
      console.error('📋 Réponse du serveur:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      type: product.type,
      stock: product.stock,
      image: product.image || ''
    });
    setEditingId(product._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        setSuccess('Produit supprimé avec succès!');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const typeLabels = {
    apiculture: '🐝 Apiculture',
    cosmétiques: '✨ Cosmétiques',
    travaux_forestiers: '🌲 Travaux Forestiers'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-2">{products.length} produits au total</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', category: '', type: 'apiculture', stock: '', image: '' });
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus size={20} /> Nouveau Produit
        </button>
      </div>

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
              {editingId ? '✏️ Modifier Produit' : '➕ Ajouter Produit'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Nom du Produit*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Miel Bio Premium"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description courte du produit"
                  required
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Prix (€)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">-- Sélect Catégorie --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="apiculture">🐝 Apiculture</option>
                  <option value="cosmétiques">✨ Cosmétiques</option>
                  <option value="travaux_forestiers">🌲 Travaux Forestiers</option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">📷 Image du Produit</label>
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

              {/* Buttons */}
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
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      type: 'apiculture',
                      stock: '',
                      image: ''
                    });
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
          {products.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Image</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Nom</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Prix</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Stock</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy="0.3em" font-size="40" fill="%23999"%3E📦%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-lg">📦</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {typeLabels[product.type]}
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          {product.price.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 5 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition font-semibold"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition font-semibold"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
              <p className="text-gray-500 text-sm mt-2">Cliquez sur "Nouveau Produit" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
