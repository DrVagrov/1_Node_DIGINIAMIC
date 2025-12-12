# Partie 2 : API REST - GET (liste et par ID)

## Objectif
Créer une API REST simple qui permet de récupérer une liste d'articles et un article spécifique par son ID.

## Instructions

1. Créez un serveur HTTP qui écoute sur le port **3000**
2. Définissez un tableau d'articles en mémoire avec quelques exemples. Chaque article doit avoir :
   - `id` : un identifiant numérique unique
   - `title` : le titre de l'article (string)
   - `author` : l'auteur de l'article (string)
3. Implémentez deux routes GET :
   - **GET `/articles`** : retourne la liste complète des articles
   - **GET `/articles/:id`** : retourne un article spécifique par son ID
4. Si un article avec l'ID demandé n'existe pas, retournez une réponse 404
5. Pour toutes les autres routes, retournez une 404

## Exemple de données

```javascript
let articles = [
  { id: 1, title: 'Introduction à Node.js', author: 'John Doe' },
  { id: 2, title: 'Les bases du HTTP', author: 'Jane Smith' },
  { id: 3, title: 'Créer une API REST', author: 'Bob Johnson' }
];
```

## Conseils

- Utilisez `pathname.startsWith('/articles/')` pour détecter les routes avec ID
- Extrayez l'ID depuis l'URL avec `pathname.split('/')`
- Utilisez `findIndex()` ou `find()` pour chercher un article par ID
- Convertissez l'ID en nombre avec `Number()` ou `parseInt()`

## Test

Une fois votre serveur lancé, testez avec :
- `GET http://localhost:3000/articles` → doit retourner tous les articles
- `GET http://localhost:3000/articles/1` → doit retourner l'article avec l'ID 1
- `GET http://localhost:3000/articles/999` → doit retourner une 404
- `GET http://localhost:3000/autre-route` → doit retourner une 404

