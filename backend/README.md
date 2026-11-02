# WildPeak Backend

Ce dossier contient l’API REST de **WildPeak**, le comparateur d’attractions et de parcs. Elle fournit les données utilisées par le frontend et gère les comptes utilisateurs, les favoris, l’administration, les messages de contact et les images.

**API déployée :** https://wildpeak-api.onrender.com  
**Documentation Swagger :** https://wildpeak-api.onrender.com/api-docs  
**Frontend :** [README du frontend](../frontend/README.md)

## Stack technique

- **Node.js / Express** : API REST.
- **PostgreSQL** : stockage des parcs, attractions, utilisateurs et favoris (connexion définie par l’environnement).
- **Supabase Storage** : stockage des images dans le bucket `wildpeak`.
- **JWT / bcryptjs** : authentification et hachage des mots de passe.
- **Zod** : validation des données reçues par l’API.
- **Multer / Sharp** : réception, redimensionnement et conversion des images en WebP.
- **Brevo** : envoi des e-mails de contact et de réinitialisation de mot de passe.
- **Helmet, CORS et rate limiting** : protections HTTP et limitation des requêtes.
- **Swagger UI / JSDoc** : documentation des endpoints et du code JavaScript.
- **Jest** : tests automatisés des controllers, models, middlewares et services, avec rapport de couverture.

## Installation en local

Depuis le dossier `backend` :

```bash
npm install
```

Créer un fichier `.env` à la racine du backend avec les paramètres nécessaires :

```dotenv
PORT=3000
DATABASE_URI=postgresql://UTILISATEUR:MOT_DE_PASSE@HOTE:5432/BASE
JWT_SECRET=REMPLACER_PAR_UN_SECRET_LONG_ET_ALEATOIRE
FRONTEND_URL=http://localhost:5173

BREVO_API_KEY=...
BREVO_SENDER_EMAIL=...
BREVO_RECEIVER_EMAIL=...

# Ajouter ici les variables nécessaires à config/supabase.js.
```

> Le nom de la variable de connexion PostgreSQL (`DATABASE_URI`) et ceux des variables Supabase sont à vérifier dans `config/db.js` et `config/supabase.js`. Les valeurs ci-dessus sont des exemples, pas de vrais identifiants. Ne jamais commiter le fichier `.env` ou des secrets.

Démarrer le serveur avec le script prévu dans `package.json` :

```bash
npm run dev
```

Cette commande suppose qu’un script `dev` est défini. Dans la configuration présentée ici, le backend écoute sur le port **3000** et les routes de l’API sont accessibles sous le préfixe `/api/v1`.

## Fonctionnalités

### Parcs et attractions

Les données sont enregistrées dans les tables PostgreSQL `park` et `attraction`. L’API expose les informations des parcs et les caractéristiques des attractions : nom, type, description, vitesse, hauteur, longueur, durée, inversions, taille minimale, année d’ouverture et images.

La consultation est publique. Les opérations de création, modification et suppression passent par les routes administrateur, protégées par un JWT valide et par le contrôle du rôle `admin`.

### Authentification et comptes

Les utilisateurs peuvent s’inscrire, se connecter, demander un lien de réinitialisation et modifier leur mot de passe. Le mot de passe est haché avec bcryptjs ; l’authentification s’appuie sur un JWT, configuré dans le controller pour expirer après **30 jours**.

La réinitialisation utilise un token aléatoire dont seule l’empreinte est stockée en base, avec une durée de validité de **15 minutes**. La réponse à la demande ne révèle pas si le compte existe.

Un utilisateur authentifié peut aussi supprimer son compte après vérification de son mot de passe. L’opération supprime ses favoris et son compte dans une transaction PostgreSQL.

### Favoris

Chaque utilisateur connecté peut consulter, ajouter ou retirer ses attractions favorites. Les favoris sont enregistrés dans la table `favorites` et liés aux identifiants de l’utilisateur et de l’attraction. Un même favori n’est pas inséré deux fois.

### Gestion des images

Les fichiers sont réceptionnés par Multer en mémoire. La limite configurée est de **6 Mo par fichier**, avec les types MIME JPEG, PNG et WebP autorisés. Sharp génère ensuite deux versions WebP, de qualité 85 :

| Utilisation | Dimensions |
| --- | --- |
| Image de carte | 600 × 400 px |
| Image de fond | 1900 × 400 px |

Les fichiers sont envoyés dans le bucket Supabase Storage `wildpeak`, dans les dossiers `parks` et `attractions`. Lors du remplacement d’une image, le backend prévoit le nettoyage des anciennes images. La suppression d’une attraction dans le controller actuellement fourni supprime sa ligne PostgreSQL, mais ne supprime pas explicitement ses images sur Supabase.

