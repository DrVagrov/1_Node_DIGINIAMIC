# Partie 4 : API REST complète - PUT et DELETE

## Objectif
Compléter l'API REST en ajoutant les méthodes PUT (mise à jour) et DELETE (suppression) pour avoir un CRUD complet.

## Instructions

1. Reprenez le code de la **Partie 3** (routes GET `/articles`, GET `/articles/:id`, et POST `/articles`)
2. Ajoutez une route **PUT `/articles/:id`** qui permet de mettre à jour un article existant :
   - Vérifiez que l'article existe (sinon retourner 404)
   - Lisez le corps de la requête qui contient les nouvelles données
   - Mettez à jour l'article en conservant son ID (l'ID ne doit pas être modifiable)
   - Retournez l'article mis à jour avec un statut **200**
3. Ajoutez une route **DELETE `/articles/:id`** qui permet de supprimer un article :
   - Vérifiez que l'article existe (sinon retourner 404)
   - Supprimez l'article du tableau
   - Retournez un statut **204 (No Content)** sans corps de réponse
4. Gérer les erreurs appropriées (404 si l'article n'existe pas, 400 si le JSON est invalide)

## Conseils

- Pour PUT : utilisez le spread operator `{ ...article, ...body, id }` pour fusionner les données tout en préservant l'ID
- Pour DELETE : utilisez `splice()` ou `filter()` pour supprimer l'article du tableau
- Utilisez `findIndex()` pour trouver la position de l'article dans le tableau
- Pour DELETE, vous pouvez retourner `res.writeHead(204).end()` sans corps

## Test

Une fois votre serveur lancé, testez avec :

**PUT (mise à jour) :**
- `PUT http://localhost:3000/articles/1` avec un body JSON :
  ```json
  {
    "title": "Titre modifié",
    "author": "Nouvel auteur"
  }
  ```
  → doit mettre à jour l'article et retourner le statut 200
- `PUT http://localhost:3000/articles/999` → doit retourner une 404

**DELETE (suppression) :**
- `DELETE http://localhost:3000/articles/2` → doit supprimer l'article et retourner le statut 204
- `GET http://localhost:3000/articles` → l'article supprimé ne doit plus apparaître
- `DELETE http://localhost:3000/articles/999` → doit retourner une 404

**Vérification complète :**
- Testez toutes les opérations CRUD : Create (POST), Read (GET), Update (PUT), Delete (DELETE)

