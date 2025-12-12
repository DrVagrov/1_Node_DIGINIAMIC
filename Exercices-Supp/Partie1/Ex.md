# Partie 1 : Serveur HTTP basique

## Objectif
Créer un serveur HTTP simple avec Node.js en utilisant le module natif `http`.

## Instructions

1. Créez un serveur HTTP en utilisant le module `http` de Node.js
2. Le serveur doit écouter sur le port **3000**
3. Implémentez une route **GET** sur le chemin `/hello-world`
4. Cette route doit retourner un message simple (par exemple : `{ "message": "Hello World!" }`)
5. Pour toutes les autres routes, retournez une réponse 404 avec un message d'erreur

## Conseils

- Utilisez `http.createServer()` pour créer le serveur
- Utilisez `parse()` du module `url` pour extraire le `pathname` de l'URL
- Vérifiez la méthode HTTP avec `req.method`
- Utilisez `res.writeHead()` pour définir le statut et les headers
- Utilisez `res.end()` pour envoyer la réponse
- N'oubliez pas de définir le `Content-Type` à `application/json` pour les réponses JSON

## Test

Une fois votre serveur lancé, testez avec :
- `GET http://localhost:3000/hello-world` → doit retourner votre message
- `GET http://localhost:3000/autre-route` → doit retourner une 404

