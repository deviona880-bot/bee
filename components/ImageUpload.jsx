'use client';

import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { uploadImage, validateImageFile, getImagePlaceholder } from '@/lib/imageHelper';

export default function ImageUpload({ onUpload, placeholder = 'product', currentImage = null, label = 'Image' }) {
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const placeholderEmoji = getImagePlaceholder(placeholder);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validate file
      validateImageFile(file);

      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      const imageUrl = await uploadImage(file);
      onUpload(imageUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUpload(null);
    setError('');
    setSuccess(false);
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold text-gray-700">{label}</label>

      {/* Preview */}
      <div className="relative w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary transition">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            {!loading && (
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                <X size={18} />
              </button>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">{placeholderEmoji}</div>
            <p className="text-sm text-gray-600">Cliquez pour ajouter une image</p>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
        id={`image-upload-${label}`}
      />
      <label
        htmlFor={`image-upload-${label}`}
        className="block w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold text-center cursor-pointer hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Upload en cours...' : 'Choisir Image'}
      </label>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ✗ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <Check size={18} /> Image téléchargée avec succès!
        </div>
      )}

      {/* File Info */}
      <p className="text-xs text-gray-500">
        Formats acceptés: JPG, PNG, GIF, WebP | Taille max: 5MB
      </p>
    </div>
  );
}
