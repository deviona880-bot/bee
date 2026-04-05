'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = cart.map(item =>
      item._id === id ? { ...item, quantity } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item._id !== id);
    updateCart(updated);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.20;
  };

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">Mon Panier</h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-2xl font-bold mb-6">Votre panier est vide</p>
              <Link href="/products" className="btn-primary inline-block">
                Continuer votre Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  {cart.map((item) => (
                    <div key={item._id} className="border-b p-6 flex gap-6">
                      <div className="bg-gray-200 w-24 h-24 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        <p className="text-primary font-bold">{item.price.toFixed(2)} €</p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} />
                        </button>

                        <div className="flex items-center gap-2 border rounded">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-bold text-lg">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                  <h2 className="text-2xl font-bold mb-6">Résumé de la Commande</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-semibold">{calculateTotal().toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-semibold">9,99 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA (20%)</span>
                      <span className="font-semibold">{calculateTax().toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{(calculateTotal() + 9.99 + calculateTax()).toFixed(2)} €</span>
                  </div>

                  <Link href="/checkout" className="w-full btn-primary block text-center mb-4">
                    Procéder au Paiement
                  </Link>

                  <Link href="/products" className="w-full btn-secondary text-center block">
                    Continuer votre Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