### Contact

Le formulaire de contact transmet un message à l’API, qui utilise **Brevo** pour l’envoyer à l’adresse configurée côté serveur. L’adresse du visiteur est renseignée comme adresse de réponse (`replyTo`). La validation du formulaire est gérée côté backend.

## Routes de l’API

Les chemins ci-dessous correspondent aux routeurs et aux préfixes utilisés pour la documentation. Ils supposent que les routeurs sont montés dans `app.js` sur `/api/v1/auth`, `/api/v1/parcs`, `/api/v1/attractions`, `/api/v1/profile` et `/api/v1/admin-wild`. Vérifier ces préfixes dans `app.js` si nécessaire.

### Routes publiques

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/v1/parcs` | Lister les parcs |
| `GET` | `/api/v1/attractions` | Lister les attractions |
| `POST` | `/api/v1/auth/register` | Créer un compte |
| `POST` | `/api/v1/auth/login` | Se connecter |
| `POST` | `/api/v1/auth/forgot-password` | Demander un lien de réinitialisation |
| `POST` | `/api/v1/auth/reset-password/:token` | Réinitialiser le mot de passe |
| `POST` | `/api/v1/contact` | Envoyer un message depuis le formulaire de contact |

### Routes nécessitant une authentification

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/v1/profile` | Récupérer ses favoris |
| `POST` | `/api/v1/profile/:idAttraction` | Ajouter une attraction aux favoris |
| `DELETE` | `/api/v1/profile/:idAttraction` | Retirer une attraction des favoris |
| `DELETE` | `/api/v1/profile/account` | Supprimer son compte après vérification du mot de passe |

### Routes administrateur

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/api/v1/admin-wild/parcs` | Ajouter un parc |
| `PATCH` | `/api/v1/admin-wild/parcs/:id` | Modifier un parc |
| `DELETE` | `/api/v1/admin-wild/parcs/:id` | Supprimer un parc |
| `POST` | `/api/v1/admin-wild/attractions` | Ajouter une attraction |
| `PATCH` | `/api/v1/admin-wild/attractions/:id` | Modifier une attraction |
| `DELETE` | `/api/v1/admin-wild/attractions/:id` | Supprimer une attraction |

Les routes protégées attendent un JWT dans l’en-tête HTTP :

```http
Authorization: Bearer <token>
```

Les routes administrateur ajoutent une vérification du rôle `admin`. Les données d’entrée de l’authentification sont validées avec Zod : une validation refusée par le middleware renvoie le code **422** et la liste des champs invalides.

## Documentation technique

### Swagger — endpoints HTTP

Swagger UI rassemble la documentation des **16 opérations** déjà décrites (authentification, parcs, attractions, favoris et administration). Il permet de consulter les paramètres, les corps de requêtes, les exemples de réponse et les codes HTTP, et de tester les endpoints avec **Try it out**.

- En local : http://localhost:3000/api-docs
- Sur Render : https://wildpeak-api.onrender.com/api-docs

La spécification est écrite manuellement dans `config/swagger.js`, puis affichée avec `swagger-ui-express`. La route de contact, mentionnée ci-dessus, ne fait pas partie des 16 opérations documentées dans la version Swagger préparée jusqu’ici.

**Attention :** les tests POST, PATCH et DELETE modifient réellement les données. Pour les tests d’administration et de suppression de compte, privilégier une base de test en local.

### JSDoc — code JavaScript

Les principaux controllers, models, middlewares et services possèdent des commentaires JSDoc. Ceux-ci expliquent le rôle des fonctions, leurs paramètres, leurs retours et les erreurs possibles.

Installer les dépendances du projet, puis générer la documentation HTML avec :

```bash
npm run docs
```

La commande suppose le script suivant dans `package.json` :

```json
"docs": "jsdoc -c jsdoc.json"
```

Avec la configuration `jsdoc.json` prévue, le résultat est généré dans `docs/jsdoc/`. Ouvrir ensuite `docs/jsdoc/index.html` dans un navigateur.

La documentation JSDoc complète Swagger : **Swagger décrit les échanges HTTP**, tandis que **JSDoc explique le fonctionnement du code backend**.

## Tests automatisés — Jest

Le backend dispose d'une suite de tests automatisés avec **Jest**. Les tests couvrent les fonctionnalités métier et les cas d'erreur, sans requêtes vers les services de production. Ils utilisent des **mocks** pour isoler notamment les accès PostgreSQL, l'authentification, les appels Brevo et les traitements d'images.

### Lancer les tests

Depuis le dossier `backend`, installer les dépendances puis utiliser :

```bash
# Exécuter tous les tests
npm test

