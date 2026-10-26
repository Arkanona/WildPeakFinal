# WildPeak Frontend

Ce dossier contient l'interface de WildPeak, développée avec **React** et **Vite**. Elle permet de parcourir les parcs, consulter les attractions, les filtrer et les comparer. Les utilisateurs peuvent également créer un compte et enregistrer leurs favoris.

**Site en ligne :** https://wild-peak-ten.vercel.app

Pour le fonctionnement de l'API et de la base de données, consulter le [README du backend](../backend/README.md).

## Stack technique

- React 19
- Vite
- React Router 7 pour la navigation
- Zustand pour la gestion de l'état (authentification, favoris…)
- SCSS pour les styles
- Font Awesome pour les icônes
- Leaflet et React-Leaflet pour la carte

## Installation en local

Depuis le dossier `front` :

```bash
npm install
```

Créer un fichier `.env` à la racine du frontend :

```env
VITE_API_URL=http://localhost:3000
```

Démarrer le serveur de développement :

```bash
npm run dev
```

L'application est normalement accessible sur `http://localhost:5173`.

Pour obtenir les données en local, démarrer également le backend. Les instructions sont dans le [README du backend](../backend/README.md).

## Pages principales

| URL | Contenu |
| --- | --- |
| `/` | Accueil |
| `/parcs` | Liste des parcs |
| `/parcs/:id` | Détail d'un parc (identifiant ou slug selon la route utilisée) |
| `/attractions` | Liste, recherche et filtres des attractions |
| `/attractions/:id` | Détail d'une attraction |
| `/comparateur` | Comparaison de plusieurs attractions |
| `/inscription` | Création de compte |
| `/connexion` | Connexion |
| `/mot-de-passe-oublie` | Demande de réinitialisation |
| `/reinitialiser-mot-de-passe/:token` | Nouveau mot de passe |
| `/profil` | Favoris de l'utilisateur |
| `/contact` | Formulaire de contact |
| `/informations-legales` | Mentions légales, confidentialité et conditions d'utilisation |

Un espace d'administration, réservé aux utilisateurs disposant des droits nécessaires, permet de gérer les informations des attractions et des parcs.

## Fonctionnement

### Parcs et attractions

Les contenus affichés proviennent de l'API. Les utilisateurs peuvent consulter les fiches, rechercher une attraction et appliquer plusieurs filtres : catégorie, inversions, hauteur, durée ou taille minimum.

### Comparateur

Le comparateur accepte **2 à 4 attractions**. Il affiche leurs principales caractéristiques côte à côte : type, vitesse maximale, longueur, hauteur, durée et taille minimum. Les meilleures valeurs sont mises en évidence selon le critère comparé.

### Compte et favoris

L'authentification repose sur l'API. Une fois connecté, l'utilisateur peut ajouter ou retirer des attractions de sa liste de favoris. **Zustand** permet de mettre à jour leur affichage dans l'interface.

### Contact

Le formulaire envoie les messages au backend, qui se charge de l'envoi des e-mails avec Brevo.

## Build de production

```bash
npm run build
```

Vite génère les fichiers de production dans `dist/`. Pour tester cette version en local :

```bash
npm run preview
```

Sur Vercel, la variable `VITE_API_URL` doit pointer vers l'URL publique de l'API. Les routes React Router doivent également être redirigées vers `index.html` pour rester accessibles après un rafraîchissement.

## Liens utiles

- [README général](../README.md)
- [README du backend](../backend/README.md)
- [Site WildPeak](https://wild-peak-ten.vercel.app)
