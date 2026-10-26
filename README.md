# WildPeak

WildPeak est un site web consacré aux parcs d’attractions européens. Il permet de découvrir des parcs, de consulter les fiches de leurs attractions et de comparer leurs caractéristiques pour choisir celles qui correspondent le mieux à ses envies.

Le projet a été réalisé dans le cadre de ma formation **Développeur Web et Web Mobile**. J'ai développé le frontend, le backend ainsi que la base de données.

**Site en ligne :** https://wild-peak-ten.vercel.app

## Fonctionnalités

- Découverte des parcs et de leurs attractions
- Recherche et filtres sur les attractions
- Fiches détaillées : vitesse, hauteur, longueur, durée, inversions, taille minimum, etc.
- Comparateur de 2 à 4 attractions
- Création de compte, connexion et réinitialisation du mot de passe
- Gestion des attractions favorites pour les utilisateurs connectés
- Formulaire de contact
- Espace d'administration pour gérer les parcs et attractions
- Interface responsive

## Technologies utilisées

| Frontend | Backend et services |
| --- | --- |
| React 19, Vite | Node.js, Express |
| React Router 7 | PostgreSQL (Supabase) |
| SCSS | Supabase Storage |
| Zustand | JWT pour l'authentification |
| Leaflet et React-Leaflet | Sharp et Multer pour les images |
| Font Awesome | Brevo pour les e-mails |

Le frontend est déployé sur **Vercel** et l'API sur **Render**. Les données et les images sont hébergées sur **Supabase**.

## Organisation du projet

```text
wildpeak/
├── front/       # Application React
│   └── README.md
├── back/        # API Express
│   └── README.md
└── README.md     # Présentation générale
```

## Installation

Le frontend et le backend disposent chacun de leur propre configuration et de leurs dépendances.

1. Cloner le dépôt Git.
2. Installer et configurer le backend en suivant le [README du backend](./backend/README.md).
3. Installer et lancer le frontend en suivant le [README du frontend](./frontend/README.md).

Pour utiliser les fonctionnalités nécessitant un compte ou accéder aux données des parcs et attractions en local, l'API doit être accessible depuis le frontend.

## Documentation

- [Frontend : installation, pages et fonctionnement](./frontend/README.md)
- [Backend : API, base de données et configuration](./backend/README.md)

## Auteur

Projet développé par **Enzo Gallardo**.
