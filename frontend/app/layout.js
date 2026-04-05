import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Naturel & Abeilles - Travaux Forestiers, Cosmétiques & Apiculture',
  description: 'Découvrez nos services de travaux forestiers, produits cosmétiques naturels et produits apicoles de qualité.',
  keywords: 'naturel, abeilles, miel, cosmétiques, travaux forestiers, apiculture',
  openGraph: {
    title: 'Naturel & Abeilles',
    description: 'Services forestiers, cosmétiques et apicoles de qualité',
    url: 'https://naturel-abeilles.fr',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
