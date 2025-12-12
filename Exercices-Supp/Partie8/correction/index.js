const http = require('http');
const { parse } = require('url');

// Import du router des articles
const articlesRouter = require('./routes/articles.routes');

// Import des utilitaires HTTP
const { notFound } = require('./utils/http');

// -------------------- Configuration --------------------

const PORT = 3000;

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
    const handled = await articlesRouter(req, res, pathname, method);
    
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
  console.log(`API REST avec architecture complète démarrée sur http://localhost:${PORT}`);
  console.log('Architecture : Router → Controller → Service');
});

