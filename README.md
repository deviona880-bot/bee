# Naturel & Abeilles - Application Web Complète

Une application web moderne et complète pour une entreprise spécialisée en travaux forestiers, cosmétiques naturels et apiculture.

## 🎯 Caractéristiques

### Pour les Clients (Frontend)
- ✅ Site web responsive et moderne
- ✅ Page d'accueil avec héros et services
- ✅ Page À Propos avec présentation d'équipe
- ✅ Page Services détaillée
- ✅ Catalogue de produits avec filtres
- ✅ Panier et système de commande
- ✅ Blog avec articles
- ✅ Formulaire de contact
- ✅ Système d'authentification (Login/Register)
- ✅ Profil utilisateur
- ✅ Design Premium avec Tailwind CSS

### Pour les Administrateurs
- ✅ Tableau de bord statistiques
- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion des catégories
- ✅ Gestion des commandes
- ✅ Gestion des utilisateurs
- ✅ Publication d'articles blog
- ✅ Gestion des messages de contact
- ✅ Gestion de l'équipe

### Backend
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ Base de données MongoDB
- ✅ Architecture MVC
- ✅ Validation des données
- ✅ Error handling robuste

## 🛠 Stack Technologique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: JavaScript/JSX

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

### DevOps
- Environment Variables (.env)
- Cloudinary pour images

## 📋 Architecture du Projet

```
bees/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Blog.js
│   │   ├── Contact.js
│   │   └── Team.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── blogController.js
│   │   ├── contactController.js
│   │   └── teamController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── blog.js
│   │   ├── contact.js
│   │   └── team.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.js (Home)
│   │   ├── about/page.js
│   │   ├── services/page.js
│   │   ├── products/page.js
│   │   ├── blog/page.js
│   │   ├── contact/page.js
│   │   ├── cart/page.js
│   │   ├── checkout/page.js
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── admin/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── products/page.js
│   │   │   ├── categories/page.js
│   │   │   ├── orders/page.js
│   │   │   ├── users/page.js
│   │   │   ├── blog/page.js
│   │   │   ├── contact/page.js
│   │   │   └── team/page.js
│   │   ├── globals.css
│   │   └── layout.js
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── lib/
│   │   └── apiClient.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── jsconfig.json
│   ├── .env.example
│   └── .gitignore
```

## 🚀 Installation et Setup

### Prérequis
- Node.js 16+
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos configurations
nano .env

# Lancer le serveur
npm run dev
```

### Configuration Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bees
JWT_SECRET=votre-clé-secrète-très-longue
CLOUDINARY_NAME=votre-cloudinary-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Créer le fichier .env.local
cp .env.example .env.local

# Éditer .env.local avec vos configurations
nano .env.local

# Lancer le serveur dev
npm run dev
```

### Configuration Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=Naturel & Abeilles
NEXT_PUBLIC_CONTACT_EMAIL=contact@naturel-abeilles.fr
NEXT_PUBLIC_PHONE=+33 1 23 45 67 89
NEXT_PUBLIC_ADDRESS=123 Rue de la Nature, 75000 Paris, France
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Produits
- `GET /api/products` - Lister les produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer (Admin)
- `PUT /api/products/:id` - Modifier (Admin)
- `DELETE /api/products/:id` - Supprimer (Admin)

### Catégories
- `GET /api/categories` - Lister les catégories
- `POST /api/categories` - Créer (Admin)
- `PUT /api/categories/:id` - Modifier (Admin)
- `DELETE /api/categories/:id` - Supprimer (Admin)

### Commandes
- `GET /api/orders` - Lister (Admin)
- `GET /api/orders/my-orders` - Mes commandes (Utilisateur)
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut (Admin)

### Utilisateurs
- `GET /api/users` - Lister (Admin)
- `GET /api/users/profile` - Mon profil
- `PUT /api/users/profile` - Mettre à jour profil
- `DELETE /api/users/:id` - Supprimer (Admin)

### Blog
- `GET /api/blog` - Lister les articles
- `GET /api/blog/:id` - Détails d'un article
- `POST /api/blog` - Créer (Admin)
- `PUT /api/blog/:id` - Modifier (Admin)
- `DELETE /api/blog/:id` - Supprimer (Admin)

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Lister (Admin)
- `PUT /api/contact/:id/status` - Mettre à jour statut (Admin)
- `DELETE /api/contact/:id` - Supprimer (Admin)

### Équipe
- `GET /api/team` - Lister l'équipe
- `POST /api/team` - Créer (Admin)
- `PUT /api/team/:id` - Modifier (Admin)
- `DELETE /api/team/:id` - Supprimer (Admin)

## 👤 Accès Admin

Pour accéder au tableau de bord admin :
1. S'inscrire sur `/register`
2. Accéder directement à `/admin/login` avec un compte admin
3. Accéder au dashboard à `/admin`

**Note**: La création du premier admin se fait en modifiant directement la base de données MongoDB en changeant le rôle à "admin".

## 🎨 Couleurs et Design

- **Primaire**: #8B7355 (Marron naturel)
- **Secondaire**: #D4A574 (Ambre)
- **Accent**: #F4D35E (Miel)
- **Miel**: #FFB84D (Orange miel)

## 📝 Contenu en Français

Tous les textes du site sont générés en français professionnel :
- Pages publiques
- Interface admin
- Emails
- Messages d'erreur

## 🔒 Sécurité

- Passwords hashasés avec bcryptjs
- JWT pour authentification
- CORS configuré
- Validation des données
- Protection des routes admin

## 📦 Déploiement

### Frontend (Vercel)
```bash
npm run build
# Déployer via Vercel CLI ou tableau de bord
```

### Backend (Heroku, Railway, ou autre)
```bash
npm start
```

## 🤝 Contribution

Les contributions sont bienvenues. Veuillez créer une branche pour vos changements et soumettre une pull request.

## 📄 Licence

Propriété de Naturel & Abeilles - 2024

## 🆘 Support

Pour toute question ou problème, veuillez contacter : support@naturel-abeilles.fr

---


