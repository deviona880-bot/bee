'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide footer on admin pages
    if (pathname?.startsWith('/admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);

  if (isAdmin) {
    return null;
  }

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const address = process.env.NEXT_PUBLIC_ADDRESS;
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
  const companyDescription = process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL;
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">{companyName}</h3>
            <p className="text-sm text-gray-200">
              {companyDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent transition">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-accent transition">Services</Link></li>
              <li><Link href="/products" className="hover:text-accent transition">Produits</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services?type=travaux_forestiers" className="hover:text-accent transition">Travaux Forestiers</Link></li>
              <li><Link href="/services?type=cosmétiques" className="hover:text-accent transition">Cosmétiques</Link></li>
              <li><Link href="/services?type=apiculture" className="hover:text-accent transition">Apiculture</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${email}`} className="hover:text-accent transition">{email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href={`tel:${phone}`} className="hover:text-accent transition">{phone}</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-gray-400 pt-8 flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm text-gray-200">&copy; 2024 {companyName}. Tous droits réservés.</p>
          <div className="flex gap-4">
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition" title="Facebook">
                <Facebook size={20} />
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition" title="Twitter">
                <Twitter size={20} />
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition" title="Instagram">
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
