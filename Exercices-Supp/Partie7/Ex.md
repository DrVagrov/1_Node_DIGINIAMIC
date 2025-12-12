# Partie 7 : Introduction aux Controllers

## Pourquoi séparer les Controllers ?

Dans la **Partie 6**, vous avez séparé le routing, mais le fichier `routes/articles.routes.js` contient encore **toute la logique métier** : la validation des données, la manipulation des articles, la gestion des réponses HTTP, la persistance... Tout est encore mélangé dans le router !

**Problèmes de cette approche :**
- Le router fait trop de choses : il route ET il gère la logique métier
- Si vous voulez changer la logique métier (par exemple, ajouter une validation plus complexe), vous devez modifier le router
- Le router est difficile à tester car il mélange routing et logique
- Si vous avez plusieurs routes qui font des choses similaires, vous dupliquez le code

**Solution : Séparer les Controllers**

L'idée est de **séparer les responsabilités** en deux couches :
- **Router** (`routes/articles.routes.js`) : Son **seul** rôle est de dire "quelle route appelle quelle fonction". Il ne contient QUE la logique de routing (les `if` sur les routes et méthodes)
- **Controller** (`controllers/articles.controller.js`) : Contient la **logique métier** : validation des données, gestion des réponses HTTP, gestion des erreurs, appels aux fonctions de données

Cette séparation permet :
- Au router d'être très simple : il route, c'est tout
- Au controller de gérer toute la logique métier de manière centralisée
- De tester facilement la logique métier indépendamment du routing
- De réutiliser la logique métier dans différents contextes

**Architecture actuelle :**
```
Router → Logique métier (tout mélangé)
```

**Architecture cible :**
```
Router → Controller → Logique de données (temporairement dans le controller)
```

## Objectif de cet exercice

Extraire toute la logique métier du router vers un controller. Le router ne fera plus que router (appeler les bonnes fonctions du controller), et le controller contiendra toute la logique métier.

## Instructions

1. Reprenez le code de la **Partie 6** (avec routing modulaire)
2. Créez un dossier `controllers` à la racine de votre projet
3. Créez un fichier `controllers/articles.controller.js` qui contiendra :
   - Des fonctions pour chaque action : `listArticles`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`
   - Chaque fonction gère la logique métier : validation, manipulation des données, réponses HTTP
   - Pour l'instant, gardez la logique de données (manipulation du tableau `articles`) dans le controller (on l'extraira dans la partie suivante)
4. Modifiez `routes/articles.routes.js` pour :
   - Importer les fonctions du controller
   - Ne garder QUE la logique de routing (les `if` sur les routes)
   - Appeler les bonnes fonctions du controller selon la route et la méthode
5. Modifiez `index.js` si nécessaire pour passer les données nécessaires au controller

## Structure attendue

```
correction/
├── index.js                    (création du serveur, délègue au router)
├── routes/
│   └── articles.routes.js      (routing uniquement : appelle le controller)
├── controllers/
│   └── articles.controller.js  (logique métier : validation, réponses HTTP)
└── data/
    └── articles.json
```

## Conseils

- Le controller doit recevoir `req`, `res`, et les données nécessaires (articles, nextId, etc.)
- Le controller gère les codes HTTP (200, 201, 400, 404, etc.)
- Le controller gère la validation des données
- Le router est très simple : il vérifie la route et appelle la bonne fonction du controller
- Vous pouvez créer un fichier `utils/http.js` pour les fonctions utilitaires (`sendJson`, `notFound`, `parseBody`) si vous voulez les réutiliser

## Test

Une fois terminé, votre API doit fonctionner exactement comme avant, mais avec une meilleure séparation des responsabilités. Le router est maintenant très simple et le controller contient toute la logique métier.

