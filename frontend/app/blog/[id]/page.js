'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { ArrowLeft } from 'lucide-react';

export default function BlogDetail({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const res = await apiClient.get(`/blog/${params.id}`);
      setBlog(res.data);
    } catch (err) {
      setError('Article non trouvé');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Chargement de l'article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 text-lg mb-6">{error}</p>
        <Link href="/blog" className="text-primary hover:text-secondary font-semibold">
          ← Retour au blog
        </Link>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div>
      {/* Hero with Image */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="flex items-center gap-2 text-primary hover:text-secondary mb-6 font-semibold">
            <ArrowLeft size={20} />
            Retour au blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
            {blog.category && <span>•</span>}
            {blog.category && <span className="text-primary font-semibold">{blog.category}</span>}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.image && (
        <div className="bg-gray-200 h-96 flex items-center justify-center overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {blog.excerpt && (
          <div className="mb-8 p-6 bg-blue-50 border-l-4 border-primary rounded">
            <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-12">
          {blog.content}
        </div>

        {/* Metadata */}
        <div className="border-t-2 border-gray-200 pt-8 mt-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">À propos de cet article</h3>
            <p className="text-sm text-gray-600">
              Publié le {new Date(blog.createdAt).toLocaleDateString('fr-FR')}
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <> - Modifié le {new Date(blog.updatedAt).toLocaleDateString('fr-FR')}</>
              )}
            </p>
            {blog.author && (
              <p className="text-sm text-gray-600 mt-2">
                Par <span className="font-semibold">{blog.author.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg">
            <ArrowLeft size={20} />
            Retour aux articles
          </Link>
        </div>
      </article>
    </div>
  );
}
