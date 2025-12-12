const http = require('http');
const { parse } = require('url');

// Données en mémoire - tableau d'articles
let articles = [
  { id: 1, title: 'Introduction à Node.js', author: 'John Doe' },
  { id: 2, title: 'Les bases du HTTP', author: 'Jane Smith' },
  { id: 3, title: 'Créer une API REST', author: 'Bob Johnson' }
];

// Compteur pour générer des IDs uniques
let nextId = Math.floor(Math.random() * 1000000);

// Fonction utilitaire pour envoyer une réponse JSON
const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

// Fonction pour gérer les routes non trouvées
const notFound = (res) => {
  sendJson(res, 404, { error: 'Not found' });
};

// Fonction pour lire et parser le corps de la requête
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    // Accumulation des morceaux de données
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    // Quand toutes les données sont reçues
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Création du serveur HTTP
const server = http.createServer(async (req, res) => {
  // Extraction du pathname depuis l'URL
  const { pathname } = parse(req.url);
  // Récupération de la méthode HTTP
  const method = req.method.toUpperCase();

  // Route GET /articles - retourne tous les articles
  if (pathname === '/articles' && method === 'GET') {
    return sendJson(res, 200, articles);
  }

  // Gestion des routes avec ID (/articles/:id)
  if (pathname?.startsWith('/articles/')) {
    // Extraction de l'ID depuis l'URL
    const id = Number(pathname.split('/')[2]);
    
    // Recherche de l'index de l'article dans le tableau
    const index = articles.findIndex((a) => a.id === id);
    
    // Si l'article n'existe pas, retourner une 404
    if (index === -1) {
      return notFound(res);
    }

    // Route GET /articles/:id - retourne un article par son ID
    if (method === 'GET') {
      return sendJson(res, 200, articles[index]);
    }

    // Route PUT /articles/:id - met à jour un article
    if (method === 'PUT') {
      try {
        // Lecture et parsing du corps de la requête
        const body = await parseBody(req);
        
        // Mise à jour de l'article en fusionnant les données
        // L'ID est préservé et ne peut pas être modifié
        const updatedArticle = {
          ...articles[index],
          ...body,
          id // L'ID reste inchangé
        };
        
        // Remplacement de l'article dans le tableau
        articles[index] = updatedArticle;
        
        // Retour de l'article mis à jour
        return sendJson(res, 200, updatedArticle);
      } catch (err) {
        // Gestion des erreurs (JSON invalide, etc.)
        return sendJson(res, 400, { error: err.message });
      }
    }

    // Route DELETE /articles/:id - supprime un article
    if (method === 'DELETE') {
      // Suppression de l'article du tableau
      articles.splice(index, 1);
      
      // Retour d'un statut 204 (No Content) sans corps
      res.writeHead(204);
      return res.end();
    }
  }

  // Route POST /articles - crée un nouvel article
  if (pathname === '/articles' && method === 'POST') {
    try {
      // Lecture et parsing du corps de la requête
      const body = await parseBody(req);
      
      // Vérification des champs requis
      if (!body.title || !body.author) {
        return sendJson(res, 400, { 
          error: 'Les champs title et author sont requis' 
        });
      }
      
      // Création du nouvel article avec un ID unique
      const newArticle = {
        id: nextId++,
        title: body.title,
        author: body.author
      };
      
      // Ajout de l'article au tableau
      articles.push(newArticle);
      
      // Retour de l'article créé avec le statut 201
      return sendJson(res, 201, newArticle);
    } catch (err) {
      // Gestion des erreurs (JSON invalide, etc.)
      return sendJson(res, 400, { error: err.message });
    }
  }

  // Toutes les autres routes retournent une 404
  notFound(res);
});

// Le serveur écoute sur le port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`API REST complète démarrée sur http://localhost:${PORT}`);
});

