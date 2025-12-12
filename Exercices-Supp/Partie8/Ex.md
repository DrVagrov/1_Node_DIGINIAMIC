# Partie 8 : Introduction aux Services

## Pourquoi séparer les Services ?

Dans la **Partie 7**, vous avez séparé les controllers, mais le fichier `controllers/articles.controller.js` contient encore **toute la logique de manipulation des données** : la recherche dans le tableau, l'ajout, la modification, la suppression, la sauvegarde... Le controller fait trop de choses !

**Problèmes de cette approche :**
- Le controller mélange la logique métier (validation, réponses HTTP) et la logique de données (manipulation du tableau, persistance)
- Si vous voulez changer la façon dont les données sont stockées (par exemple, passer d'un fichier JSON à une vraie base de données), vous devez modifier le controller
- Le controller est difficile à tester car il dépend directement de la structure de données
- Si vous avez plusieurs controllers qui manipulent les mêmes données, vous dupliquez le code

**Solution : Séparer les Services**

L'idée est de **séparer les responsabilités** en trois couches distinctes :
- **Router** (`routes/articles.routes.js`) : Route uniquement (quelle route appelle quelle fonction du controller)
- **Controller** (`controllers/articles.controller.js`) : Gère la logique métier HTTP : validation des données, codes de réponse HTTP, gestion des erreurs. Il **appelle** le service pour manipuler les données
- **Service** (`services/articles.service.js`) : Contient **toute la logique de données** : chargement, sauvegarde, CRUD (Create, Read, Update, Delete). Il ne connaît rien au HTTP, il manipule juste les données

Cette séparation permet :
- Au controller d'être focalisé sur le HTTP (validation, réponses)
- Au service d'être focalisé sur les données (CRUD, persistance)
- De changer facilement la source de données (JSON → Base de données) sans toucher au controller
- De tester facilement la logique de données indépendamment du HTTP
- De réutiliser la logique de données dans différents contextes (API, CLI, etc.)

**Architecture actuelle :**
```
Router → Controller → Logique de données (dans le controller)
```

**Architecture cible :**
```
Router → Controller → Service → Données (JSON)
```

## Objectif de cet exercice

Extraire toute la logique de manipulation des données du controller vers un service. Le controller ne fera plus que gérer le HTTP et appeler le service, et le service contiendra toute la logique de données.

## Instructions

1. Reprenez le code de la **Partie 7** (avec routing et controllers)
2. Créez un dossier `services` à la racine de votre projet
3. Créez un fichier `services/articles.service.js` qui contiendra :
   - Les fonctions de chargement et sauvegarde des données (`loadArticles`, `saveArticles`)
   - Les fonctions CRUD : `getAll()`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)`
   - La gestion du tableau `articles` et du `nextId` (tout ce qui concerne les données)
   - Le service ne connaît rien au HTTP, il retourne juste des données ou `null`/`false` en cas d'erreur
4. Modifiez `controllers/articles.controller.js` pour :
   - Importer le service
   - Appeler les fonctions du service au lieu de manipuler directement les données
   - Gérer les réponses HTTP en fonction des résultats du service
5. Modifiez `index.js` si nécessaire (le service gère maintenant le chargement des données)

## Structure attendue

```
correction/
├── index.js                    (création du serveur, délègue au router)
├── routes/
│   └── articles.routes.js      (routing uniquement)
├── controllers/
│   └── articles.controller.js  (logique HTTP : validation, réponses)
├── services/
│   └── articles.service.js     (logique de données : CRUD, persistance)
└── data/
    └── articles.json
```

## Conseils

- Le service doit gérer le chargement initial des données (dans le fichier, pas dans `index.js`)
- Le service retourne des données brutes (objets, tableaux) ou `null`/`false` en cas d'erreur
- Le controller interprète les résultats du service et génère les réponses HTTP appropriées
- Le service ne doit jamais utiliser `res` ou `req`, il ne connaît que les données
- Vous pouvez créer une fonction `ensureDb()` dans le service pour s'assurer que le fichier JSON existe

## Test

Une fois terminé, votre API doit fonctionner exactement comme avant, mais avec une architecture complète et bien séparée. Chaque couche a une responsabilité claire :
- **Router** : Route
- **Controller** : HTTP
- **Service** : Données

Cette architecture est maintenant prête à évoluer (changer la source de données, ajouter de nouvelles fonctionnalités, etc.) !

