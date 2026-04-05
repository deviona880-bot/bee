'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/blog', { params: { page, limit: 6 } });
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Erreur:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Notre Blog</h1>
          <p className="text-xl">Conseils, actualités et inspiration du monde naturel</p>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Chargement des articles...</p>
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <article key={blog._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                    <div className="bg-gray-300 h-48 flex items-center justify-center overflow-hidden">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="text-4xl bg-gray-300 w-full h-full flex items-center justify-center" style={{ display: blog.image ? 'none' : 'flex' }}>📰</div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                          {blog.category || 'Article'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <Link href={`/blog/${blog._id}`} className="text-primary hover:text-secondary font-semibold">
                          Lire Plus →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded ${
                        page === p
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Aucun article trouvé</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
