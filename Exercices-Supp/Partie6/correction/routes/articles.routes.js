// Router pour les routes des articles
// Ce router contient toute la logique de routing (quelle route appelle quelle action)
// Pour l'instant, il contient aussi la logique métier (on l'extraira dans les parties suivantes)

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
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

// Fonction router principale
// Elle reçoit req, res, pathname, method et un objet avec les fonctions nécessaires
module.exports = async function articlesRouter(req, res, pathname, method, { loadArticles, saveArticles }) {
  
  // Route GET /articles - retourne tous les articles
  if (pathname === '/articles' && method === 'GET') {
    const articles = loadArticles();
    return sendJson(res, 200, articles);
  }

  // Gestion des routes avec ID (/articles/:id)
  if (pathname.startsWith('/articles/')) {
    // Extraction de l'ID depuis l'URL
    const id = Number(pathname.split('/')[2]);
    
    // Rechargement des articles pour avoir la dernière version
    let articles = loadArticles();
    
    // Recherche de l'index de l'article dans le tableau
    const index = articles.findIndex((a) => a.id === id);
    
    // Si l'article n'existe pas, retourner une 404
    if (index === -1) {
      notFound(res);
      return true; // Route gérée (même si c'est une 404)
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
        const updatedArticle = {
          ...articles[index],
          ...body,
          id // L'ID reste inchangé
        };
        
        // Remplacement de l'article dans le tableau
        articles[index] = updatedArticle;
        
        // Sauvegarde dans le fichier JSON
        saveArticles(articles);
        
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
      
      // Sauvegarde dans le fichier JSON
      saveArticles(articles);
      
      // Retour d'un statut 204 (No Content) sans corps
      res.writeHead(204);
      res.end();
      return true;
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
      
      // Rechargement des articles pour avoir la dernière version
      const currentArticles = loadArticles();
      const currentNextId = currentArticles.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;
      
      // Création du nouvel article avec un ID unique
      const newArticle = {
        id: currentNextId,
        title: body.title,
        author: body.author
      };
      
      // Ajout de l'article au tableau
      currentArticles.push(newArticle);
      
      // Sauvegarde dans le fichier JSON
      saveArticles(currentArticles);
      
      // Retour de l'article créé avec le statut 201
      return sendJson(res, 201, newArticle);
    } catch (err) {
      // Gestion des erreurs (JSON invalide, etc.)
      return sendJson(res, 400, { error: err.message });
    }
  }

  // Si aucune route n'a été gérée, on retourne false
  return false;
};

