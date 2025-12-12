// Controller pour les articles
// Le controller gère la logique métier HTTP : validation, réponses HTTP, gestion des erreurs
// Il appelle le service pour manipuler les données

const { sendJson, notFound, parseBody } = require('../utils/http');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../services/articles.service');

// Liste tous les articles
const listArticles = (res) => {
  const articles = getAll();
  return sendJson(res, 200, articles);
};

// Récupère un article par son ID
const getArticle = (res, id) => {
  const article = getById(id);
  if (!article) {
    return notFound(res);
  }
  return sendJson(res, 200, article);
};

// Crée un nouvel article
const createArticle = async (req, res) => {
  try {
    // Lecture et parsing du corps de la requête
    const body = await parseBody(req);
    
    // Validation des champs requis
    if (!body.title || !body.author) {
      return sendJson(res, 400, { 
        error: 'Les champs title et author sont requis' 
      });
    }
    
    // Appel du service pour créer l'article
    const newArticle = create(body);
    
    // Retour de l'article créé avec le statut 201
    return sendJson(res, 201, newArticle);
  } catch (err) {
    // Gestion des erreurs (JSON invalide, erreur de sauvegarde, etc.)
    return sendJson(res, 400, { error: err.message });
  }
};

// Met à jour un article par son ID
const updateArticle = async (req, res, id) => {
  try {
    // Lecture et parsing du corps de la requête
    const body = await parseBody(req);
    
    // Appel du service pour mettre à jour l'article
    const updatedArticle = update(id, body);
    
    // Si l'article n'existe pas, le service retourne null
    if (!updatedArticle) {
      return notFound(res);
    }
    
    // Retour de l'article mis à jour
    return sendJson(res, 200, updatedArticle);
  } catch (err) {
    // Gestion des erreurs (JSON invalide, erreur de sauvegarde, etc.)
    return sendJson(res, 400, { error: err.message });
  }
};

// Supprime un article par son ID
const deleteArticle = (res, id) => {
  // Appel du service pour supprimer l'article
  const deleted = remove(id);
  
  // Si l'article n'existe pas, le service retourne false
  if (!deleted) {
    return notFound(res);
  }
  
  // Retour d'un statut 204 (No Content) sans corps
  res.writeHead(204);
  return res.end();
};

module.exports = {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};

