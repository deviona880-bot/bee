'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide header on admin pages
    if (pathname?.startsWith('/admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartCount(JSON.parse(cart).length);
    }
  }, [pathname]);

  if (isAdmin) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🐝</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Naturel & Abeilles</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-primary transition">Accueil</Link>
            <Link href="/about" className="hover:text-primary transition">À Propos</Link>
            <Link href="/services" className="hover:text-primary transition">Services</Link>
            <Link href="/products" className="hover:text-primary transition">Produits</Link>
            <Link href="/blog" className="hover:text-primary transition">Blog</Link>
            <Link href="/contact" className="hover:text-primary transition">Contact</Link>
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative hover:text-primary transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="text-sm hover:text-primary transition font-semibold">
                  Mon Compte
                </Link>
                <button onClick={handleLogout} className="hover:text-primary transition" title="Déconnexion">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block hover:text-primary transition">
                <User size={24} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-primary">Accueil</Link>
            <Link href="/about" className="block py-2 hover:text-primary">À Propos</Link>
            <Link href="/services" className="block py-2 hover:text-primary">Services</Link>
            <Link href="/products" className="block py-2 hover:text-primary">Produits</Link>
            <Link href="/blog" className="block py-2 hover:text-primary">Blog</Link>
            <Link href="/contact" className="block py-2 hover:text-primary">Contact</Link>
            {user && <Link href="/dashboard" className="block py-2 hover:text-primary font-semibold">Mon Compte</Link>}
            {!user && <Link href="/login" className="block py-2 hover:text-primary">Connexion</Link>}
          </nav>
        )}
      </div>
    </header>
  );
}