# Relancer les tests pendant le développement
npm run test:watch

# Exécuter les tests et produire le rapport de couverture
npm run test:coverage
```

Les scripts attendus dans le `package.json` sont :

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --runInBand"
  }
}
```

Ces entrées sont des **exemples à intégrer aux scripts existants**, sans remplacer les autres commandes du `package.json`.

### Résultats obtenus

Résultats de l'exécution locale du **2 novembre 2026** :

| Indicateur | Résultat |
| --- | ---: |
| Suites de tests | **16 / 16 réussies** |
| Tests | **103 / 103 réussis** |
| Couverture des instructions (`Statements`) | **92,77 %** |
| Couverture des branches (`Branches`) | **85,71 %** |
| Couverture des fonctions (`Functions`) | **100 %** |
| Couverture des lignes (`Lines`) | **92,96 %** |

Le détail de la couverture par partie du backend est le suivant :

| Partie | Lignes couvertes | Fonctions couvertes |
| --- | ---: | ---: |
| Controllers | 89,43 % | 100 % |
| Middlewares | 100 % | 100 % |
| Models | 100 % | 100 % |
| Services | 100 % | 100 % |

Les fichiers `contactController.js`, `favoriteController.js` et les **quatre middlewares** atteignent également 100 % sur les quatre indicateurs (instructions, branches, fonctions et lignes).

Les scénarios couverts comprennent notamment :

- **Comptes et authentification** : création d'utilisateurs, recherche en base, gestion des JWT, réinitialisation du mot de passe et suppression de compte avec transactions PostgreSQL (`COMMIT` / `ROLLBACK`).
- **Parcs et attractions** : opérations de lecture, d'ajout, de modification et de suppression, avec vérification des erreurs.
- **Favoris** : consultation, ajout, suppression et gestion des doublons.
- **Administration** : refus d'accès aux utilisateurs non authentifiés ou dépourvus du rôle `admin`.
- **Validation Zod** : données valides et invalides, erreurs HTTP 422.
- **Images** : types JPEG/PNG/WebP autorisés, limite de 6 Mo, traitement des fichiers et gestion des erreurs d'upload.
- **Contact et e-mails** : acceptation de la confidentialité, envoi de messages, erreurs du service Brevo et réinitialisation du mot de passe.

La structure des tests suit les dossiers de l'application :

```text
tests/
├── controllers/
│   ├── attractionController.test.js
│   ├── authController.test.js
│   ├── contactController.test.js
│   ├── favoriteController.test.js
│   ├── parkController.test.js
│   └── uploadController.test.js
├── middlewares/
│   ├── adminMiddleware.test.js
│   ├── authMiddleware.test.js
│   ├── uploadMiddleware.test.js
│   └── validateMiddleware.test.js
├── models/
│   ├── attractionModel.test.js
│   ├── favoriteModel.test.js
│   ├── parkModel.test.js
│   ├── uploadModel.test.js
│   └── userModel.test.js
└── services/
    └── mailService.test.js
```

### Rapport de couverture

Après `npm run test:coverage`, ouvrir **`backend/coverage/index.html`** dans un navigateur pour consulter le rapport HTML, avec le détail des lignes et des branches non couvertes.

Le dossier `coverage/` est généré automatiquement et doit être exclu du dépôt Git. Ajouter dans le `.gitignore` :

```gitignore
# Rapport de couverture Jest
coverage/
```

En revanche, **les fichiers `*.test.js` doivent rester versionnés** : ils permettent de reproduire les vérifications du projet.

> **Portée des résultats :** ces chiffres reflètent les tests Jest exécutés localement le 2 novembre 2026. La suite est majoritairement constituée de tests unitaires avec mocks ; elle ne remplace pas des tests d'intégration sur une base de test ni des tests de bout en bout du frontend. Les pourcentages évolueront si le code ou les tests changent.

## Déploiement

L’API est déployée sur **Render**. Les images sont conservées sur **Supabase Storage** et la connexion PostgreSQL est paramétrée par l’environnement. Le frontend est déployé séparément sur **Vercel**.

Les paramètres sensibles (connexion à la base, clé JWT, accès Supabase, clé Brevo) sont définis dans les variables d’environnement du service Render, et non dans le dépôt Git. Les origines autorisées par CORS doivent correspondre aux URLs du frontend local et déployé.

Sur une instance Render susceptible de se mettre en veille, le premier appel peut être plus lent que les suivants.

## Liens utiles

- [README général](../README.md)
- [README du frontend](../frontend/README.md)
- [API WildPeak](https://wildpeak-api.onrender.com)
- [Swagger UI — production](https://wildpeak-api.onrender.com/api-docs)
