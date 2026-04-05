# 🚀 Guide de Déploiement - Naturel & Abeilles

## 📊 Vue d'ensemble du Déploiement

Cette application full-stack peut être déployée sur plusieurs plateformes. Voici les recommandations :

- **Frontend**: Vercel (Recommandé - Gratuit jusqu'à un certain niveau)
- **Backend**: Railway, Render, Heroku ou DigitalOcean
- **Base de données**: MongoDB Atlas (Gratuit 512MB)
- **Stockage images**: Cloudinary (Gratuit 25GB)

## 1️⃣ Préparation

### Audit Pré-Déploiement
```bash
# Backend
cd backend
npm run build  # Si applicable
npm test       # Si des tests existent

# Frontend
cd ../frontend
npm run build
npm run lint
```

### Checklist de Sécurité

- [ ] Tous les secrets changés (JWT_SECRET, API_KEYS)
- [ ] .env jamais commité (vérifier .gitignore)
- [ ] Pas de données de test en production
- [ ] HTTPS activé partout
- [ ] CORS configuré correctement
- [ ] Rate limiting implementé
- [ ] Logs de sécurité configurés

## 2️⃣ Déploiement du Frontend (Vercel)

### Option A: Depuis GitHub

1. **Pousser le code**
```bash
cd frontend
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - S'inscrire/Se connecter
   - Cliquer "Import Git Repository"
   - Sélectionner le repo
   - Cliquer "Import"

3. **Configurer les variables d'environnement**
   - Dans Vercel Dashboard > Settings > Environment Variables
   - Ajouter NEXT_PUBLIC_API_URL (pointant vers l'API deployée)
   - Autres variables publiques

4. **Déployer**
   - Vercel déploie automatiquement
   - L'URL sera visible dans le dashboard

### Option B: CLI Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 3️⃣ Déploiement du Backend

### Option A: Railway.app (Recommandé - Simplicité)

1. **Créer compte**
   - Aller sur [railway.app](https://railway.app)
   - S'inscrire avec GitHub

2. **Créer un nouveau projet**
   - Cliquer "New Project"
   - Sélectionner "Deploy from GitHub"
   - Authoriser et sélectionner le repo

3. **Configurer le service**
   - Sélectionner le dossier `/backend`
   - Ajouter les variables d'environnement:
     ```
     PORT=5000
     MONGO_URI=<url-mongodb-atlas>
     JWT_SECRET=<secret-very-long>
     CLOUDINARY_NAME=<name>
     CLOUDINARY_API_KEY=<key>
     CLOUDINARY_API_SECRET=<secret>
     ```

4. **Déployer**
   - Railway déploie automatiquement
   - Copier l'URL générée

### Option B: Render.com

1. Créer compte sur [render.com](https://render.com)
2. Nouveau service Web
3. Connecter GitHub
4. Configurations:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Ajouter variables d'environnement

5. Déployer

### Option C: Heroku (Déclin mais encore possible)

```bash
heroku login
heroku create naturel-abeilles-api
heroku config:set JWT_SECRET=<secret>
heroku config:set MONGO_URI=<uri>
git push heroku main
```

## 4️⃣ Configuration MongoDB Atlas

### Créer une Base de Données Gratuite

1. Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. S'inscrire
3. Créer un cluster gratuit
4. Configurer:
   - Région: Europe (Frankfurt/Ireland pour latence basse)
   - Tier: M0 Sandbox (512MB gratuit)

5. Créer utilisateur de base de données
6. Obtenir la chaîne de connexion:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bees
   ```

7. Configurer réseau:
   - IP Access: Ajouter `0.0.0.0/0` pour accès public
   - Ou ajouter les IPs spécifiques de vos serveurs

## 5️⃣ Configuration Cloudinary

1. S'inscrire sur [cloudinary.com](https://cloudinary.com)
2. Aller à Dashboard
3. Copier:
   - Cloud Name
   - API Key
   - API Secret

4. Ajouter ces valeurs en variables d'environnement du backend

## 6️⃣ Configuration DNS et Domaine

### Si vous avez un nom de domaine personnalisé:

1. **Frontend (Vercel)**
   - Vercel Dashboard > Settings > Domains
   - Ajouter votre domaine
   - Suivre les instructions pour les records DNS

2. **Backend (Railway/Render)**
   - Les serveurs fournissent une URL auto-générée
   - Vous pouvez point un sous-domaine (api.example.com)

### Exemple de Configuration DNS

```
Nom                Type    Valeur
@                  A       Points to Vercel
api                CNAME   Points to Railway/Render
www                CNAME   Points to Vercel
```

## 7️⃣ Mise en Place du SSL/HTTPS

- **Vercel**: SSL automatique
- **Railway/Render**: SSL automatique
- **Domaine personnalisé**: Cloudflare ou Let's Encrypt

## 8️⃣ Vérification Post-Déploiement

### Tests d'API
```bash
# Tester l'endpoint santé
curl https://api.votredomaine.com/api/health

# Tester produits
curl https://api.votredomaine.com/api/products

# Tester login
curl -X POST https://api.votredomaine.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password"}'
```

### Tests du Frontend
- Naviguer sur https://votredomaine.com
- Tester toutes les pages principales
- Tester le formulaire de contact
- Tester l'ajout au panier
- Tester la connexion/inscription
- Tester le dashboard admin

## 9️⃣ Monitoring et Maintenance

### Configurer les Alertes

**Railway/Render:**
- Configurer les notifications
- Recevoir les alerts en cas d'erreur

**MongoDB:**
- Activation du monitoring Atlas
- Configurer les alertes

### Logs

```bash
# Railway
railway logs

# Render
# Voir dans le dashboard

# Vercel
# Aller à Deployment > Runtime Logs
```

### Backups

- **MongoDB**: Atlas backup automatique gratuit
- **Données**: Exporter régulièrement

## 🔟 Scalabilité Future

### Si besoin de croître:

1. **Frontend**
   - Vercel supporte l'auto-scaling
   - Cache optimisé avec Edge Functions

2. **Backend**
   - Passer à un plan payant (Railway/Render)
   - Ajouter Redis pour cache
   - Ajouter CDN pour images

3. **Base de Données**
   - Passer de M0 à M2+ sur Atlas
   - Ajouter indexes pour performance
   - Configurer sharding si nécessaire

## 📋 Checklist Déploiement Final

- [ ] Frontend construit et testé localement
- [ ] Backend construit et testé localement
- [ ] Variables d'environnement configurées partout
- [ ] MongoDB Atlas créé et testé
- [ ] Cloudinary configuré
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Railway/Render
- [ ] Domaine configuré avec DNS
- [ ] SSL vérifié
- [ ] Tests de connexion API effectués
- [ ] Formulaire de contact testé
- [ ] Paiement testé (si implémenté)
- [ ] Mobile responsive vérifié
- [ ] Performance testée (Lighthouse)
- [ ] Alerts/Logs configurés
- [ ] Sauvegardes en place

## 🆘 Problèmes Communs

### "Cannot connect to DB in production"
- Vérifier MONGO_URI
- Vérifier IP whitelist sur MongoDB Atlas
- Vérifier le statut du cluster

### "Erreur CORS"
- Vérifier NEXT_PUBLIC_API_URL (frontend)
- Vérifier la configuration CORS (backend)

### "Slow API Responses"
- Vérifier les indexes MongoDB
- Implémenter le cache avec Redis
- Optimiser les requêtes

### "Fichiers images non chargés"
- Vérifier les credentials Cloudinary
- Vérifier les URLs Cloudinary
- Vérifier les permissions

## 🔐 Secrets Management

### Pour une sécurité maximale:

```bash
# Utiliser un gestionnaire de secrets
# Jamais commiter de secrets
# Rotation régulière des clés
```

## 📞 Support en Production

- Monitorer 24/7 les erreurs
- Configurer les alertes
- Avoir un plan de réponse aux incidents
- Documenter les procédures

---

**Une fois déployé, votre application est prête pour accueillir les clients!** 🎉

**Support Technique**: support@naturel-abeilles.fr
**Documentation**: Voir README.md et SETUP.md
