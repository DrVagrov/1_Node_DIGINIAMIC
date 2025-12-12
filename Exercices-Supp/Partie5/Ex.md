# Partie 5 : Persistance des données avec JSON

## Objectif
Ajouter la persistance des données en sauvegardant les articles dans un fichier JSON. Les données seront conservées même après le redémarrage du serveur.

## Instructions

1. Reprenez le code de la **Partie 4** (API REST complète avec GET, POST, PUT, DELETE)
2. Créez un dossier `data` à la racine de votre projet
3. Créez un fichier `data/articles.json` qui contiendra vos articles sous forme de tableau JSON
4. Au démarrage du serveur :
   - Chargez les articles depuis le fichier `data/articles.json` dans votre tableau en mémoire
   - Si le fichier n'existe pas ou est vide, initialisez avec un tableau vide
   - Calculez le `nextId` en fonction du plus grand ID existant dans les données chargées
5. Après chaque modification (POST, PUT, DELETE) :
   - Sauvegardez le tableau mis à jour dans le fichier `data/articles.json`
6. Gérer les erreurs de lecture/écriture de fichier de manière appropriée

## Structure du fichier JSON

Le fichier `data/articles.json` doit avoir cette structure :

```json
[
  {
    "id": 1,
    "title": "Introduction à Node.js",
    "author": "John Doe"
  },
  {
    "id": 2,
    "title": "Les bases du HTTP",
    "author": "Jane Smith"
  }
]
```

## Conseils

- Utilisez le module `fs` pour lire et écrire les fichiers
- Utilisez le module `path` avec `path.join(__dirname, 'data', 'articles.json')` pour construire le chemin du fichier
- Utilisez `fs.readFileSync()` pour lire le fichier de manière synchrone au démarrage
- Utilisez `fs.writeFileSync()` pour sauvegarder les données de manière synchrone
- Utilisez `JSON.stringify(data, null, 2)` pour formater le JSON avec une indentation lisible
- Entourez la lecture du fichier dans un `try/catch` pour gérer le cas où le fichier n'existe pas encore
- Utilisez `Array.isArray()` pour vérifier que les données parsées sont bien un tableau
- Pour calculer le `nextId`, utilisez `reduce()` pour trouver le plus grand ID existant

## Fonctions à créer

- `loadArticles()` : charge les articles depuis le fichier JSON
- `saveArticles(data)` : sauvegarde les articles dans le fichier JSON

## Test

1. Démarrez le serveur → les articles doivent être chargés depuis `data/articles.json`
2. Créez un nouvel article avec POST → vérifiez que le fichier `data/articles.json` est mis à jour
3. Modifiez un article avec PUT → vérifiez que le fichier est mis à jour
4. Supprimez un article avec DELETE → vérifiez que le fichier est mis à jour
5. Redémarrez le serveur → les modifications doivent être conservées

