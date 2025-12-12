# Partie 6 : Introduction au Routing modulaire

## Pourquoi séparer le routing ?

À ce stade, votre fichier `index.js` contient **toute la logique** de votre API : la création du serveur, le parsing de l'URL, la gestion de toutes les routes, la logique métier, la persistance des données... Tout est mélangé dans un seul fichier !

**Problèmes de cette approche :**
- Le fichier devient très long et difficile à maintenir (200+ lignes)
- Si vous voulez ajouter une nouvelle ressource (par exemple `/users`), vous devez modifier `index.js` qui devient encore plus long
- Il est difficile de retrouver rapidement une route spécifique
- Plusieurs développeurs ne peuvent pas travailler en parallèle sur différentes routes
- Le code n'est pas réutilisable ni testable facilement

**Solution : Séparer le routing**

L'idée est de **séparer les responsabilités** :
- `index.js` : Crée le serveur HTTP, parse l'URL, et **délègue** le routing à des fichiers spécialisés
- `routes/articles.routes.js` : Contient **uniquement** la logique de routing pour les articles (quelle route appelle quelle fonction)

Cette séparation permet :
- De garder `index.js` léger et lisible
- D'ajouter facilement de nouvelles ressources (créer un nouveau fichier `routes/users.routes.js` par exemple)
- De mieux organiser le code par domaine fonctionnel
- De faciliter la maintenance et les tests

## Objectif de cet exercice

Séparer le routing des articles dans un fichier dédié `routes/articles.routes.js`, tout en gardant la logique métier dans le router pour l'instant (on l'extraira dans les parties suivantes).

## Instructions

1. Reprenez le code de la **Partie 5** (API avec persistance)
2. Créez un dossier `routes` à la racine de votre projet
3. Créez un fichier `routes/articles.routes.js` qui contiendra :
   - Une fonction `articlesRouter` qui prend en paramètres : `req`, `res`, `pathname`, et `method`
   - Cette fonction doit contenir **toute la logique de routing** des articles (tous les `if` pour les routes `/articles`)
   - La fonction doit retourner `true` si la route a été gérée, `false` sinon
   - Pour l'instant, gardez **toute la logique métier** dans cette fonction (on l'extraira plus tard)
4. Modifiez `index.js` pour :
   - Importer le router : `const articlesRouter = require('./routes/articles.routes');`
   - Dans le serveur, remplacer toute la logique de routing des articles par un simple appel au router
   - Si le router retourne `true`, la route est gérée, sinon on continue (pour gérer d'autres routes ou la 404)

## Structure attendue

```
correction/
├── index.js              (léger, délègue au router)
├── routes/
│   └── articles.routes.js  (contient toute la logique de routing)
└── data/
    └── articles.json
```

## Conseils

- Le router doit avoir accès aux variables `articles`, `nextId`, et aux fonctions `loadArticles`, `saveArticles`, `sendJson`, `notFound`, `parseBody`
- Vous pouvez soit les passer en paramètres, soit les importer directement dans le router
- Pour simplifier, vous pouvez importer directement les fonctions utilitaires dans le router
- Le router doit gérer toutes les routes `/articles` et `/articles/:id`

## Test

Une fois terminé, votre API doit fonctionner exactement comme avant, mais avec une meilleure organisation du code. Testez toutes les routes pour vérifier que tout fonctionne.

