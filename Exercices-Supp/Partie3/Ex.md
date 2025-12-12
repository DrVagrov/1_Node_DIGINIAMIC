# Partie 3 : API REST - Ajout de POST

## Objectif
Étendre l'API de la Partie 2 en ajoutant la possibilité de créer de nouveaux articles via une requête POST.

## Instructions

1. Reprenez le code de la **Partie 2** (routes GET `/articles` et GET `/articles/:id`)
2. Ajoutez une route **POST `/articles`** qui permet de créer un nouvel article
3. La route POST doit :
   - Lire le corps de la requête (body) qui contient les données JSON de l'article
   - Générer un nouvel ID unique pour l'article (vous pouvez utiliser un compteur ou un nombre aléatoire)
   - Ajouter le nouvel article au tableau
   - Retourner l'article créé avec un statut **201 (Created)**
4. Gérer les erreurs : si le JSON est invalide ou si des champs requis sont manquants, retourner une erreur **400 (Bad Request)**

## Structure de l'article

Un article doit avoir au minimum :
- `title` : le titre (requis)
- `author` : l'auteur (requis)

L'`id` sera généré automatiquement par le serveur.

## Conseils

- Utilisez une fonction `parseBody()` qui retourne une Promise pour lire le corps de la requête
- Le body arrive en morceaux (streams), utilisez `req.on('data', ...)` et `req.on('end', ...)`
- Parsez le JSON avec `JSON.parse()`
- Utilisez `try/catch` pour gérer les erreurs de parsing JSON
- Vérifiez que les champs requis sont présents avant de créer l'article
- Utilisez un compteur `nextId` pour générer des IDs uniques

## Test

Une fois votre serveur lancé, testez avec :
- `POST http://localhost:3000/articles` avec un body JSON :
  ```json
  {
    "title": "Nouvel article",
    "author": "Alice Brown"
  }
  ```
  → doit créer l'article et retourner un statut 201
- `GET http://localhost:3000/articles` → doit maintenant inclure le nouvel article
- `POST http://localhost:3000/articles` avec un body invalide → doit retourner une 400

