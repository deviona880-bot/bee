'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    published: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await apiClient.get('/blog/admin/all?limit=100');
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      formDataUpload.append('folder', 'blog');

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
        await apiClient.put(`/blog/${editingId}`, formData);
        setSuccess('Article mis à jour avec succès!');
      } else {
        await apiClient.post('/blog', formData);
        setSuccess('Article créé avec succès!');
      }
      fetchBlogs();
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        image: '',
        published: false
      });
      setEditingId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      image: blog.image || '',
      published: blog.published
    });
    setEditingId(blog._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      try {
        await apiClient.delete(`/blog/${id}`);
        setSuccess('Article supprimé avec succès!');
        fetchBlogs();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('❌ Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestion du Blog</h1>
          <p className="text-gray-600 mt-2">{blogs.length} articles au total</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              slug: '',
              excerpt: '',
              content: '',
              category: '',
              image: '',
              published: false
            });
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
        >
          <Plus size={20} /> Nouvel Article
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
              {editingId ? '✏️ Modifier Article' : '➕ Nouvel Article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Titre*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre de l'article"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="article-slug"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Résumé</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Résumé court de l'article"
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Contenu*</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Contenu de l'article"
                  rows="5"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Catégorie</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ex: Apiculture, Cosmétiques"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">📷 Image de l'article</label>
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

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 accent-primary rounded"
                />
                <span className="font-semibold text-gray-700">Publié</span>
              </label>

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
                      title: '',
                      slug: '',
                      excerpt: '',
                      content: '',
                      category: '',
                      image: '',
                      published: false
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
          {blogs.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Image</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Titre</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Catégorie</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Statut</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-lg">📰</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 line-clamp-2">{blog.title}</p>
                          {blog.excerpt && <p className="text-sm text-gray-600 line-clamp-1">{blog.excerpt}</p>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{blog.category || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {blog.published ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition font-semibold"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id)}
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
              <p className="text-gray-600 text-lg">Aucun article trouvé</p>
              <p className="text-gray-500 text-sm mt-2">Cliquez sur "Nouvel Article" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
