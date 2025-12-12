const http = require('http');
const { parse } = require('url');

// Fonction utilitaire pour envoyer une réponse JSON
const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

// Fonction pour gérer les routes non trouvées
const notFound = (res) => {
  sendJson(res, 404, { error: 'Not found' });
};

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  // Extraction du pathname depuis l'URL
  const { pathname } = parse(req.url);
  // Récupération de la méthode HTTP (GET, POST, etc.)
  const method = req.method.toUpperCase();

  // Route GET /hello-world
  if (pathname === '/hello-world' && method === 'GET') {
    return sendJson(res, 200, { message: 'Hello World!' });
  }

  // Toutes les autres routes retournent une 404
  notFound(res);
});

// Le serveur écoute sur le port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

