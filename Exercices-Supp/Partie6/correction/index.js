const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

// Import du router des articles
const articlesRouter = require('./routes/articles.routes');

// --------------------   Création des variables utiles --------------------

// Chemin de la "base de données"
const DB_PATH = path.join(__dirname, 'data', 'articles.json');
const PORT = 3000;

// -------------------- Fonctions utiles --------------------

// Charge les données de la base de données dans un tableau
const loadArticles = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Impossible de lire ${DB_PATH}, tableau vide`, err.message);
    return [];
  }
};

// Enregistre les données dans la base de données
const saveArticles = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Impossible d'écrire dans ${DB_PATH}`, err.message);
  }
};

// Fonction pour gérer les routes non trouvées
const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
};

// -------------------- Fonction particulière : le serveur --------------------

// Création du serveur HTTP
const server = http.createServer(async (req, res) => {
  // Extraction du pathname depuis l'URL
  const { pathname } = parse(req.url);
  // Récupération de la méthode HTTP
  const method = req.method.toUpperCase();

  // Délégation du routing des articles au router spécialisé
  // Le router retourne true si la route a été gérée, false sinon
  if (pathname?.startsWith('/articles')) {
    const handled = await articlesRouter(req, res, pathname, method, {
      loadArticles,
      saveArticles
    });
    
    // Si la route est gérée, on retourne
    if (handled) return;
  }

  // Ici on pourrait ajouter d'autres routers pour d'autres ressources
  // if (pathname?.startsWith('/users')) {
  //   const handled = await usersRouter(req, res, pathname, method);
  //   if (handled) return;
  // }

  // Si aucune route n'a été gérée, on retourne une 404
  notFound(res);
});

// -------------------- Lancement de l'API --------------------

// Le serveur écoute sur le port 3000
server.listen(PORT, () => {
  const articles = loadArticles();
  console.log(`API REST avec routing modulaire démarrée sur http://localhost:${PORT}`);
  console.log(`Données chargées depuis ${DB_PATH}`);
  console.log(`${articles.length} article(s) chargé(s)`);
});

