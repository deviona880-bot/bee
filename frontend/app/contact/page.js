'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const address = process.env.NEXT_PUBLIC_ADDRESS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Nous Contacter</h1>
          <p className="text-xl">Nous sommes là pour vous aider</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Informations de Contact</h2>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-4">
                  <Mail className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <a href={`mailto:${email}`} className="text-primary hover:text-secondary">
                      {email}
                    </a>
                    <p className="text-gray-600 text-sm mt-2">Nous répondons sous 24h</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <Phone className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                    <a href={`tel:${phone}`} className="text-primary hover:text-secondary">
                      {phone}
                    </a>
                    <p className="text-gray-600 text-sm mt-2">Lun-Ven: 9h-18h</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <MapPin className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Adresse</h3>
                    <p className="text-gray-700">{address}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 bg-gray-300 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Carte interactive</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Envoyez-nous un Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  ✓ Votre message a été envoyé avec succès. Nous vous répondrons bientôt!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-semibold mb-2">Nom Complet*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+33..."
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-semibold mb-2">Sujet*</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Sujet de votre message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-semibold mb-2">Message*</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer le Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
