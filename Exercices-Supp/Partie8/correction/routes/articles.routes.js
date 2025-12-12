// Router pour les routes des articles
// Le router fait UNIQUEMENT le routing : il vérifie la route et appelle la bonne fonction du controller
// Il ne contient AUCUNE logique métier

// Import des fonctions du controller
const {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles.controller');

// Fonction router principale
// Elle reçoit req, res, pathname et method
module.exports = async function articlesRouter(req, res, pathname, method) {
  
  // Route GET /articles - liste tous les articles
  if (pathname === '/articles' && method === 'GET') {
    listArticles(res);
    return true;
  }

  // Route POST /articles - crée un nouvel article
  if (pathname === '/articles' && method === 'POST') {
    await createArticle(req, res);
    return true;
  }

  // Gestion des routes avec ID (/articles/:id)
  if (pathname.startsWith('/articles/')) {
    // Extraction de l'ID depuis l'URL
    const id = Number(pathname.split('/')[2]);
    
    // Si l'ID n'est pas un nombre valide, on ne gère pas cette route
    if (Number.isNaN(id)) {
      return false;
    }

    // Route GET /articles/:id - récupère un article par son ID
    if (method === 'GET') {
      getArticle(res, id);
      return true;
    }

    // Route PUT /articles/:id - met à jour un article
    if (method === 'PUT') {
      await updateArticle(req, res, id);
      return true;
    }

    // Route DELETE /articles/:id - supprime un article
    if (method === 'DELETE') {
      deleteArticle(res, id);
      return true;
    }
  }

  // Si aucune route n'a été gérée, on retourne false
  return false;
};

