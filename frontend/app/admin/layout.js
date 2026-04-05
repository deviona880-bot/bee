'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Menu, X, Home, Package, Layers, ShoppingCart, Users, BookOpen, MessageSquare, Users2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading || !user) return null;

  const menuItems = [
    { href: '/admin', label: 'Tableau de Bord', icon: Home },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/categories', label: 'Catégories', icon: Layers },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/blog', label: 'Blog', icon: BookOpen },
    { href: '/admin/contact', label: 'Messages', icon: MessageSquare },
    { href: '/admin/team', label: 'Équipe', icon: Users2 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${menuOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-primary to-secondary text-white transition-all duration-300 shadow-lg fixed h-screen overflow-y-auto`}>
        {/* Logo section */}
        <div className="p-4 flex justify-between items-center border-b border-white/20">
          <Link href="/admin" className={`font-bold text-2xl flex items-center gap-2 ${!menuOpen && 'hidden'}`}>
            <span className="text-2xl">🐝</span>
            Admin
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/20 rounded-lg transition">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-white/30 border-l-4 border-white font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {menuOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-gradient-to-t from-black/20 to-transparent">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/20 transition ${
              !menuOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {menuOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${menuOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <div className="bg-white shadow-md sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Panneau d'Administration</h1>
              <p className="text-gray-600 text-sm mt-1">Gérez votre entreprise Naturel & Abeilles</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
