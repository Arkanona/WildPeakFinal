# WildPeak Backend

Ce dossier contient l'API de WildPeak. Elle gère les données des parcs et attractions, l'authentification des utilisateurs, les favoris, l'administration, l'envoi des messages de contact et le stockage des images.

**API en production :** https://wildpeak-api.onrender.com

Pour l'interface qui consomme cette API, consulter le [README du frontend](../frontend/README.md).

## Stack technique

- Node.js et Express
- PostgreSQL, hébergé sur Supabase
- Supabase Storage pour les images
- JWT pour l'authentification
- Multer et Sharp pour le traitement des images
- Brevo pour l'envoi des e-mails
- Helmet, CORS et limitation du nombre de requêtes

## Installation en local

Depuis le dossier `back` :

```bash
npm install
```

Créer un fichier `.env` avec les variables nécessaires à l'environnement local :

```env
PORT=3000
DATABASE_URI=postgresql://UTILISATEUR:MOT_DE_PASSE@HOTE:5432/BASE
FRONTEND_URL=http://localhost:5173

# Renseigner les identifiants et clés utilisés par votre configuration Supabase.
# Les noms exacts des variables sont à vérifier dans le code du projet.

BREVO_API_KEY=...
BREVO_SENDER_EMAIL=...
BREVO_RECEIVER_EMAIL=...

# Ajouter ici le secret JWT sous le nom attendu par le middleware d'authentification.
```

Ne jamais publier le fichier `.env`, les clés API ou les identifiants de base de données dans Git.

Lancer le serveur avec la commande de démarrage définie dans le `package.json` du backend (par exemple `npm run dev` si ce script est présent).

En local, l'API utilise le port **3000**.

## Fonctionnalités de l'API

### Parcs et attractions

L'API fournit les informations affichées dans le frontend : nom, description, parc associé, images et caractéristiques techniques (vitesse, hauteur, longueur, durée, inversions, taille minimum, etc.).

Les données sont enregistrées dans PostgreSQL, notamment dans les tables `park` et `attraction`.

### Utilisateurs et authentification

Les utilisateurs peuvent créer un compte, se connecter et demander la réinitialisation de leur mot de passe. Certaines routes nécessitent un jeton JWT valide.

### Favoris

Les favoris sont liés à l'utilisateur authentifié et enregistrés en base de données.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/v1/profile` | Récupérer les favoris |
| `POST` | `/api/v1/profile/:idAttraction` | Ajouter une attraction aux favoris |
| `DELETE` | `/api/v1/profile/:idAttraction` | Retirer une attraction des favoris |

Ces routes nécessitent une authentification.

### Administration

Les opérations d'ajout, de modification et de suppression sont réservées aux administrateurs. Le backend contrôle l'authentification et le rôle de l'utilisateur avant d'autoriser ces actions.

### Images

Les images sont transférées avec Multer, puis traitées avec Sharp et enregistrées dans le bucket Supabase Storage `wildpeak`.

Deux formats WebP sont générés pour les parcs et attractions :

- **Carte** : 600 × 400 px, qualité 85
- **Bannière** : 1900 × 400 px, qualité 85

Lorsqu'une image est remplacée, l'ancienne peut être supprimée du stockage pour éviter de conserver des fichiers inutilisés.

### Contact

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/api/v1/contact` | Envoyer un message depuis le formulaire de contact |

Le backend vérifie les informations du formulaire, dont la case de confidentialité, puis transmet le message avec l'API Brevo.

## Routes connues

Ces routes font partie de celles utilisées par le projet, cette liste n'est pas une documentation exhaustive de l'API.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/v1/parks` | Lister les parcs |
| `GET` | `/api/v1/attractions` | Lister les attractions |
| `PATCH` | `/api/v1/attractions/:id/image` | Mettre à jour les images d'une attraction |
| `GET` | `/api/v1/profile` | Récupérer les favoris |
| `POST` | `/api/v1/profile/:idAttraction` | Ajouter un favori |
| `DELETE` | `/api/v1/profile/:idAttraction` | Supprimer un favori |
| `POST` | `/api/v1/contact` | Envoyer un message |

Les routes protégées attendent un jeton dans l'en-tête HTTP :

```http
Authorization: Bearer <token>
```

## Déploiement

L'API est déployée sur **Render**. La base PostgreSQL et les images sont hébergées chez **Supabase**. Les variables d'environnement sont configurées sur le service d'hébergement, `FRONTEND_URL` permet notamment d'autoriser l'origine du site déployé via CORS.

## Liens utiles

- [README général](../README.md)
- [README du frontend](../frontend/README.md)
- [API WildPeak](https://wildpeak-api.onrender.com)
