// Service pour les articles
// Le service contient TOUTE la logique de manipulation des données
// Il ne connaît rien au HTTP, il manipule juste les données

const fs = require('fs');
const path = require('path');

// Chemin de la "base de données"
const DB_PATH = path.join(__dirname, '..', 'data', 'articles.json');

// Vérifie si le fichier de la base de données existe, sinon le crée
const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    // Crée le dossier data s'il n'existe pas
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    // Crée le fichier JSON avec un tableau vide
    fs.writeFileSync(DB_PATH, '[]');
  }
};

// Lance la vérification au chargement du module
ensureDb();

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
    throw err;
  }
};

// Initialisation : chargement des articles et calcul du prochain ID
let articles = loadArticles();
let nextId = articles.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;

// -------------------- Fonctions CRUD --------------------

// Récupère tous les articles
const getAll = () => {
  return articles;
};

// Récupère un article par son ID
const getById = (id) => {
  const article = articles.find((a) => a.id === id);
  return article || null;
};

// Crée un nouvel article
const create = (payload) => {
  const newArticle = {
    id: nextId++,
    title: payload.title,
    author: payload.author
  };
  articles.push(newArticle);
  saveArticles(articles);
  return newArticle;
};

// Met à jour un article par son ID
const update = (id, payload) => {
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return null;
  }
  const updatedArticle = {
    ...articles[index],
    ...payload,
    id // L'ID reste inchangé
  };
  articles[index] = updatedArticle;
  saveArticles(articles);
  return updatedArticle;
};

// Supprime un article par son ID
const remove = (id) => {
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return false;
  }
  articles.splice(index, 1);
  saveArticles(articles);
  return true;
};

// Export des fonctions du service
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

