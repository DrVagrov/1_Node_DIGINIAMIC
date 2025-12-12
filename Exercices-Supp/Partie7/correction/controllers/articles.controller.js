// Controller pour les articles
// Le controller gère la logique métier : validation, réponses HTTP, gestion des erreurs
// Pour l'instant, il contient aussi la logique de données (on l'extraira dans la partie suivante)

const { sendJson, notFound, parseBody } = require('../utils/http');

// Liste tous les articles
const listArticles = (res, articles) => {
  return sendJson(res, 200, articles);
};

// Récupère un article par son ID
const getArticle = (res, id, articles) => {
  const article = articles.find((a) => a.id === id);
  if (!article) {
    return notFound(res);
  }
  return sendJson(res, 200, article);
};

// Crée un nouvel article
const createArticle = async (req, res, articles, nextId, saveArticles) => {
  try {
    // Lecture et parsing du corps de la requête
    const body = await parseBody(req);
    
    // Validation des champs requis
    if (!body.title || !body.author) {
      return sendJson(res, 400, { 
        error: 'Les champs title et author sont requis' 
      });
    }
    
    // Création du nouvel article avec un ID unique
    const newArticle = {
      id: nextId,
      title: body.title,
      author: body.author
    };
    
    // Ajout de l'article au tableau
    articles.push(newArticle);
    
    // Sauvegarde dans le fichier JSON
    saveArticles(articles);
    
    // Retour de l'article créé avec le statut 201
    return sendJson(res, 201, newArticle);
  } catch (err) {
    // Gestion des erreurs (JSON invalide, etc.)
    return sendJson(res, 400, { error: err.message });
  }
};

// Met à jour un article par son ID
const updateArticle = async (req, res, id, articles, saveArticles) => {
  try {
    // Recherche de l'index de l'article dans le tableau
    const index = articles.findIndex((a) => a.id === id);
    
    // Si l'article n'existe pas, retourner une 404
    if (index === -1) {
      return notFound(res);
    }
    
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
};

// Supprime un article par son ID
const deleteArticle = (res, id, articles, saveArticles) => {
  // Recherche de l'index de l'article dans le tableau
  const index = articles.findIndex((a) => a.id === id);
  
  // Si l'article n'existe pas, retourner une 404
  if (index === -1) {
    return notFound(res);
  }
  
  // Suppression de l'article du tableau
  articles.splice(index, 1);
  
  // Sauvegarde dans le fichier JSON
  saveArticles(articles);
  
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

