'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit_card'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal() + 9.99,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      };

      const response = await apiClient.post('/orders', orderData);
      alert('Commande créée avec succès!');
      localStorage.removeItem('cart');
      router.push('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">Paiement</h1>
        </div>
      </section>

      {/* Checkout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Détails de Livraison</h2>

                <div className="mb-6">
                  <label className="block font-semibold mb-2">Adresse de Livraison*</label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Adresse complète..."
                  ></textarea>
                </div>

                <h3 className="text-xl font-bold mb-6 mt-8">Mode de Paiement</h3>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <span>Carte Bancaire</span>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <span>Virement Bancaire</span>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <span>PayPal</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : 'Confirmer la Commande'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>

                <div className="space-y-4 mb-6 border-b pb-6">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Votre panier est vide</p>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{calculateTotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span>9,99 €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t">
                    <span>Total</span>
                    <span className="text-primary">{(calculateTotal() + 9.99).toFixed(2)} €</span>
                  </div>
                </div>

                <Link href="/cart" className="w-full block text-center btn-secondary">
                  Retour au Panier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
