# 📋 Guide de Setup Complet - Naturel & Abeilles

## 🖥️ Système d'exploitation et prérequis recommandés

- **Système**: Windows 10+, macOS 10.15+, ou Linux
- **Node.js**: v16 ou plus récent
- **npm**: v7 ou plus récent
- **Git**: Pour le contrôle de version
- **MongoDB**: v4.4+ (local ou cloud)

## 📥 Installation de l'Environnement

### 1. Installer Node.js
- Télécharger depuis [nodejs.org](https://nodejs.org)
- Choisir la version LTS
- Vérifier l'installation:
```bash
node --version
npm --version
```

### 2. Installer MongoDB

#### Option A: MongoDB Compasse (Local)
- Télécharger depuis [mongodb.com/products/compass](https://www.mongodb.com/try/download/compass)
- Installer et lancer
- Créer une nouvelle base de données `bees`

#### Option B: MongoDB Atlas (Cloud)
- Créer un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Créer un cluster gratuit
- Obtenir la chaîne de connexion

### 3. Configurer les Clés Cloudinary
- S'inscrire sur [cloudinary.com](https://cloudinary.com)
- Copier les identifiants de son dashboard

## 🚀 Installation du Backend

### Étape 1: Cloner le projet
```bash
cd chemin/vers/vos/projets
git clone <url-du-repo>
cd bees/backend
```

### Étape 2: Installer les dépendances
```bash
npm install
```

### Étape 3: Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditer le fichier `.env` (**IMPORTANT** - Ne pas oublier ces configurations):

```env
# Port du serveur
PORT=5000

# MongoDB - Utiliser l'URI local ou Atlas
MONGO_URI=mongodb://localhost:27017/bees
# OU pour MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bees

# Clé secrète JWT - À générer
JWT_SECRET=super-secret-key-changez-moi-en-production-$(date +%s)

# Cloudinary (optionnel pour images)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Étape 4: Lancer le serveur
```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

✅ Le serveur doit s'afficher: `Serveur en cours d'exécution sur le port 5000`

### Test de l'API
```bash
curl http://localhost:5000/api/health
# Doit retourner: {"status":"API en ligne"...}
```

## 🎨 Installation du Frontend

### Étape 1: Accéder au dossier frontend
```bash
cd ../frontend
```

### Étape 2: Installer les dépendances
```bash
npm install
```

### Étape 3: Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Éditer `.env.local`:

```env
# URL de l'API (Doit correspondre au backend)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Informations du site
NEXT_PUBLIC_SITE_NAME=Naturel & Abeilles
NEXT_PUBLIC_CONTACT_EMAIL=contact@naturel-abeilles.fr
NEXT_PUBLIC_PHONE=+33 1 23 45 67 89
NEXT_PUBLIC_ADDRESS=123 Rue de la Nature, 75000 Paris, France
```

### Étape 4: Lancer le serveur frontend
```bash
npm run dev
```

✅ Accéder à l'application: http://localhost:3000

## 🔐 Créer un Compte Admin

### Méthode 1: Via Base de Données (Recommandé pour première connexion)

1. S'inscrire normalement sur http://localhost:3000/register
2. Accéder à MongoDB:
   - Ouvrir MongoDB Compass ou Atlas
   - Naviguer vers la collection `users`
   - Trouver l'utilisateur créé
   - Changer le champ `role` de "user" à "admin"
3. Se reconnecter pour accéder à `/admin`

### Méthode 2: Via Base de Données Directement
```bash
# Dans MongoDB Compass ou via terminal:
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

## 📦 Peupler la Base de Données

### Créer des Catégories
1. Aller à http://localhost:3000/admin (après login admin)
2. Cliquer sur "Catégories"
3. Ajouter:
   - Travaux Forestiers
   - Cosmétiques
   - Apiculture

### Ajouter des Produits
1. Aller à "Produits" dans le dashboard
2. Créer au moins 5-10 produits par catégorie
3. Lier à une catégorie
4. Définir un prix, stock et description

### Ajouter l'Équipe
1. Aller à "Équipe" dans le dashboard
2. Ajouter au moins 3-4 membres

### Publier des Articles Blog
1. Aller à "Blog" dans le dashboard
2. Créer quelques articles
3. Cocher "Publié"

## 🧪 Tests de Funktionalité

### Tester le Frontend
- [ ] Page d'accueil chargée
- [ ] Navigation fonctionnelle
- [ ] Produits affichés
- [ ] Panier fonctionnel
- [ ] Login/Register fonctionnel
- [ ] Dashboard admin accessible

### Tester l'API
```bash
# Test de l'API santé
curl http://localhost:5000/api/health

# Test produits
curl http://localhost:5000/api/products

# Test catégories
curl http://localhost:5000/api/categories
```

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
- Vérifier que MongoDB est lancé
- Vérifier l'URI dans .env
- Pour Atlas: vérifier les pare-feu réseau

### "EADDRINUSE: address already in use :::5000"
- Le port 5000 est déjà utilisé
- Solution: `lsof -i :5000` et `kill -9 <PID>`
- Ou changer PORT dans .env

### "Module not found"
- Réinstaller les dépendances: `rm -rf node_modules && npm install`

### "CORS errors"
- Vérifier que NEXT_PUBLIC_API_URL correspond au backend
- Vérifier que le CORS est configuré sur le backend

### Frontend se connecte à la mauvaise API
- Vérifier NEXT_PUBLIC_API_URL dans .env.local
- Redémarrer le serveur Next.js: `npm run dev`

## 🔄 Flux de Travail Développement

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MongoDB (si local)
mongod
```

## 📱 Structure des Données

### Utilisateur
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "hashed_password",
  "role": "user|admin",
  "phone": "+33...",
  "address": "..."
}
```

### Produit
```json
{
  "name": "Miel Premium",
  "description": "...",
  "price": 24.99,
  "category": "ObjectId",
  "type": "apiculture|cosmetiques|travaux_forestiers",
  "stock": 50,
  "image": "cloudinary_url"
}
```

### Commande
```json
{
  "userId": "ObjectId",
  "items": [
    {"productId": "ObjectId", "quantity": 2, "price": 24.99}
  ],
  "totalAmount": 49.98,
  "status": "pending|processing|shipped|delivered",
  "shippingAddress": "..."
}
```

## 🌐 Déploiement

### Frontend (Vercel - Recommandé)
1. Push le code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement
4. Vercel déploie automatiquement

### Backend (Heroku/Railway)
1. Push le code
2. Configurer variables d'environnement
3. Connecter la base MongoDB Atlas
4. Déployer

## 📊 Performance et Optimisation

- Images optimisées avec Next.js Image
- Tailwind CSS minifié
- API paginée par défaut (limit: 12)
- JWT tokens avec expiration

## 🔒 Production Checklist

- [ ] JWT_SECRET changé et très long
- [ ] URL API pointant vers production
- [ ] MongoDB sécurisé avec authentification
- [ ] CORS restreint à domaine production
- [ ] HTTPS activé
- [ ] Variables d'environnement sécurisées
- [ ] Logs activés
- [ ] Backup automatiques

## 📞 Support et Documentation

- Documentation complète: Voir README.md
- Issues reporting: Créer une issue sur GitHub
- Email support: support@naturel-abeilles.fr

---

**Version**: 1.0.0
**Dernière mise à jour**: Avril 2024
