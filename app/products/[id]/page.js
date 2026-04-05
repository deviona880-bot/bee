'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await apiClient.get(`/products/${params.id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity}x ${product.name} ajouté au panier!`);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-2xl text-gray-600">Produit non trouvé</p>
        <Link href="/products" className="btn-primary">
          Retour aux Produits
        </Link>
      </div>
    );
  }

  const type = {
    apiculture: '🐝 Apiculture',
    cosmétiques: '✨ Cosmétiques',
    travaux_forestiers: '🌲 Travaux Forestiers'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="flex items-center gap-2 text-primary hover:text-secondary mb-4">
            <ArrowLeft size={20} />
            Retour aux Produits
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center h-96 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="text-center" style={{ display: product.image ? 'none' : 'block' }}>
                  <div className="text-8xl mb-4">📦</div>
                  <p className="text-gray-600">{product.name}</p>
                </div>
              </div>

              {/* Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.gallery.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-2 h-24 flex items-center justify-center">
                      <span className="text-2xl">📷</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="mb-6">
                <span className="text-sm font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">
                  {type[product.type]}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < (product.rating || 4) ? 'fill-accent text-accent' : 'text-gray-300'}
                  />
                ))}
                <span className="text-gray-600">({product.rating || 4}/5)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-5xl font-bold text-primary mb-2">{product.price.toFixed(2)} €</p>
                <p className="text-gray-600">TTC - Livraison gratuite pour commandes {`>`} 50€</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                {product.longDescription && (
                  <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {product.stock > 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 font-semibold">✓ En stock ({product.stock} disponibles)</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 font-semibold">✗ Rupture de stock</p>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-l border-r focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={addToCart}
                      className="btn-primary flex items-center gap-2 flex-1"
                    >
                      <ShoppingCart size={20} />
                      Ajouter au Panier
                    </button>
                  </div>

                  <button className="btn-secondary w-full">
                    Acheter Maintenant
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-accent rounded-lg p-6">
                <h4 className="font-bold mb-3">Avantages</h4>
                <ul className="space-y-2 text-sm">
                  <li>✓ Produit 100% naturel et biologique</li>
                  <li>✓ Livraison rapide (2-5 jours ouvrables)</li>
                  <li>✓ Garantie satisfaction client</li>
                  <li>✓ Retour gratuit sous 30 jours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Produits Similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="bg-gray-200 h-48 flex items-center justify-center rounded-t-lg">
                    <span className="text-4xl">📦</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Produit Similaire {i}</h3>
                    <p className="text-primary font-bold mb-3">49,99 €</p>
                    <button className="w-full btn-primary text-sm">Voir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
